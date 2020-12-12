require('dotenv').config()

const PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

const INVITE_KEY = process.env.INVITE_KEY

module.exports = {
  MONGODB_URI,
  PORT,
  INVITE_KEY
}