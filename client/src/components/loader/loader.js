import tweetLoader from '../../assets/loader.gif';
import './loader.scss';

function Loader() {
  return (
    <div className='loader-body'>
      <div className='loader-content'>
        <img
          className='loader-content-img'
          src={tweetLoader}
          alt='tweets loader'
        />
      </div>
    </div>
  );
}

export default Loader;
