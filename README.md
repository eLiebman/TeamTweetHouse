

The Twit module used in this app requires a config object to provide authentication to Twitter's API.
This object can be imported from a separate file, config.js, which should look like this:

module.exports = {
  consumer_key,
  consumer_secret,
  access_token,
  access_token_secret,
  id
}

Twit doesn't require the id property, but this app does.

You can use the config.js from your own project 7, but you'll have to add the id property and
set it to your Twitter user id number. This will be used to request your user object from Twitter,
providing important data to the template.
