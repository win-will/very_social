const { User, Thoughts, Reactions } = require('../models');
const { ObjectId } = require('mongodb');

module.exports = {
  // Function to get all of the user by invoking the find() method with no arguments.
  // Then we return the results as JSON, and catch any errors. Errors are sent as JSON with a message and a 500 status code
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Gets a single user using the findOneAndUpdate method. We pass in the ID of the user and then respond with it, or an error if not found
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate('thoughts')
      .populate('friends')
      .populate({
        path: 'thoughts',
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: 'reactions' }
      })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Creates a new user. Accepts a request body with the entire User object.
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Updates user using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Deletes an user from the database. Looks for an app by ID.
  // Then if the User exists, we look for any users associated with the thoughts based on he user ID.
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then(async (user) => 
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : ( await Thoughts.deleteMany({ _id: { $in: user.thoughts } }),
              await Reactions.deleteMany({ username: user.username }),
              await User.updateMany(
                { },
                { $pull: {friends: { userId: user._id } } }
              ),
              console.log(user.username),
              console.log(user.thoughts)
            ),
            res.json({ message: 'User and associated thoughts and reactions deleted!' })
      )
      //.then(() => res.json({ message: 'User and associated thoughts and reactions deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // Adds a friend to an user. This method is unique in that we add the entire body of the  rather than the ID with the mongodb $addToSet operator.
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove user friend. This method finds the user based on ID. It then updates the friends array associated with the user in question by removing it's userId from the friends array.
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
