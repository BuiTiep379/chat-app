/* eslint-disable no-console */
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connect = (url) => {
  mongoose
    .connect(url)
    .then(() => console.log('Connect successfully!'))
    .catch(() => console.log('Connect failure!'));
};
module.exports = connect;
