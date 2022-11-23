const { User, Thoughts, Reactions } = require('../models');

module.exports = {
  // Function to get all of the applications by invoking the find() method with no arguments.
  // Then we return the results as JSON, and catch any errors. Errors are sent as JSON with a message and a 500 status code
  getReactions(req, res) {
    Reactions.find()
      .then((reactions) => res.json(reactions))
      .catch((err) => res.status(500).json(err));
  },
  // Gets a single reaction using the findOneAndUpdate method. We pass in the ID of the reaction and then respond with it, or an error if not found
  getSingleReaction(req, res) {
    Reactions.findOne({ _id: req.params.reactionId })
      .then((reaction) =>
        !reaction
          ? res.status(404).json({ message: 'No reaction with that ID' })
          : res.json(reaction)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Creates a new reaction. Accepts a request body with the entire Reaction object.
  createReaction(req, res) {
    Reactions.create(req.body)
      .then((reaction) => res.json(reaction))
      .catch((err) => res.status(500).json(err));
  },
  // Updates and reaction using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
  updateReaction(req, res) {
    Reactions.findOneAndUpdate(
      { _id: req.params.reactionId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((reaction) =>
        !reaction
          ? res.status(404).json({ message: 'No reaction with this id!' })
          : res.json(reaction)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Deletes a reaction from the database. Looks for an app by ID.
  deleteReaction(req, res) {
    Reactions.findOneAndDelete({ _id: req.params.reactionId })
      .then((reaction) =>
        !reaction
          ? res.status(404).json({ message: 'No reaction with that ID' })
          : Thoughts.updateMany(
            { },
            { $pull: {reactions: { reactionId: reaction._id } } }
          )
      )
      .then(() => res.json({ message: 'Reaction deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
};
