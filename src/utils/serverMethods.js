import axios from 'axios';

const getTweets = async (userData) => {
  const {
    oauth_access_token,
    oauth_access_token_secret,
    results: { screen_name, user_id },
  } = userData;
  return await axios
    .post('/getTweetsFromSource', {
      oauth_access_token,
      oauth_access_token_secret,
      screen_name,
      user_id,
    })
    .then((response) => {
      return response;
    });
};

export { getTweets };
