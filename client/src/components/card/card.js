function Card(props) {
  const { userData } = props;
  const { profile_image_url, count, name, screen_name } = userData;
  return (
    <div className='custom-card'>
      <div className='custom-card-icon-container'>
        <img
          className='custom-card-icon rounded-edges'
          src={profile_image_url}
          alt='leader board icon'
        />
        <span className='custom-card-count'>
          {count < 10 ? `0${count}` : count}
        </span>
      </div>
      <div className='custom-card-content-label'>
        <p>{name}</p>
        <span>{`@${screen_name}`}</span>
      </div>
    </div>
  );
}

export default Card;
