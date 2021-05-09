import PropTypes from 'prop-types';
import ErrorComponent from '../../components/errorComponent/errorComponent';
import './error.scss';

function Error() {
  const reroute = () => {
    const successfulLogin =
      JSON.parse(localStorage.getItem('successfulLogin')) || false;
    if (successfulLogin) {
      window.location.href = '/home';
    } else {
      window.location.href = '/login';
    }
  };
  return <ErrorComponent reRoute={reroute} />;
}

Error.propTypes = {
  loginToTwitter: PropTypes.func,
};

export default Error;
