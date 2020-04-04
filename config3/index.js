const dotenv = require("dotenv")
const env = process.env.NODE_ENV;

const config = require(`${env}.js`)

module.exports = config;

