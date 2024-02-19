export interface PoolGame {
    pool_game_id: string,
    started: string,
    winner_user_id: string,
    users: {
        user_id: string,
        username: string,
        score: number,
        handicap: number,
        winner: boolean,
    }[]
};
