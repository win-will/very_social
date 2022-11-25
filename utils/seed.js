//const { text } = require('express');
const { ObjectId } = require('mongodb');
const connection = require('../config/connection');
const { User, Thoughts, Reactions } = require('../models');
// Import functions for seed data
const { getRandomUsername, getRandomText, genRandomIndex } = require('./data');

// Start the seeding runtime timer
console.time('seeding');

// Creates a connection to mongodb
connection.once('open', async () => {
  // Delete the entries in the collections
  await User.deleteMany({});
  await Thoughts.deleteMany({});
  await Reactions.deleteMany({});

  const usernames = [];
  const thoughts = [];
  const reactions = [];

  for (let i = 0; i < 10; i++) {

    usernames.push({
      username: getRandomUsername(),
    });
  }

  await User.collection.insertMany(usernames);

  for (let i = 0; i < 10; i++) {
    reactions.push({
      username: usernames[i].username,
      reactionBody: getRandomText(3),
    });
  }

  await Reactions.collection.insertMany(reactions);

  for (let i = 0; i < 10; i++) {
    thoughts.push({
      username: usernames[i].username,
      thoughtsBody: getRandomText(7),
      reactions: [reactions[i]._id],
    });
  }

  await Thoughts.collection.insertMany(thoughts);
  
  for (let i = 0; i < usernames.length; i++) {
    // console.log(usernames[i].username);
    // console.log(ObjectId(usernames[i]._id.toString()));

    let user = await User.findOneAndUpdate(
      { _id: usernames[i]._id },
      { email: `${usernames[i].username}@test.com`,
        thoughts: [thoughts[i]._id],
      },
      {
        new: true
      }
    );
    // console.log(user.email);
  }

  console.table(usernames);
  console.table(thoughts);
  console.table(reactions);
  console.timeEnd('seeding');
  process.exit(0);
});
