import { useEffect, useState } from 'react';
import Login from './views/login/login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Error from './views/error/error';
import Home from './views/home/home';
import Loader from './components/loader/loader';

function Views() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    isUserLoggedIn();
  }, []);

  const loginToTwitter = (login = false) => {
    sessionStorage.setItem('userLoggedIn', login.toString());
    setAuthenticated(login);
  };

  const isUserLoggedIn = () => {
    var isAuthenticated = sessionStorage.getItem('userLoggedIn') === 'true';
    if (isAuthenticated) {
      setAuthenticated(true);
    } else {
      sessionStorage.setItem('userLoggedIn', 'false');
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
            <Route path='/'>
              {isAuthenticated ? (
                <Home />
              ) : (
                <Login loginToTwitter={loginToTwitter} />
              )}
            </Route>
          </Switch>
        </Router>
      </div>
      <Loader />
    </>
  );
}

export default Views;
