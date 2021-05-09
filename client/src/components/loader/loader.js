import tweetLoader from '../../assets/loader.gif';

function Loader(props) {
  return (
    props.isLoading && (
      <div className='loader-body'>
        <div className='loader-content'>
          <img
            className='loader-content-img'
            src={tweetLoader}
            alt='tweets loader'
          />
        </div>
      </div>
    )
  );
}

export default Loader;
