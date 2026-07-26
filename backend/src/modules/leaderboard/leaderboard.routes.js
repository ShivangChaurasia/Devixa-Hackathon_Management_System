import { Router } from 'express';
import { leaderboardController } from './leaderboard.controller.js';

const router = Router();

// Public endpoint for live leaderboard
router.get('/:hackathonId', leaderboardController.getLeaderboard);

export default router;
