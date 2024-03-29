import express from 'express';
import { GameData, GameType, Player, PlayerGameData } from '../types/models/pool';
import { 
  addPlayerScore, 
  archiveGame, 
  createNewPoolGame, 
  getGameData, 
  getPlayerGames, 
  getPlayerStats, 
  subtractPlayerScore, 
  updateGameTags,
  upsertPlayerSkill,
} from '../controllers/pool';
import { ApplicationError } from '../lib/applicationError';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Get all games
router.route('/')
  .all(verifyToken)
  .get(async (req, res, next) => {
    const {user_id} = req.user || {user_id: ''};
    try {
      const [games, stats] = await Promise.all([
        getPlayerGames(user_id),
        getPlayerStats(user_id),
      ]);
      res.status(200).json({games, stats});
    } catch(err) {
      next(err);
    }
  })
  .post<any, any, {players: Player[], game_type: GameType}, any>(async (req, res, next) => {
    // <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = QueryString.ParsedQs>
    // Create new game
    const {players, game_type} = req.body;
    try {
      const pool_game_id = await createNewPoolGame(players, game_type);
      res.status(200).json({pool_game_id});
    } catch(err) {
      next(err);
    }
  });

router.route('/:pool_game_id')
  .all(verifyToken)
  .get(async (req, res, next) => {
    const {pool_game_id} = req.params;
    try {
      const game = await getGameData(pool_game_id);
      res.status(200).json(game);
    } catch(err) {
      next(err);
    }
  })
  .patch(async (req, res, next) => {
    const {pool_game_id} = req.params;
    const {tags} = req.body;
    try {
      await updateGameTags(pool_game_id, tags);
      res.sendStatus(200);
    } catch(err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    const {pool_game_id} = req.params;
    try {
      await archiveGame(pool_game_id);
      res.sendStatus(200);
    } catch(err) {
      next(err);
    }
  });

router.post<{pool_game_id: string, action: string}, GameData, {user_id: string|null}, any>('/:pool_game_id/scores/:action', 
  async (req, res, next) => {
    const {pool_game_id, action} = req.params;
    const {user_id} = req.body;

    try {
      if(action === 'add') {
        await addPlayerScore({pool_game_id, user_id});
      } else if(action === 'subtract') {
        await subtractPlayerScore({pool_game_id, user_id});
      } else {
        throw new ApplicationError({
          type: ApplicationError.TYPES.CLIENT,
          code: 'INVALID_POOL_ACTION',
          message: 'Scores update action is not add or subtrack.',
          statusCode: 400,
          statusMessage: 'Sorry, something went wrong.',
        });
      }
      const game = await getGameData(pool_game_id);
      res.status(200).json(game);
    } catch(err) {
      next(err);
    }
  });

export = router;
