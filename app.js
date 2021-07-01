const fetch = require('node-fetch');
require('dotenv').config();

const token = process.env['TWITTER_BEARER_TOKEN'];

const getURL = async (url) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();
  return json;
};

const idFromUsername = async (username) => {
  const url = `https://api.twitter.com/2/users/by/username/${username}`;
  const { data } = await getURL(url);
  return data;
};

const getLikesforID = async (id) => {
  const url = `https://api.twitter.com/2/users/${id}/liked_tweets`;
  const likes = await getURL(url);
  return likes;
};

const likesOfUser = async (username) => {
  const { id } = await idFromUsername(username);
  const likes = await getLikesforID(id);
  return likes;
};

module.exports = { likesOfUser };
// likesOfUser('viiitdmj')
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));
