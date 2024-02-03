import db from "../db";
import {Player, PlayerGameData} from "../types/models/pool";

export async function createNewPoolGame(players:Player[]): Promise<string> {
  const {rows: [{cs_create_new_pool_game: pool_game_id}]} = await db.call<{cs_create_new_pool_game: number}>('cs_create_new_pool_game', {users: players});
  return `${pool_game_id}`;
}

export async function addPlayerScore({pool_game_id, user_id}:{pool_game_id: string, user_id: string}): Promise<number> {
  const {rows: [{cs_add_pool_player_score: score}]} = await db.call<{cs_add_pool_player_score: number}>('cs_add_pool_player_score', {pool_game_id, user_id});
  return Number(score);
}

export async function getGameData(pool_game_id:string): Promise<PlayerGameData[]> {
  const {rows: game_data} = await db.file<PlayerGameData>('db/pool/get_game_data.sql', {pool_game_id});
  return game_data;
}