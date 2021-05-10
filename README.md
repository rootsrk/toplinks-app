# Toplinks Application

An app that shows the user of all the links and tweets mentioned on their home feed.

## Release updates:

### Must have features:

- Use twitter as SSO login
- Filter out the tweets received from twitter from the user's home timeline and display them on the page.
- Store the received tweets in a database
- Once stored, compute and display
  - Actual Tweets containing links
  - Which user has shared the most links
  - List of Top Domains that have been shared so far
- Following filters must be made available to the user:
  - Search for tweets by hashtag
  - Filter tweets by location

### Future scope:

- Create a draggable selector over the rendered maps
- Search component for global search across all tweets

### Implementation:

The flow starts from login page. Once user logs in using twitter credentials, he/she is navigated to thhe home page.

The user sees the following:
- Tweets
- Retrieve from twitter button that fetches the latest tweets
- Filter panel for filtering via hashtags and logic
- Leaderboard of users with most links
- List of top domains that have been shared so far
- A map marking the tweets with geo attribute having non null value



### How to start the app:

The app contains a NodeJS Express server and react client.

1. To run it in local, create an environment (`.env`) file and add all the variables.
2. Install node modules on both root folder and the client folder.
   - `npm install`
   - `cd client`
   - `npm install`
4. Go to the client folder. Create a react production build of the app by running `npm run build`.
5. On the root directory, start the server by running `npm start`
