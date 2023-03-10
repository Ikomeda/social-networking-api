const router = require('express').Router();
const {
    getThoughts,
    getSingleThought,
    createThought,
    addReaction,
    removeReaction,
    deleteThought
} = require('../../controllers/thoughtController');

router.route('/').get(getThoughts).post(createThought);

router.route('/:thoughtId').get(getSingleThought).delete(deleteThought);

router.route('/:thoughtId/reactions').post(addReaction);

router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction)

module.exports = router;