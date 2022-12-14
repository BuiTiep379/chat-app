const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const app = express();

require('dotenv').config();

const connectDB = require('./src/connections/mongoose-connect');
const corsOptions = require('./src/configs/cors-options');
const credentials = require('./src/middlewares/credentials');

const authRouter = require('./src/routes/auth.routes');
const messageRouter = require('./src/routes/message.routes');
const PORT = process.env.PORT;
const urlMongoose = process.env.MONGO_CONNECTION;
app.use(cors(corsOptions));
app.use(helmet());
// built-in middleware for json
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
app.use(cookieParser());
// Cross Origin Resource Sharing

app.use('/api/message', messageRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  connectDB(urlMongoose);
  console.log(`Server run at http://localhost:${PORT}`);
});

module.exports = app;
