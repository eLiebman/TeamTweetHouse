const express = require('express');
const app = express();

app.set('View Engine', 'pug');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.pug');
});

app.listen(3000);
