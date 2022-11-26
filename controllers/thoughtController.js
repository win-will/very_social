const { User, Thoughts, Reactions } = require('../models');

module.exports = {
  // Function to get all of the applications by invoking the find() method with no arguments.
  // Then we return the results as JSON, and catch any errors. Errors are sent as JSON with a message and a 500 status code
  getThoughts(req, res) {
    Thoughts.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Gets a single thought using the findOneAndUpdate method. We pass in the ID of the thought and then respond with it, or an error if not found
  getSingleThought(req, res) {
    Thoughts.findOne({ _id: req.params.thoughtId })
      .populate('reactions')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Creates a thought. Accepts a request body with the entire Thought object.
  createThought(req, res) {
    Thoughts.create(req.body)
      .then((thought) => {
        User.findOneAndUpdate(
          { username: thought.username },
          { $addToSet: { thoughts: thought._id } },
          { runValidators: true, new: true }
        );
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },
  // Updates thought using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
  updateThought(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Deletes a thought from the database. Looks for an app by ID.
  deleteThought(req, res) {
    Thoughts.findOneAndDelete({ _id: req.params.thoughtId })
      .then(async (thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : ( await Reactions.deleteMany({ _id: { $in: thought.reactions } }),
              await User.findOneAndUpdate(
                { username: thought.username },
                { $pull: {thoughts: thought._id } }

              ),
              res.json({ message: 'Thought and associated reactions deleted!' })
            )
      )
      //.then(() => res.json({ message: 'Thought and associated reactions deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
    // Adds a reaction to a thought. This method is unique in that we add the entire body of the  rather than the ID with the mongodb $addToSet operator.
    async addReaction(req, res) {
      
      await Reactions.create(req.body)
        .then(async (reaction) => {
        await Thoughts.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: { reactions: reaction._id} },
          { runValidators: true, new: true }
        )
        .catch((err) => res.status(500).json(err));

        res.json(reaction);
        })
        .catch((err) => res.status(500).json(err));
    },
    // Remove reaction from thought. This method finds the reaction based on ID. It then updates the reactions array associated with the thought in question by removing it's reactionId from the reactions array.
    async removeReaction(req, res) {
      await Reactions.findOneAndDelete({ _id: req.params.reactionId })
        .then(async (reaction) => {
          !thought
          ? res.status(404).json({ message: 'No reaction with that ID' })
          : ( await Thoughts.findOneAndUpdate(
              { _id: req.params.thoughtId },
              { $pull: {reactions: reaction._id } }

            ),
            res.json({ message: 'Reaction deleted and removed assocations to thoughts and users!' })
          )
    
        })
        //.then(() => res.json({ message: 'Reaction deleted and removed assocations to thoughts and users!' }))
        .catch((err) => res.status(500).json(err));
    },
};
