import axios from 'axios';

const post = async (url, body = {}, params = {}) => {
  try {
    const response = await axios
      .post(url, body, params)
      .then((response) => response);
    return {
      success: true,
      response,
    };
  } catch (err) {
    console.log('Error while calling post method for ', url);
    return {
      success: false,
      response: err,
    };
  }
};

const getTweets = async (userData) => {
  const {
    oauth_access_token,
    oauth_access_token_secret,
    results: { screen_name, user_id },
  } = userData;
  return await post('/getTweetsFromSource', {
    oauth_access_token,
    oauth_access_token_secret,
    screen_name,
    user_id,
  });
};

export { getTweets, post };
