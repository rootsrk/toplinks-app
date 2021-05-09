import fallbackProfile from '../../assets/fallbackProfile.png';

function Logout(props) {
  const { userData = {}, logout = () => {} } = props;
  const { userProfilePicture } = userData;

  return (
    <>
      <div className='logout'>
        <img
          className='logout-img'
          src={userProfilePicture || fallbackProfile}
          alt='twitter profile'
        />
        <div className='logout-content'>
          <span className='logout-content-userhandle'>@sumo_dev_</span>
          <span onClick={logout} className='logout-content-button'>
            Logout
          </span>
        </div>
      </div>
    </>
  );
}

export default Logout;
