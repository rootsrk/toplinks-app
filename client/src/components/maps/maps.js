import { Map, Marker, ZoomControl } from 'pigeon-maps';
import { useEffect, useState } from 'react';
import './maps.scss';

function Maps(props) {
  const [myLocation, setMyLocation] = useState([12.9334373, 77.564861]);
  const [tweets, setTweets] = useState([]);
  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setMyLocation([latitude, longitude]);
    });
  };

  useEffect(() => {
    const filteredTweets = (props.tweets || []).filter((item) => {
      if (item.geo) {
        return item;
      }
      return false;
    });
    getCurrentPosition();
    setTweets(filteredTweets);
  }, []);

  return (
    <>
      <Map height={300} center={myLocation} defaultZoom={11}>
        <Marker width={50} color='blue' anchor={myLocation} />
        {tweets.map((item) => (
          <Marker
            width={50}
            color={
              props.selectedMappedTweets.includes(item.id) ? 'blue' : 'black'
            }
            anchor={item.geo.coordinates}
            onClick={() =>
              props.onMarkerClick(
                item,
                props.selectedMappedTweets.includes(item.id)
              )
            }
          />
        ))}
        <ZoomControl />
      </Map>
    </>
  );
}

export default Maps;
