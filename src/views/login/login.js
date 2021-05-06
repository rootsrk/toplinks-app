import PropTypes from 'prop-types';
import { Jumbotron, Button } from 'react-bootstrap';
import loginImage from '../../assets/login.jpg';
import './login.scss';

function Login(props) {
  return (
    <div className='login row'>
      <div className='login-image col-sm-6'>
        <img src={loginImage} alt='girl on her laptop and her pet' />
      </div>
      <div className='login-content col-sm-5'>
        <Jumbotron>
          <h1>Hello, there!</h1>
          <p>
            Top links is an application that uses your tweets to prepare a
            customized links based dashboard just for you!
          </p>
          <p>
            <Button
              className='primary'
              onClick={() => props.loginToTwitter(true)}
            >
              Sign in using Twitter
            </Button>
          </p>
        </Jumbotron>
      </div>
    </div>
  );
}

Login.propTypes = {
  loginToTwitter: PropTypes.func,
};

export default Login;
