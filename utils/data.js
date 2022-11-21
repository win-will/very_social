const usernames = [
  "root",
  "admin",
  "test",
  "guest",
  "info",
  "adm",
  "mysql",
  "user",
  "administrator",
  "oracle",
  "ftp",
  "pi",
  "puppet",
  "ansible",
  "ec2-user",
  "vagrant",
  "azureuser",
];

const lorum = [
  'lorem',
  'imsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'curabitur',
  'vel',
  'hendrerit',
  'libero',
  'eleifend',
  'blandit',
  'nunc',
  'ornare',
  'odio',
  'ut',
  'orci',
  'gravida',
  'imperdiet',
  'nullam',
  'purus',
  'lacinia',
  'a',
  'pretium',
  'quis',
];

const getRandomUsername = () =>
  `${usernames[genRandomIndex(usernames)]}${genRandomIndex(usernames)}`;

const genRandomIndex = (arr) => Math.floor(Math.random() * arr.length);

const getRandomWord = () => `${lorum[genRandomIndex(lorum)]}`;

const getRandomText = (words) => {
  let text = '';
  for (let i = 0; i < words; i++) {
    post += ` ${getRandomWord()}`;
  }
  return text;
};

module.exports = {
  getRandomUsername,
  getRandomWord,
  getRandomText,
  genRandomIndex,
};
