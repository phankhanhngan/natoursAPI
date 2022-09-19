const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION. Shutting down...');
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//return a promise can access to a connection obj
mongoose
  .connect(DB, {
  useNewUrlParser: true,
  })
  .then(() => {
  console.log('DB connection successful!');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION. Shutting down...');
  //shut down app only when the server has already closed. Because there are maybe
  //some request pending and unhandled. So we have to wait for the server to
  //handle all of that and closes.
  server.close(() => {
    process.exit(1);
  });
})

