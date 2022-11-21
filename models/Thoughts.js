const { Schema, model } = require('mongoose');

// Schema to create User model
const thoughtsSchema = new Schema(
  {
    thoughtText: String,
    username: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    reactions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'thoughts',
      },
    ],
  },
  {
    // Mongoose supports two Schema options to transform Objects after querying MongoDb: toJSON and toObject.
    // Here we are indicating that we want virtuals to be included with our response, overriding the default behavior
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Initialize our User model
const Thoughts = model('thoughts', thoughtsSchema);

module.exports = Thoughts;

//    reactionsCount: Number,
