const express = require('express');
const errorhandler = require('./utils/error/errorCatchAllMiddleware');
const colors = require('colors');
require('dotenv').config();

const asyncHandler = require('./utils/error/asyncHandler');

const { likesOfUser } = require('./app.js');
const ErrorResponse = require('./utils/error/errorResponse');

const app = express();

const { PORT, NODE_ENV: environment = 'development' } = process.env;

app.get(
  '/likes/:username',
  asyncHandler(async (req, res, next) => {
    const likes = await likesOfUser(req.params.username);
    if (!likes) {
      return next(
        new ErrorResponse(
          `Could not find likes for ${req.params.username}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: likes });
  })
);

// if we use it above the mount it will not catch errors for the routes mounted after it
app.use(errorhandler);

//start the app server
const server = app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(
    `Server running in ${environment} at http://localhost:${PORT}`.yellow.bold
  );
});

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //close server and exit process
  server.close(() => {
    process.exit(1);
  });
});
