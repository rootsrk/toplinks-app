function Card(props) {
  const { userData } = props;
  const { profile_image_url, count, name, screen_name } = userData;
  return (
    <div className='home-content-stats-content'>
      <div className='home-content-stats-icon-container'>
        <img
          className='home-content-stats-icon rounded-edges'
          src={profile_image_url}
          alt='leader board icon'
        />
        <span className='home-content-stats-count'>
          {count < 10 ? `0${count}` : count}
        </span>
      </div>
      <div className='home-content-stats-content-label'>
        <p>{name}</p>
        <span>{`@${screen_name}`}</span>
      </div>
    </div>
  );
}

export default Card;
