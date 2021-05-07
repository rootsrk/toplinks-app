import PropTypes from 'prop-types';
import './authenticate.scss';
import { useEffect } from 'react';
import axios from 'axios';

function Authenticate(props) {
  const getAccessToken = async () => {
    const queryString = new URLSearchParams(window.location.search);
    const oauth_token = queryString.get('oauth_token');
    const oauth_verifier = queryString.get('oauth_verifier');

    if (oauth_token && oauth_verifier) {
      try {
        const response = await axios
          .post('/authenticateUser', { oauth_token, oauth_verifier })
          .then((response) => {
            return response;
          });
        if (response) {
          localStorage.setItem(
            'accessTokenData',
            JSON.stringify(response.data.resp)
          );
          window.close();
        }
        return response;
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const { searchParams } = new URL(window.location);
    const oauth_token = searchParams.get('oauth_token');
    const oauth_verifier = searchParams.get('oauth_verifier');

    const accessTokenProcessing = async (token, verifier) => {
      const res = await getAccessToken(token, verifier).then(
        (response) => response
      );
      return res;
    };

    if (oauth_token && oauth_verifier) {
      accessTokenProcessing(oauth_token, oauth_verifier);
    } else {
      window.href = '/';
    }
  }, []);
  return <div className='authenticate row'></div>;
}

Authenticate.propTypes = {
  loginToTwitter: PropTypes.func,
};

export default Authenticate;
