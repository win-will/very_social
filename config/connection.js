const { connect, connection } = require('mongoose');

connect('mongodb://localhost/verySocial', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
