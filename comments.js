// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// Handle post requests to the /posts endpoint
app.post('/posts', async (req, res) => {
  const { title } = req.body;
  const id = Math.random().toString(36).substring(2);

  posts[id] = { id, title, comments: [] };

  // Emit an event to the event bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: { id, title },
  });

  res.status(201).send(posts[id]);
});

// Handle get requests to the /posts endpoint
app.get('/posts', (req, res) => {
  res.send(posts);
});

// Handle post requests to the /events endpoint
app.post('/events', (req, res) => {
  console.log('Event Received:', req.body.type);

  res.send({});
});

// Start server
app.listen(4000, () => {
  console.log('Listening on 4000');
});