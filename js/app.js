const express = require('express');
const config = require('./config.js');
const filter = require('./filter.js');
const Twit = require('twit');
const moment = require('moment');

const app = express();

const T = new Twit(config);

app.set('View Engine', 'pug');
app.use(express.static('public'));

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
  const DMs = T.get(`/direct_messages/events/list`, {count: 6});

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

      lastConversation.messages.forEach( message => {
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

app.listen(3000);


// My user object
// { id: 1603427412,
//   id_str: '1603427412',
//   name: 'Many Voices',
//   screen_name: 'MNYVCS',
//   location: 'Austin, TX',
//   profile_location: null,
//   description: 'Music Producer',
//   url: 'https://t.co/nD2ZokComU',
//   entities: { url: { urls: [Array] }, description: { urls: [] } },
//   protected: false,
//   followers_count: 662,
//   friends_count: 675,
//   listed_count: 11,
//   created_at: 'Thu Jul 18 13:31:46 +0000 2013',
//   favourites_count: 89,
//   utc_offset: null,
//   time_zone: null,
//   geo_enabled: false,
//   verified: false,
//   statuses_count: 298,
//   lang: 'en',
//   status:
//    { created_at: 'Thu Feb 09 23:57:05 +0000 2017',
//      id: 829841581003964400,
//      id_str: '829841581003964416',
//      text: '#rage https://t.co/iMVCGbT8t8',
//      truncated: false,
//      entities:
//       { hashtags: [Array],
//         symbols: [],
//         user_mentions: [],
//         urls: [Array] },
//      source:
//       '<a href="http://instagram.com" rel="nofollow">Instagram</a>',
//      in_reply_to_status_id: null,
//      in_reply_to_status_id_str: null,
//      in_reply_to_user_id: null,
//      in_reply_to_user_id_str: null,
//      in_reply_to_screen_name: null,
//      geo: null,
//      coordinates: null,
//      place: null,
//      contributors: null,
//      is_quote_status: false,
//      retweet_count: 6,
//      favorite_count: 0,
//      favorited: false,
//      retweeted: false,
//      possibly_sensitive: false,
//      lang: 'und' },
//   contributors_enabled: false,
//   is_translator: false,
//   is_translation_enabled: false,
//   profile_background_color: 'C0DEED',
//   profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
//   profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
//   profile_background_tile: false,
//   profile_image_url:
//    'http://pbs.twimg.com/profile_images/803460621165424640/XzB7eVZJ_normal.jpg',
//   profile_image_url_https:
//    'https://pbs.twimg.com/profile_images/803460621165424640/XzB7eVZJ_normal.jpg',
//   profile_banner_url:
//    'https://pbs.twimg.com/profile_banners/1603427412/1480395212',
//   profile_link_color: '2E758F',
//   profile_sidebar_border_color: 'C0DEED',
//   profile_sidebar_fill_color: 'DDEEF6',
//   profile_text_color: '333333',
//   profile_use_background_image: true,
//   has_extended_profile: false,
//   default_profile: false,
//   default_profile_image: false,
//   following: false,
//   follow_request_sent: false,
//   notifications: false,
//   translator_type: 'none',
//   suspended: false,
//   needs_phone_verification: false }


// message.message_create object
// { target: { recipient_id: '25637553' },
//   sender_id: '1603427412',
//   source_app_id: '258901',
//   message_data:
//    { text: 'Thanks',
//      entities: { hashtags: [], symbols: [], user_mentions: [], urls: [] } } }

// Direct Message data
// { events:
//    [ { type: 'message_create',
//        id: '1020140137005617157',
//        created_timestamp: '1532055336606',
//        message_create: [Object] },
//      { type: 'message_create',
//        id: '1020140130785521668',
//        created_timestamp: '1532055335123',
//        message_create: [Object] },
//      { type: 'message_create',
//        id: '1020140104332005380',
//        created_timestamp: '1532055328816',
//        message_create: [Object] },
//      { type: 'message_create',
//        id: '1020140081338777604',
//        created_timestamp: '1532055323334',
//        message_create: [Object] } ],
//   apps:
//    { '258901':
//       { id: '258901',
//         name: 'Twitter for Android',
//         url: 'http://twitter.com/download/android' } },



//Tweet object
// { created_at: 'Sun Feb 05 06:17:42 +0000 2017',
//     id: 828125426128138200,
//     id_str: '828125426128138241',
//     text: '@bennrothh Gross',
//     truncated: false,
//     entities:
//      { hashtags: [], symbols: [], user_mentions: [Array], urls: [] },
//     source:
//      '<a href="http://twitter.com/download/android" rel="nofollow">Twitter for Android</a>',
//     in_reply_to_status_id: 827830701500231700,
//     in_reply_to_status_id_str: '827830701500231680',
//     in_reply_to_user_id: 1651300033,
//     in_reply_to_user_id_str: '1651300033',
//     in_reply_to_screen_name: 'bennrothh',
//     user:
//      { id: 1603427412,
//        id_str: '1603427412',
//        name: 'Many Voices',
//        screen_name: 'MNYVCS',
//        location: 'Austin, TX',
//        description: 'Music Producer',
//        url: 'https://t.co/nD2ZokComU',
//        entities: [Object],
//        protected: false,
//        followers_count: 661,
//        friends_count: 674,
//        listed_count: 11,
//        created_at: 'Thu Jul 18 13:31:46 +0000 2013',
//        favourites_count: 89,
//        utc_offset: null,
//        time_zone: null,
//        geo_enabled: false,
//        verified: false,
//        statuses_count: 298,
//        lang: 'en',
//        contributors_enabled: false,
//        is_translator: false,
//        is_translation_enabled: false,
//        profile_background_color: 'C0DEED',
//        profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
//        profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
//        profile_background_tile: false,
//        profile_image_url:
//         'http://pbs.twimg.com/profile_images/803460621165424640/XzB7eVZJ_normal.jpg',
//        profile_image_url_https:
//         'https://pbs.twimg.com/profile_images/803460621165424640/XzB7eVZJ_normal.jpg',
//        profile_banner_url:
//         'https://pbs.twimg.com/profile_banners/1603427412/1480395212',
//        profile_link_color: '2E758F',
//        profile_sidebar_border_color: 'C0DEED',
//        profile_sidebar_fill_color: 'DDEEF6',
//        profile_text_color: '333333',
//        profile_use_background_image: true,
//        has_extended_profile: false,
//        default_profile: false,
//        default_profile_image: false,
//        following: false,
//        follow_request_sent: false,
//        notifications: false,
//        translator_type: 'none' },
//     geo: null,
//     coordinates: null,
//     place: null,
//     contributors: null,
//     is_quote_status: false,
//     retweet_count: 0,
//     favorite_count: 0,
//     favorited: false,
//     retweeted: false,
//     lang: 'en' }
