import PropTypes from 'prop-types';
import './error.scss';
import errorImage from '../../assets/error.jpg';
import { Button } from 'react-bootstrap';

function Error() {
  return (
    <div className='error row'>
      <div className='error-logo col-sm-6'>
        <img src={errorImage} alt='error logo' />
      </div>
      <div className='error-content col-sm-6'>
        <h1 className='error-content-header'>Oh snap!</h1>
        <h4 className='error-content-desc'>
          Something broke. We are working on it.
        </h4>
        <Button
          className='primary'
          onClick={() => {
            window.location = '/';
          }}
        >
          Go back home
        </Button>
      </div>
    </div>
  );
}

Error.propTypes = {
  loginToTwitter: PropTypes.func,
};

export default Error;
