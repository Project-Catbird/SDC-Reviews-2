require('dotenv').config();
const router = require('./routes.js');

var express = require('express');
var app = express();
var cors = require('cors');
// app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

app.options('/', cors());

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});