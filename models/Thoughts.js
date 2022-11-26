const { Schema, model } = require('mongoose');

// Schema to create Thoughts model
const thoughtsSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
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
    reactions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'reactions',
      },
    ],
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

//Create virtual property reactionCount
thoughtsSchema
  .virtual('reactionCount')
  // Getter
  .get(function () {
    return this.reactions.length;
  });
// Initialize our User model
const Thoughts = model('thoughts', thoughtsSchema);

module.exports = Thoughts;

//    reactionsCount: Number,
