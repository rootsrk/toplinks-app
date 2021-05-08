import tweetLoader from '../../assets/loader.gif';
import './loader.scss';

function Loader() {
  return (
    <div className='loader'>
      <img src={tweetLoader} alt='tweets loader' />
    </div>
  );
}

export default Loader;
