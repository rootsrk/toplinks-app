import PropTypes from 'prop-types';
import ErrorComponent from '../../components/errorComponent/errorComponent';
import './error.scss';

function Error() {
  return <ErrorComponent />;
}

Error.propTypes = {
  loginToTwitter: PropTypes.func,
};

export default Error;
