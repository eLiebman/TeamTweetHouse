// Update the character count with every keyup event
$('#tweet-textarea').on('keyup', () => {
  const chars = $('#tweet-textarea').val().length;
  const charsLeft = 140 - chars;
  $('#tweet-char').text(charsLeft);
});

// On submit, prepend the tweet to the page
$('#tweet-form').on('submit', (e) => {
  //Template Data
  const tweetText = $('#tweet-textarea').val();
  const myAvatar = $('#myAvatar img').attr('src');
  const myName = $('#myName').val();
  const handle = $('#handle').text();

  //HTML to be added
  const newTweetHTML =
  `<li>
    <strong class="app--tweet--timestamp"> a few seconds ago </strong>
    <a class="app--tweet--author">
      <div class="app--avatar" style="background-image: url(${myAvatar})">
        <img src="${myAvatar}">
      </div>
      <h4> ${myName} </h4>
      <p> ${handle} </p>
    </a>
    <p> ${tweetText} </p>
    <ul class="app--tweet--actions circle--list--inline">
      <li>
        <a class="app--reply">
          <span class="tooltip"> Reply </span>
          <img src="images/reply.svg">
        </a>
      </li>
      <li>
        <a class="app--retweet">
          <span class ="tooltip"> Retweet </span>
          <img src="images/retweet.svg">
          <strong> 0 </strong>
        </a>
      </li>
      <li>
        <a class="app--like">
          <span class="tooltip"> Like </span>
          <img src="images/like.svg">
          <strong> 0 </strong>
        </a>
      </li>
    </ul>
  </li>`

  $('.app--tweet--list').prepend(newTweetHTML);
})
