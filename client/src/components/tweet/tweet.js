import { Card, Button } from 'react-bootstrap';

function Tweet(props) {
  const { data } = props;
  const {
    text,
    user: { name, screen_name, location, profile_image_url },
    entities: { urls, hashtags },
    created_at,
    id,
  } = data;

  return (
    <div className='tweet' key={id}>
      <Card>
        <Card.Body>
          <div className='tweet-body row'>
            <div className='tweet-body-image col-sm-1'>
              <Card.Img variant='left' src={profile_image_url} />
            </div>
            <div className='tweet-body-content col-sm-11'>
              <Card.Title>{name}</Card.Title>
              <div className='tweet-body-sub'>
                <h6 className='tweet-body-sub-handle'>{`@${screen_name}`}</h6>
                <span className='tweet-body-sub-location'>{`${new Date(
                  created_at
                ).toLocaleString()}, ${location}`}</span>
              </div>
            </div>
          </div>
          <Card.Text>{text}</Card.Text>
          <div className='tweet-body-actions'>
            <div className='tweet-body-actions-hashtag-container'>
              {hashtags.length > 0
                ? hashtags.map((hashtag) => (
                    <span
                      className='tweet-body-actions-hashtag-item'
                      key={hashtag.text}
                    >
                      {`#${hashtag.text}`}
                    </span>
                  ))
                : null}
            </div>
            <Button
              variant='primary'
              onClick={() => {
                window.open(urls[0].expanded_url, '_blank');
              }}
            >
              Go to link
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Tweet;
