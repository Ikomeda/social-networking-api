const { User, Thought } = require('../models');

module.exports = {
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },

    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with that ID my guy/girl/non-binary friend'})
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No User with this ID!'})
                    : res.json(user)
                    )
                    .catch((err => res.status(500).json(err)));
    },

    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID exists' })
                    : Thought.deleteMany({ _id: { $in: user.thoughts }})
            )
            .then(() => res.json({ message: 'User and associated thoughts have been DELETED!'}))
            .catch((err) => res.status(500).json(err));
    },

    async addFriend({ params }, res) {
        try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId }},
            { new: true, runValidators: true }
        );
        return res.json(updatedUser)
        } catch (err) {
            console.log(err);
            return res.status(400).json(err);
        }
    },
    
    async removeFriend( {  params }, res) {
        const updatedUser = await User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId}},
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'Unable to find user with this id.'});  
    }
    return res.json(updatedUser);
},
}