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

export enum GameType {
  EIGHT_BALL = '8-Ball',
  NINE_BALL = '9-Ball',
}

export type EightBallSkillLevel = 2|3|4|5|6|7;
export type NineBallSkillLevel = 1|2|3|4|5|6|7|8|9;

export interface SkillLevels {
  '8-Ball': EightBallSkillLevel,
  '9-Ball': NineBallSkillLevel,
}

export interface PlayerStats {
  games_played: number,
  games_won: number,
  win_percentage: number,
  skill_levels: SkillLevels,
}