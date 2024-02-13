import {Client, Pool, Query, QueryResultRow} from 'pg';
import fs from 'fs';
import {parse} from 'pg-connection-string';
import {once, secondsToReadable} from './utils';

const PREFIX = 'cs\\_'; // all types, functions, and triggers should start with prefix

const PRODUCTION = process.env.NODE_ENV === 'production';
const DATABASE_URL = process.env.DATABASE_URL || '';

const connectionOptions = parse(DATABASE_URL);
const config = {
  user: connectionOptions.user, 
  password: connectionOptions.password, 
  host: connectionOptions.host || '', 
  database: connectionOptions.database || '', 
  port: parseInt(connectionOptions.port || '5432'),
  ssl: PRODUCTION ? {rejectUnauthorized: false} : undefined,
}

type QueryResult<T> = {
  rows: T[],
};

/*
  Defaults to .env variables:
  PGHOST, PGUSER, PGDATABASE, PGPORT
 */
const pool = new Pool(config);
let version;

async function upgrade() {
  console.log('Upgrading database.');

  /**
  * @description Execute SQL from a file or string
  */
  async function executeSql(client, filename_or_sql: string, logMessage?: string) {
    let sql = filename_or_sql;
    if(filename_or_sql.toLowerCase().endsWith('.sql')) {
      if(!fs.existsSync(filename_or_sql)) {
        return undefined;
      }
      sql = fs.readFileSync(filename_or_sql).toString();
    }
    let result;
    try {
      result = await client.query(sql);
      if(logMessage) {
        console.log(logMessage);
      }
    } catch(e) {
      const msg = `SQL error: ${filename_or_sql}: ${e}.`;
      console.log(msg);
      throw e;
    }
    return result;
  }

  async function dropWrapper(client) {
    const sqlLines: string[] = [];

    // Construct a regex to match all routines that start with the prefix or start with a table name followed by an underscore
    // The view pg_tables provides acess to useful information about each table in the database. Ref: https://www.postgresql.org/docs/current/view-pg-tables.html
    const pronameMatch = `(SELECT '^(${PREFIX}' || '|' || STRING_AGG(t.tablename || '_', '|') || ')' AS table_names FROM pg_tables t WHERE t.schemaname = 'public')`

    interface ResultRow {
      sql: string,
    }
    interface QueryResult {
      rows: ResultRow[],
    }
    // Drop functions
    // The catalog pg_proc stores information about functions, aggregate functions, and window functions (collectively also known as routines). Ref: https://www.postgresql.org/docs/current/catalog-pg-proc.html
    // The catalog pg_namespace stores namespaces. A namespace is the structure underlying SQL schemas: each namespace can have a separate colletion of relations, types, etc. without name conflicts. Ref: https://www.postgresql.org/docs/current/catalog-pg-namespace.html
    let result: QueryResult = await client.query(`
      SELECT 'DROP FUNCTION IF EXISTS ' || ns.nspname || '.' || proname || '(' || oidvectortypes(proargtypes) || ') CASCADE;' AS sql
      FROM pg_proc 
      INNER JOIN pg_namespace ns ON (pg_proc.pronamespace = ns.oid)
      WHERE ns.nspname = 'public' AND pg_proc.prokind = 'f' AND proname ~ ${pronameMatch}
    `);
    for(const row of result.rows) {
      sqlLines.push(row.sql);
    }

    await client.query(sqlLines.join(';'))
  }

  const dbFunctionPaths = ['./db/db_functions', './db/db_triggers'];

  async function createWrapper(client) {
    await client.query('BEGIN');
    
    await dropWrapper(client);

    try {
      for(const dbFunctionPath of dbFunctionPaths) {
        for(const sqlFilename of fs.readdirSync(dbFunctionPath)) {
          await executeSql(client, `${dbFunctionPath}/${sqlFilename}`);
        }
      }

      await client.query('COMMIT');
    } catch(e) {
      console.log('Failed to execute database wrapper scripts.');
      console.log('Database wrapper error:', e);
      await client.query('ROLLBACK');
      throw new Error('Database wrapper failed');
    }
  }

  // Create Client
  const client = new Client(config);
  await client.connect();

  try {
    // Get Postgres Version
    const {rows: [postgresVersion]} = await client.query('SELECT version();');
    console.log('Postgres version:', postgresVersion?.version);

    // Begin Transaction
    await client.query('BEGIN');

    // Get current db_version
    const {rows: [{exists}]} = await executeSql(client, "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'db_versions')");
    if(!exists) {
      version = 0;
    } else {
      const {rows: [{latest}]} = await executeSql(client, 'SELECT MAX(db_version) as latest from db_versions');
      version = latest;
    }

    const maxVersion = process.env.DATABASE_VERSION || 999999;
    console.log(`Current database version: ${version}`);

    // Run db migrations
    const basePath = './db/db_migrate';
    while(version < maxVersion && fs.existsSync(`${basePath}/${version + 1}.sql`)) {
      const startTime = new Date().valueOf();
      console.log(`Migrating the database to version: ${++version}`);
      const versionPath = `${basePath}/${version}`;
      /* eslint-disable no-await-in-loop */
      await dropWrapper(client);
      await executeSql(client, `${versionPath}.sql`, `Migrated to version: ${version}.`);
      await executeSql(client, `INSERT INTO db_versions (db_version) VALUES (${version})`);
      const runtimeMS = new Date().valueOf() - startTime;
      console.log(`Migration to ${version} took ${secondsToReadable(runtimeMS / 1000)}`);
      /* eslint-enable no-await-in-loop */
    }

    // Commit Transaction
    await client.query('COMMIT');

    // Create updated functions
    if(dbFunctionPaths.length) {
      await createWrapper(client);
    }

    console.log('Database Upgrade Complete!');
  } catch(e) {
    console.log('Error while migrating the database:', e);
    await client.query('ROLLBACK');
    throw new Error('Database Upgrade Failed');
  } finally {
    await client.end();
  }
}

