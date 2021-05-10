import { useEffect, useState } from 'react';
import MenuBar from '../../components/menu/menu';
import Tweet from '../../components/tweet/tweet';
import Card from '../../components/card/card';
import Filter from '../../components/filter/filter';
import Loader from '../../components/loader/loader';
import Maps from '../../components/maps/maps';
import Table from '../../components/table/table';
import { getTweets, post } from '../../utils/serverMethods';
import { sortObjectByKey, constants } from '../../utils/helper';
import ErrorComponent from '../../components/errorComponent/errorComponent';

function Home(props) {
  const { setToastData } = props;
  const [tweetsData, setTweets] = useState([]);
  const [filteredTweetsData, setFilteredTweets] = useState([]);
  const [selectedMappedTweets, setMapIDs] = useState([]);
  const [screenName, setScreenName] = useState('');
  const [userData, setUserData] = useState('');
  const [sortedUserData, setSortedUserData] = useState([]);
  const [sortedDomainData, setSortedDomainData] = useState([]);
  const [hashtagsData, setHashtagsMap] = useState({});
  const [userLocationData, setUserLocationData] = useState({});
  const [filterInProgress, toggleFilterInProgress] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [tableData, setTableData] = useState(constants.tableData);
  const [isLoading, toggleLoader] = useState(false);

  useEffect(() => {
    toggleFilterInProgress(appliedFilters.length > 0);
  }, [appliedFilters]);

  const callGetTweetsEndpoint = async (screen_name) => {
    const responseData = await post(
      `/getTweetsForUser?screen_name=${screen_name}`
    );
    const { response } = responseData;
    const { data = {} } = response;
    const { records } = data;
    const tweets = records ? records.tweets : null;
    return tweets;
  };

  const onMarkerClick = (tweet, isSelected) => {
    let tweets;

    if (!isSelected) {
      const exists = tweetsData.filter((item) => {
        if (item.id.toString() === tweet.id.toString()) return item;
        return false;
      });
      if (exists.length > 0) {
        tweets = [...new Set([...(filteredTweetsData || []), tweet])];
        setMapIDs([...selectedMappedTweets, tweet.id.toString()]);
      }
    } else {
      tweets = filteredTweetsData.filter(
        (item) => item.id.toString() !== tweet.id.toString()
      );
      setMapIDs(tweets.map((i) => i.id.toString()));
    }
    console.log(tweets, isSelected);
    toggleFilterInProgress(true);
    setFilteredTweets(tweets);
  };

  const getTweetsForUser = async (userData) => {
    toggleLoader(true);
    setUserData(userData);
    const {
      results: { screen_name },
    } = userData;
    setScreenName(screen_name);
    let tweets = await callGetTweetsEndpoint(screen_name);
    if (!tweets) {
      await getTweets(userData)
        .then(async () => {
          tweets = await callGetTweetsEndpoint(screen_name).then(async () => {
            storeTweets(tweets);
          });
        })
        .catch((error) => {
          toggleLoader(false);
          setToastData({
            show: true,
            message: 'Oops! An error occured. Please try again later!',
            title: 'Error',
          });
        });
    } else {
      storeTweets(tweets);
    }

    toggleLoader(false);
  };

  const storeTweets = (tweets = []) => {
    setTweets(
      (tweets || []).filter(({ entities: { urls } }) => urls.length > 0)
    );
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
        userLocationMap[location || 'None'] = {
          value: location || 'None',
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
          label: domain,
        };
      }
    });

    const sortedUserMap = sortObjectByKey(userMap, 'count', 'desc').map(
      (item) => item[1]
    );
    const sortedDomainMap = sortObjectByKey(domainMap, 'counter', 'asc').map(
      (item) => item[1]
    );
    const modifiedTableData = { ...tableData };
    modifiedTableData.data = sortedDomainData;
    setSortedUserData(sortedUserMap);
    setSortedDomainData(sortedDomainMap);
    setHashtagsMap(hashtagsMap);
    setUserLocationData(userLocationMap);
    setTableData(modifiedTableData);
  };

  const renderCustomFilterComponent = () => {
    return (
      <Maps
        tweets={tweetsData}
        onMarkerClick={onMarkerClick}
        selectedMappedTweets={selectedMappedTweets}
      />
    );
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
        customComponent: () => {},
      },
      {
        name: 'Location',
        id: 'location',
        data: userLocationData,
        customComponent: renderCustomFilterComponent,
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

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const getNewTweets = async () => {
    toggleLoader(true);
    await getTweets(userData)
      .then(async () => {
        let tweets = await callGetTweetsEndpoint(screenName);
        storeTweets(tweets);
      })
      .catch((error) => {
        toggleLoader(false);
        setToastData({
          show: true,
          message: 'Oops! An error occured. Please try again later!',
          title: 'Error',
        });
      });
    toggleLoader(false);
  };

  const reload = () => {
    window.location.reload();
  };

  useEffect(() => {
    runAnalysisOnTweets();
  }, [tweetsData]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('accessTokenData'));
    const successfulLogin =
      JSON.parse(localStorage.getItem('successfulLogin')) || false;
    if (successfulLogin && userData) {
      getTweetsForUser(userData);
    }
  }, []);

  return (
    <>
      <div className='home'>
        <MenuBar
          enableSearch={false}
          hasTweets={tweetsData.length > 0}
          searchFor={searchFor}
          logout={logout}
          getNewTweets={getNewTweets}
          screenName={screenName}
        />
        {tweetsData.length > 0 ? (
          <div className='home-content row'>
            <div className='home-content-trending col-sm-3'>
              <Filter
                data={createFilterObject()}
                applyFilters={applyFilters}
                clearAllFilters={clearAllFilters}
              />
            </div>
            <div className='home-content-tweets col-sm-6'>
              {(filterInProgress ? filteredTweetsData : tweetsData).map(
                (item) => (
                  <div key={item.id}>
                    <Tweet data={item} />
                  </div>
                )
              )}
            </div>
            {sortedUserData.length > 0 && (
              <div className='home-content-stats col-sm-3'>
                <div className='home-content-stats-title row'>
                  <span className='home-content-stats-title-label'>
                    Leader board
                  </span>
                </div>
                {sortedUserData.map((userData) => (
                  <div key={userData.screen_name}>
                    <Card userData={userData} />
                  </div>
                ))}
                <div className='home-content-trending'>
                  <div className='home-content-stats-title row'>
                    <span className='home-content-stats-title-label'>
                      What's trending?
                    </span>
                  </div>
                  <div className='home-content-stats-content'>
                    <Table tableData={tableData} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ErrorComponent isPageLevel action={reload} />
        )}
      </div>
      <Loader isLoading={isLoading} />
    </>
  );
}

Home.propTypes = {};

export default Home;
