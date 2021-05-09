import { useEffect, useState } from 'react';
import Login from './views/login/login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Toast } from 'react-bootstrap';
import Error from './views/error/error';
import Home from './views/home/home';
import Authenticate from './views/authenticate/authenticate';
import Loader from './components/loader/loader';
import { post } from './utils/serverMethods';

function Views() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, toggleLoader] = useState(false);

  window.addEventListener(
    'storage',
    function (event) {
      const successfulLogin =
        JSON.parse(localStorage.getItem('successfulLogin')) || false;
      if (successfulLogin) {
        onAuthenticationComplete();
      } else {
        toggleLoader(false);
      }
    },
    false
  );

  const login = async () => {
    toggleLoader(true);
    localStorage.setItem('successfulLogin', JSON.stringify(false));
    const response = await post('/getToken').then((responseData) => {
      const { response } = responseData;
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
    var isAuthenticated =
      JSON.parse(localStorage.getItem('successfulLogin')) || false;
    setAuthenticated(isAuthenticated);
  };

  const renderToast = () => (
    <div>
      <Toast>
        <Toast.Header>
          <img src='holder.js/20x20?text=%20' className='rounded mr-2' alt='' />
          <strong className='mr-auto'>Bootstrap</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
      </Toast>
    </div>
  );

  return (
    <>
      <div className='body-content'>
        <Router>
          <Switch>
            <Route exact path='/error'>
              <Error />
            </Route>
            <Route exact path='/authenticate'>
              <Authenticate
                onAuthenticationComplete={onAuthenticationComplete}
              />
            </Route>
            <Route exact path='/login'>
              <Login loginToTwitter={login} />
            </Route>

            <Route exact path='/home'>
              {isAuthenticated ? <Home /> : <Redirect to='/login' />}
              {/* {isAuthenticated ? <div>Home</div> : <div>Login</div>} */}
            </Route>

            {/* <Route exact path='/'>
              {isAuthenticated ? <div>Home</div> : <div>Login</div>}
            </Route> */}
          </Switch>
        </Router>
      </div>
      <Loader isLoading={isLoading} />
      {renderToast()}
    </>
  );
}

export default Views;
