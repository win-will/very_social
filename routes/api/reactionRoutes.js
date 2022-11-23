const router = require('express').Router();
const {
  getReactions,
  getSingleReaction,
  createReaction,
  updateReaction,
  deleteReaction,
} = require('../../controllers/reactionController');

// /api/reactions
router.route('/').get(getReactions).post(createReaction);

// /api/reactions/:reactionId
router
  .route('/:reactionId')
  .get(getSingleReaction)
  .put(updateReaction)
  .delete(deleteReaction);