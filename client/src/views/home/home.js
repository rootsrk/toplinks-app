// import PropTypes from 'prop-types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import MenuBar from '../../components/menu/menu';
import Tweet from '../../components/tweet/tweet';
import './home.scss';
import { getTweets } from '../../utils/serverMethods';
import Filter from '../../components/filter/filter';
function Home(props) {
  const [tweetsData, setTweets] = useState([]);
  const [filteredTweetsData, setFilteredTweets] = useState([]);

  const [sortedUserData, setSortedUserData] = useState([]);
  const [sortedDomainData, setSortedDomainData] = useState([]);
  const [hashtagsData, setHashtagsMap] = useState({});
  const [userLocationData, setUserLocationData] = useState({});
  const [filterInProgress, toggleFilterInProgress] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(false);

  useEffect(() => {
    toggleFilterInProgress(appliedFilters.length > 0);
  }, [appliedFilters]);

  const callGetTweetsEndpoint = async (screen_name) => {
    return await axios
      .post(`/getTweetsForUser?screen_name=${screen_name}`)
      .then((response) => {
        const {
          data: { records },
        } = response;
        const tweets = records ? records.tweets : null;
        return tweets;
      });
  };

  const getTweetsForUser = async (userData) => {
    const {
      results: { screen_name },
    } = userData;
    let tweets = await callGetTweetsEndpoint(screen_name);
    console.log('getTweetsForUser', tweets);
    if (!tweets) {
      await getTweets(userData).then(async () => {
        tweets = await callGetTweetsEndpoint(screen_name);
      });
    }
    setTweets(tweets.filter(({ entities: { urls } }) => urls.length > 0));
  };

  const nestedSort = (sortKey, direction = 'asc') => (e1, e2) => {
    const a = e1[sortKey],
      b = e2[sortKey],
      sortOrder = direction === 'asc' ? 1 : -1;
    return a < b ? -sortOrder : a > b ? sortOrder : 0;
  };

  const sortObjectByKey = (input, key, order = 'desc') => {
    const s = Object.entries(input).sort(nestedSort(key, order));
    return s;
  };

  const runAnalysisOnTweets = () => {
    const userMap = {};
    const urlData = [];
    const allDomains = [];
    const domainMap = {};
    const hashtagsMap = {};
    const userLocationMap = {};

    tweetsData.forEach((i) => {
      const { user, entities } = i;
      const { screen_name, profile_image_url, name, location } = user;
      const { urls, hashtags } = entities;
      if (userMap[screen_name]) {
        userMap[screen_name].count++;
      } else {
        userMap[screen_name] = {
          profile_image_url,
          screen_name,
          data: user,
          count: 1,
          name,
        };
      }

      if (userLocationMap[location]) {
        userLocationMap[location].tweets.push(i);
        userLocationMap[location].count++;
      } else {
        userLocationMap[location] = {
          value: location,
          tweets: [i],
          count: 0,
        };
      }

      if (hashtags.length > 0) {
        hashtags.forEach((item) => {
          if (hashtagsMap[item.text]) {
            hashtagsMap[item.text].tweets.push(i);
            hashtagsMap[item.text].count++;
          } else {
            hashtagsMap[item.text] = {
              value: item.text,
              tweets: [i],
              count: 0,
            };
          }
        });
      }

      urlData.push(urls[0].expanded_url);
      const domain = urls[0].expanded_url.replace(/.+\/\/|www.|\..+/g, '');
      allDomains.push(domain);

      if (domainMap[domain]) {
        domainMap[domain].counter++;
      } else {
        domainMap[domain] = {
          domain,
          counter: 1,
        };
      }
    });

    const sortedUserMap = sortObjectByKey(userMap, 'count', 'desc').map(
      (item) => item[1]
    );
    const sortedDomainMap = sortObjectByKey(domainMap, 'counter', 'asc').map(
      (item) => item[1]
    );
    setSortedUserData(sortedUserMap);
    setSortedDomainData(sortedDomainMap);
    setHashtagsMap(hashtagsMap);
    setUserLocationData(userLocationMap);
  };

  const createFilterObject = (allData = false) => {
    if (allData) {
      return { ...hashtagsData, ...userLocationData };
    }
    return [
      {
        name: 'Hastags',
        id: 'hashtags',
        data: hashtagsData,
      },
      {
        name: 'Location',
        id: 'location',
        data: userLocationData,
      },
    ];
  };

  const applyFilters = (appliedFilters) => {
    const filterArray = createFilterObject(true);
    setAppliedFilters(appliedFilters);
    const resultArray = [];
    Object.keys(filterArray)
      .filter((data) => appliedFilters.includes(data))
      .forEach((data) => resultArray.push(...filterArray[data].tweets));
    setFilteredTweets([...new Set(resultArray)]);
  };

  const clearAllFilters = () => {
    setFilteredTweets([]);
    setAppliedFilters([]);
    toggleFilterInProgress(false);
  };

  const searchFor = (searchTerm) => {};

  useEffect(() => {
    runAnalysisOnTweets();
  }, [tweetsData]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('accessTokenData'));
    if (userData) {
      getTweetsForUser(userData);
    }
  }, []);

  return (
    <div className='home'>
      <MenuBar enableSearch searchFor={searchFor} />
      <div className='home-content row'>
        <div className='home-content-trending col-sm-3'>
          <Filter
            data={createFilterObject()}
            applyFilters={applyFilters}
            clearAllFilters={clearAllFilters}
          />
        </div>
        <div className='home-content-tweets col-sm-6'>
          {(filterInProgress ? filteredTweetsData : tweetsData).map((item) => (
            <Tweet data={item} />
          ))}
        </div>
        <div className='home-content-stats col-sm-3'>
          <div className='home-content-stats-title row'>
            <span className='home-content-stats-title-label'>Leader board</span>
          </div>
          {sortedUserData.map((userData) => (
            <div className='home-content-stats-content'>
              <div className='home-content-stats-icon-container'>
                <img
                  className='home-content-stats-icon rounded-edges'
                  src={userData.profile_image_url}
                  alt='leader board icon'
                />
                <span className='home-content-stats-count'>
                  {userData.count < 10 ? `0${userData.count}` : userData.count}
                </span>
              </div>
              <div className='home-content-stats-content-label'>
                <p>{userData.name}</p>
                <span>{`@${userData.screen_name}`}</span>
              </div>
            </div>
          ))}
          <div className='home-content-trending'>
            <div className='home-content-stats-title row'>
              <span className='home-content-stats-title-label'>
                What's trending?
              </span>
            </div>
            <div className='home-content-stats-content'>
              <table className='home-content-stats-content-table'>
                <tr>
                  <th>Rank</th>
                  <th>Domain</th>
                  <th>Hits</th>
                </tr>
                {sortedDomainData.map((domainData, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{domainData.domain}</td>
                    <td>{domainData.counter}</td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Home.propTypes = {};

export default Home;
