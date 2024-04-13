const mysql = require('mysql2')


const pool = mysql.createPool({
    connectionLimit: 10,
    host:process.env.DB_HOST || 'localhost',
    user:process.env.DB_USER || 'root',
    password:process.env.DB_PASSWORD || 'D4t4b4s3$2024',
    database:process.env.DB_NAME || 'my_store',
})


module.exports = pool;