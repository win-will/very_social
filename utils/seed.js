const { text } = require('express');
const connection = require('../config/connection');
const { Users, Thoughts, Reactions } = require('../models');
// Import functions for seed data
const { getRandomUsername, getRandomText, getRandomWord, genRandomIndex } = require('./data');

// Start the seeding runtime timer
console.time('seeding');

// Creates a connection to mongodb
connection.once('open', async () => {
  // Delete the entries in the collection
  await Users.deleteMany({});
  await Thoughts.deleteMany({});
  await Reactions.deleteMany({});

  // Empty arrays for randomly generated posts and tags
  const usernames = [];
  const thoughts = [];
  const reactions = [];

  // Function to make a post object and push it into the posts array
  const makeReactions = (username, text) => {
    reactions.push({
      username: username,
      reactionBody: text,
    });
  };

  const makeThoughts = (username, text) => {
    thoughts.push({
      username: username,
      thoughtsBody: text,
      reactions: [reactions[genRandomIndex(reactions)]._id],
    });
  };

  // Create 20 random tags and push them into the tags array
  for (let i = 0; i < 10; i++) {
    const username = getRandomUsername();

    usernames.push({
      username: username,
    });
  }

  // Wait for the tags to be inserted into the database
  await Users.collection.insertMany(tags);

  // For each of the tags that exist, make a random post of length 50
  tags.forEach(() => makePost(getRandomPost(50)));

  // Wait for the posts array to be inserted into the database
  await Post.collection.insertMany(posts);

  // Log out a pretty table for tags and posts, excluding the excessively long text property
  console.table(tags);
  console.table(posts, ['published', 'tags', '_id']);
  console.timeEnd('seeding');
  process.exit(0);
});
