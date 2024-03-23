export interface Player {
  user_id: string,
  handicap: number,
  score?: number,
};

export interface GameData {
  players: PlayerGameData[],
}

export interface PlayerGameData {
  username: string,
  user_id: string,
  racks: number[],
  total: number,
  remaining: number,
};

export enum GameType {
  EIGHT_BALL = '8-Ball',
  NINE_BALL = '9-Ball',
};

interface SkillLevels {
  '8-Ball': number,
  '9-Ball': number,
};
export interface PlayerStatsDB {
  games_played: number,
  games_won: number,
  skill_levels: SkillLevels,
}