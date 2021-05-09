import { useEffect, useState } from 'react';
import Login from './views/login/login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Error from './views/error/error';
import Home from './views/home/home';
import Authenticate from './views/authenticate/authenticate';
import Loader from './components/loader/loader';
import axios from 'axios';

function Views() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, toggleLoader] = useState(false);

  window.addEventListener(
    'storage',
    function (event) {
      onAuthenticationComplete();
    },
    false
  );

  const login = async () => {
    toggleLoader(true);
    const response = await axios
      .post('/getToken', {})
      .then(function (response) {
        var win = window.open(
          `https://api.twitter.com/oauth/authenticate?oauth_token=${response.data.oauth_token}`,
          'Twitter oauth window'
        );
        var timer = setInterval(function () {
          if (win.closed) {
            clearInterval(timer);
          }
        }, 500);
        return response;
      });
    return response;
  };

  const onAuthenticationComplete = () => {
    setAuthenticated(true);
    toggleLoader(false);
    window.location.href = '/home';
  };

  useEffect(() => {
    isUserLoggedIn();
  }, []);

  const isUserLoggedIn = async () => {
    var isAuthenticated = JSON.parse(localStorage.getItem('accessTokenData'));
    if (isAuthenticated) {
      setAuthenticated(true);
    }
  };

  return (
    <>
      <div className='body-content'>
        <Router>
          <Switch>
            <Route path='/error'>
              <Error />
            </Route>
            <Route path='/authenticate'>
              <Authenticate
                onAuthenticationComplete={onAuthenticationComplete}
              />
            </Route>
            <Route path='/home'>{isAuthenticated && <Home />}</Route>
            <Route path='/'>
              <Login loginToTwitter={login} />
            </Route>
          </Switch>
        </Router>
      </div>
      <Loader isLoading={isLoading} />
    </>
  );
}

export default Views;
