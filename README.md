

The Twit module used in this app requires a config object to provide authentication to Twitter's API.
This object is imported from a separate file, config.js which must be in the same directory as app.js

config.js will look like this:

```javascript
module.exports = {
  consumer_key,
  consumer_secret,
  access_token,
  access_token_secret,
  id
}
```

Twit doesn't require the id property, but this app does.

This way, all identifying information is found in config.js, and the app contains no personal information.

If you're a Treehouse student, you can use the config.js from your own project 7, but you'll have to add the id property and
set it to your Twitter user ID#. You can find your user ID# by typing your @handle into this converter:
https://tweeterid.com/

If you haven't already, you'll need to create a developer account with Twitter, and set up your own authentication credentials.
