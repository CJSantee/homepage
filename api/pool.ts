import express from 'express';
import { Player } from '../types/models/pool';
import { createNewPoolGame, getGameData } from '../controllers/pool';

const router = express.Router();

// Get all games
router.get('/');

// Create new game
router.post<any, {players: Player[]}, any, any>('/', async (req, res, next) => {
  const {players} = req.body;
  try {
    const pool_game_id = await createNewPoolGame(players);
    res.status(200).json({pool_game_id});
  } catch(err) {
    next(err);
  }
});

router.get('/:pool_game_id', async (req, res, next) => {
  const {pool_game_id} = req.params;
  try {
    const game_data = await getGameData(pool_game_id);
    res.status(200).json(game_data)
  } catch(err) {
    next(err);
  }
});

router.post('/:pool_game_id/scores');

export = router;