type FunctionSignatures = {
  [function_name: string]: string[]
}
let functionSignatures: FunctionSignatures|undefined;
const load = once(async () => {
  if(functionSignatures) {
    return;
  }
  console.log('Loading database');
  // Query for all the function signatures with the appropriate prefix
  const {rows: functionParams} = await pool.query(`
    SELECT proname AS name,
      pg_get_function_arguments(pg_proc.oid) AS args
    FROM pg_proc
    INNER JOIN pg_namespace ns ON pg_proc.pronamespace = ns.oid
    WHERE proname LIKE '${PREFIX}%'; 
  `);

  // Build the function signatures map 
  functionSignatures = functionParams.reduce((signatures, fxn) => {
    const signatureArgs = fxn.args.split(', ').reduce((args, arg) => {
      const argList = arg.split(' ');
      args.push(argList[0].slice(1));
      return args;
    }, []);

    if(signatureArgs[0] === '') {
      signatures[fxn.name] = [];
    } else {
      signatures[fxn.name] = signatureArgs;
    }

    return signatures;
  }, {});
});

async function query(text: string, params?: any) {
  return pool.query(text, params)
}

async function file<Type>(path: string, params: object = {}): Promise<QueryResult<Type>> {
  let sql: string;
  let namedParams: string[] = [];
  sql = fs.readFileSync(path).toString();
  const replacer = (match) => {
    const param = match.slice(2, -1); // remove '${' and '}'
    const idx = namedParams.indexOf(param);
    if(idx >= 0) {
      return `$${idx + 1}`;
    } else {
      namedParams.push(param);
      return `$${namedParams.length}`;
    }
  };
  sql = sql.replace(/\$\{[^{}]+\}/g, replacer);

  const args: string[] = [];
  if(namedParams) {
    for(const namedParam of namedParams) {
      args.push(params[namedParam]);
    }
  }
  
  return pool.query<Type extends QueryResultRow ? any : any>(sql, args).catch((err:any) => {
    const msg = `SQL error: ${path} (line: ${(sql.substring(0, err.position).match(/\n/g) || []).length})`;
    console.log(msg);
    throw err;
  });
}

/**
 * @description Call a database function
 */
async function call<Type>(functionName: string, params?: {[id: string]: any}): Promise<QueryResult<Type>> {
  if(!functionSignatures) throw new Error('Function Signatures Not Loaded.');
  const args = functionSignatures[functionName];

  let sql: string;
  const call_args: any[] = [];
  if(args.length > 0) {
    if(!params) throw new Error(`${functionName} called without parameters.`);
    const numbers = args.map((arg, i) => {
      if(!(arg in params)) {
        throw new Error(`${functionName} called without parameter: ${arg}`);
      }
      call_args.push(params[arg]);
      return i + 1;
    });
    sql = `SELECT * FROM ${functionName}($${numbers.join(',$')})`;
  } else {
    sql = `SELECT * FROM ${functionName}();`;
  }
  
  return pool.query<Type extends QueryResultRow ? any : any>(sql, call_args);
}

/**
 * @description Close the database pool
 */
async function end() {
  console.log('Database connections shutting down.');
  await pool.end();
  console.log('Database connections successfully shutdown.');
}

export = {
  upgrade,
  load,
  query,
  file,
  call,
  end,
};
