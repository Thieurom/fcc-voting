'use strict'

const express = require('express');

const PORT = process.env.PORT || 3000;
const server = express();

server.get('/', (req, res) => {
  res.send('It works!');
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} ...`);
});