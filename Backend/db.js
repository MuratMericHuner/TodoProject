const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
    user : "postgres",
    password : process.env.PASSWORD,
    database: "Node",
    host : process.env.HOST,
    port: process.env.DBPORT
})

module.exports = pool