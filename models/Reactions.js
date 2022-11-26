const { Schema, model } = require('mongoose');

// Schema to create Reactions model
const reactionsSchema = new Schema(
  {
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => date.toString(),
    },
  },
  {
    // Mongoose supports two Schema options to transform Objects after querying MongoDb: toJSON and toObject.
    // Here we are indicating that we want virtuals to be included with our response, overriding the default behavior
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

// Initialize our User model
const Reactions = model('reactions', reactionsSchema);

module.exports = Reactions;
