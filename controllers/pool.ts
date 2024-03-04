import db from "../db";
import { io } from "../core/sockets";
import { ApplicationError } from "../lib/applicationError";
import { Player, PlayerGameData } from "../types/models/pool";

export async function createNewPoolGame(players:Player[]): Promise<string> {
  const {rows: [{cs_create_new_pool_game: pool_game_id}]} = await db.call<{cs_create_new_pool_game: number}>('cs_create_new_pool_game', {users: JSON.stringify(players)});
  players.forEach((player) => {
    const {user_id} = player;
    io.to(`user:${user_id}`).emit('games:new', {pool_game_id});
  });
  return `${pool_game_id}`;
}

interface ScoreInput {
  pool_game_id: string,
  user_id: string|null,
};

export async function addPlayerScore({pool_game_id, user_id}:ScoreInput): Promise<number> {
  try {
    const {rows: [{cs_add_pool_player_score: score}]} = await db.call<{cs_add_pool_player_score: number}>('cs_add_pool_player_score', {pool_game_id, user_id});
    return Number(score);
  } catch(err) {
    console.log('err', err);
    throw new ApplicationError({
      type: ApplicationError.TYPES.CLIENT,
      code: 'INVALID_RACK_ADDITION',
      message: 'Invalid Rack Action: add',
      statusMessage: 'Cannot add player score to the current rack.',
      statusCode: 400, 
    });
  }
}

export async function subtractPlayerScore({pool_game_id, user_id}:ScoreInput): Promise<number> {
  try {
    const {rows: [{cs_subtract_pool_player_score: score}]} = await db.call<{cs_subtract_pool_player_score: number}>('cs_subtract_pool_player_score', {pool_game_id, user_id});
    return Number(score);
  } catch(err) {
    console.log(err, 'err');
    throw new ApplicationError({
      type: ApplicationError.TYPES.CLIENT,
      code: 'INVALID_RACK_SUBTRACTION',
      message: 'Invalid Rack Action: subtract',
      statusMessage: 'Cannot remove player score from current rack.',
      statusCode: 400,
    });
  }
}

export async function getGameData(pool_game_id:string): Promise<PlayerGameData[]> {
  const {rows: game_data} = await db.file<PlayerGameData>('db/pool/get_game_data.sql', {pool_game_id});
  return game_data;
}

export async function updateGameTags(pool_game_id: string, tags: string[]) {
  await db.file('db/pool/update_tags.sql', {pool_game_id, tags});
}

export async function archiveGame(pool_game_id:string) {
  await db.file('db/pool/archive_game.sql', {pool_game_id});
}

interface PoolGame {
  pool_game_id: string,
  started: string,
  tags: string[],
  winner_user_id: string,
  users: {
    user_id: string,
    username: string,
    score: number,
    handicap: number,
    winner: boolean,
  }[],
};
export async function getPlayerGames(user_id:string|undefined) {
  if(!user_id) {
    throw new ApplicationError({
      type: ApplicationError.TYPES.SERVER,
      code: 'MISSING_USER_ID',
      message: 'undefined user_id',
      statusCode: 400,
    });
  }
  const {rows: games} = await db.file<PoolGame>('db/pool/get_player_games.sql', {user_id});
  return games;
}