

The Twit module used in this app requires a config.js file to provide authentication to Twitter's API.
config.js should look like this:

module.exports = {
  consumer_key,
  consumer_secret,
  access_token,
  access_token_secret,
  id
}

You can use the config.js from your own project 7, but you'll have to add the id property and
set it to your Twitter user id number. This will be used to request your user object from Twitter,
providing important data to the template.
