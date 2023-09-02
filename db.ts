import {Client, Pool} from 'pg';
import fs from 'fs';
import {parse} from 'pg-connection-string';
import {secondsToReadable} from './utils';

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

  const client = new Client(config);
  await client.connect();

  try {
    const {rows: [postgresVersion]} = await client.query('SELECT version();');
    console.log('Postgres version:', postgresVersion?.version);
    await client.query('BEGIN');
    const latestVersion = await executeSql(client, 'SELECT MAX(db_version) as latest from db_versions');
    version = latestVersion?.rows?.[0]?.latest || 0;
    const maxVersion = process.env.DATABASE_VERSION || 999999;
    const basePath = './db/db_migrate';
    console.log(`Current database version: ${version}`);
    while(version < maxVersion && fs.existsSync(`${basePath}/${version + 1}.sql`)) {
      const startTime = new Date().valueOf();
      console.log(`Migrating the database to version: ${++version}`);
      const versionPath = `${basePath}/${version}`;
      /* eslint-disable no-await-in-loop */
      await executeSql(client, `${versionPath}.sql`, `Migrated to version: ${version}.`);
      await executeSql(client, `INSERT INTO db_versions (db_version) VALUES (${version})`);
      const runtimeMS = new Date().valueOf() - startTime;
      console.log(`Migration to ${version} took ${secondsToReadable(runtimeMS / 1000)}`);
      /* eslint-enable no-await-in-loop */
    }
    await client.query('COMMIT');
  } catch(e) {
    console.log('Error while migrating the database:', e);
    await client.query('ROLLBACK');
    throw new Error('Database Upgrade Failed');
  } finally {
    await client.end();
  }
}

async function query(text: string, params?: any) {
  return pool.query(text, params)
}

async function file(path: string, params?: object) {
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
  
  return pool.query(sql, args);
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
  query,
  file,
  end,
};
