export interface Player {
  user_id: string,
  handicap: number,
  score?: number,
};

export interface PlayerGameData {
  username: string,
  user_id: string,
  racks: number[],
  total: number,
  remaining: number,
};
