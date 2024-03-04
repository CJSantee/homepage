export interface PoolGame {
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
  }[]
};

export interface Player {
  username: string,
  user_id: string,
  racks: number[],
  total: number,
  handicap: number,
  remaining: number,
  winner: boolean,
}