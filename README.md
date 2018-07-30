The Twit module used in this app requires a config object to provide authentication to Twitter's API.
This object is imported from a separate file, config.js, which must be in the same directory as app.js

config.js will look like this:

```javascript
module.exports = {
  consumer_key,
  consumer_secret,
  access_token,
  access_token_secret,
}
```
All identifying information is found in config.js, so the app contains nothing personal.

If you're a Treehouse student, you can use the config.js from your own project 7.

If not, you'll need to create a developer account with Twitter and set up your own authentication credentials.
