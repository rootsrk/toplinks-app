import errorImage from '../../assets/error.jpg';
import inactiveImage from '../../assets/inactive.jpg';

import { Button } from 'react-bootstrap';

function ErrorComponent(props) {
  const { isPageLevel = false, action, reRoute } = props;
  return isPageLevel ? (
    <div className='error-component row'>
      <div className='error-component-logo col-sm-6'>
        <img src={inactiveImage} alt='error-component logo' />
      </div>
      <div className='error-component-content col-sm-6'>
        <h1 className='error-component-content-header'>Oops!</h1>
        <h4 className='error-component-content-desc'>
          We could not retrieve any tweets at the moment. Please try again
          later.
        </h4>
        <Button onClick={() => action()}>Reload</Button>
      </div>
    </div>
  ) : (
    <div className='error-component row'>
      <div className='error-component-logo col-sm-6'>
        <img src={errorImage} alt='error-component logo' />
      </div>
      <div className='error-component-content col-sm-6'>
        <h1 className='error-component-content-header'>Oh snap!</h1>
        <h4 className='error-component-content-desc'>
          Something broke. We are working on it.
        </h4>
        <Button className='primary' onClick={() => reRoute()}>
          Go back home
        </Button>
      </div>
    </div>
  );
}

export default ErrorComponent;
