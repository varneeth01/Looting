const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo: {
    uri: process.env.MONGO_URI
  },
  jwt: {
    secret: process.env.JWT_SECRET
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID
  },
  facebook: {
    appId: process.env.FACEBOOK_APP_ID
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};
