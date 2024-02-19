import db from "../db";
import { ApplicationError } from "../lib/applicationError";
import {Player, PlayerGameData} from "../types/models/pool";

export async function createNewPoolGame(players:Player[]): Promise<string> {
  const {rows: [{cs_create_new_pool_game: pool_game_id}]} = await db.call<{cs_create_new_pool_game: number}>('cs_create_new_pool_game', {users: JSON.stringify(players)});
  return `${pool_game_id}`;
}

interface ScoreInput {
  pool_game_id: string,
  user_id: string|null,
};

export async function addPlayerScore({pool_game_id, user_id}:ScoreInput): Promise<number> {
  const {rows: [{cs_add_pool_player_score: score}]} = await db.call<{cs_add_pool_player_score: number}>('cs_add_pool_player_score', {pool_game_id, user_id});
  return Number(score);
}

export async function subtractPlayerScore({pool_game_id, user_id}:ScoreInput): Promise<number> {
  const {rows: [{cs_subtract_pool_player_score: score}]} = await db.call<{cs_subtract_pool_player_score: number}>('cs_subtract_pool_player_score', {pool_game_id, user_id});
  return Number(score);
}

export async function getGameData(pool_game_id:string): Promise<PlayerGameData[]> {
  const {rows: game_data} = await db.file<PlayerGameData>('db/pool/get_game_data.sql', {pool_game_id});
  return game_data;
}

interface PoolGame {
  pool_game_id: string,
  started: string,
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