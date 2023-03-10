const { Thought } = require('../models');
const reactionSchema  = require('../models/Reaction')

module.exports = {
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought
                    ?res.status(404).json({ message: 'No thought with that ID'})
                    :res.json(thought)
                    )
                    .catch((err) => res.status(500).json(err));
    },

    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err));
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true}
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No Thought with that ID'})
                    : res.json(thought)
                    )
                    .catch((err) => res.status(500).json({ message: err}));
        },

        deleteThought(req, res) {
            Thought.findOneAndDelete({ _id: req.params.thoughtId })
                .then((thought) =>
                    !thought
                        ? res.status(404).json({ message: 'No thought with that ID'})
                        : reactionSchema.deleteMany({ _id: { $in: thought.reactions }})
                    )
                    .then(() => res.json({ message: 'Thought and associated Reactions were deleted.'}))
                    .catch((err) => res.status(500).json(err));
        },

        async addReaction({ params, body }, res) {
            try {
                const updatedThought = await Thought.findOneAndUpdate(
                    { _id: params.thoughtId },
                    { $addToSet: { reactions: body }},
                    { new: true, runValidators: true }
                );
                return res.json(updatedThought)
            } catch (err) {
                console.log(err);
                return res.status(400).json(err);
            }
        },

        async removeReaction( { params }, res) {
            const updatedThought =  await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $pull: { reactionId: params.reactionId }},
                { new: true }
            );
            if (!updatedThought) {
                return res.status(404).json({ message: 'Unable to find thought with that ID'});
            }
            return res.json(updatedThought);
        }
    }