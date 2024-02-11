import express from 'express';

const router = express.Router();

// Get all games
router.get('/');

// Create new game
router.post('/');

router.post('/:pool_game_id/scores');

export = router;
