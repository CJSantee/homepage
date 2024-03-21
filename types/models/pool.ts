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

interface SkillLevels {
  '8-Ball': number,
  '9-Ball': number,
};
export interface PlayerStatsDB {
  games_played: number,
  games_won: number,
  skill_levels: SkillLevels,
}