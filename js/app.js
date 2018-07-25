const express = require('express');
const config = require('./config.js');
const filter = require('./filter.js');
const Twit = require('twit');
const moment = require('moment');
const http =  require('http');
const bodyParser = require('body-parser');

const app = express();

const T = new Twit(config);

app.set('View Engine', 'pug');
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {

// pageData holds all information for the template
  const pageData = {
    moment,
    tweets: [],
    friends: [],
    messages: []
  };

// All the T.get calls are here
  const user = T.get(`users/show`, {user_id: config.id});
  const friends = T.get(`friends/list`, {count: 5});
  const tweets = T.get(`statuses/home_timeline`, {count: 5});
  const DMs = T.get(`/direct_messages/events/list`, {count: 50});

// Promise.all waits for all promises to resolve before executing .then()
// This is necessary to make sure all necessary info is available to the template
// Before res.render() gets called. This results in a longer load time.
  Promise.all([user, friends, tweets, DMs])
    .catch( err => console.log(err) )
    .then( response => {

    // Collect data from the response array
      const user = response[0].data;
      const friends = response[1].data;
      const tweets = response[2].data;
      const DMs = response[3].data;
      // Filter messages, returning only last conversation
      const lastConversation = filter(DMs.events, config.id);
      const lastFiveMessages = lastConversation.messages.slice(0, 5);
      const conversationPartner_id = lastConversation.friend_id;

    //Save relevant data to pageData object keys
      pageData.user = user;
      friends.users.forEach( user => {
          const { name, screen_name, profile_image_url } = user;
          pageData.friends.push({ name, screen_name, profile_image_url });
      });

      tweets.forEach( tweet => {
        const { text, user, retweet_count, favorite_count, created_at } = tweet;
        pageData.tweets.push({ text, user, retweet_count, favorite_count, created_at });
      });

      lastFiveMessages.forEach( message => {
        const { created_timestamp, message_create } = message;
        const isMe = message.message_create.sender_id === config.id;
        pageData.messages.unshift({ created_timestamp, message_create, isMe });
      });

      // Get conversation partner's user oject (only possible after DM info has arrived)
      T.get('users/show', {user_id: conversationPartner_id})
        .catch( err => console.log(err) )
        .then(response => {
          pageData.conversationPartner = response.data;
    // Rendering can only take place after this promise resolves
          res.render('index.pug', pageData);
        });
    });
});

// Post a Tweet
app.post('/', (req, res) => {
  T.post('statuses/update', {status: req.body.tweet});
  res.redirect('/');
});

//404 Error
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.message = "Not Found";
  err.status = 404;
  next(err);
});

// Error Handler
app.use((err, req, res, next) => {
  const error = {
    status: err.status,
    message: http.STATUS_CODES[err.status]
  }
  res.render('error.pug', error);
  next();
});

app.listen(3000);
