import { useEffect, useState } from 'react';
import Login from './views/login/login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Toast } from 'react-bootstrap';
import Error from './views/error/error';
import Home from './views/home/home';
import Authenticate from './views/authenticate/authenticate';
import Loader from './components/loader/loader';
import { post } from './utils/serverMethods';

function Views() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, toggleLoader] = useState(false);
  const [toast, setToastData] = useState({
    show: false,
    message: '',
    title: '',
  });

  window.addEventListener(
    'storage',
    function (event) {
      const successfulLogin =
        JSON.parse(localStorage.getItem('successfulLogin')) || false;
      if (successfulLogin) {
        onAuthenticationComplete();
      } else {
        toggleLoader(false);
        setToastData({
          show: true,
          message: 'Oops! Login attempt failed. Please try again later.',
          title: 'Login',
        });
      }
    },
    false
  );

  const login = async () => {
    toggleLoader(true);
    localStorage.setItem('successfulLogin', JSON.stringify(false));
    const response = await post('/getToken')
      .then((responseData) => {
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
      })
      .catch((error) => {
        toggleLoader(false);
        setToastData({
          show: true,
          message: 'Oops! Login attempt failed. Please try again later.',
          title: 'Login',
        });
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
    <Toast
      onClose={() =>
        setToastData({
          show: false,
          message: '',
          title: '',
        })
      }
      delay={3000}
      autohide
      show={toast.show}
    >
      <Toast.Header>
        <strong className='mr-auto'>{toast.title}</strong>
        <small>Just now</small>
      </Toast.Header>
      <Toast.Body>{toast.message}</Toast.Body>
    </Toast>
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
              <Login setToastData={setToastData} loginToTwitter={login} />
            </Route>

            <Route exact path='/home'>
              <Home
                setToastData={setToastData}
                isAuthenticated={isAuthenticated}
              />
            </Route>

            <Route path='/'>
              <Error />
            </Route>
          </Switch>
        </Router>
      </div>
      <Loader isLoading={isLoading} />
      {renderToast()}
    </>
  );
}

export default Views;
