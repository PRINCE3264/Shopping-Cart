const mysql = require('mysql2/promise');

async function test() {
    try {
        const connection = await mysql.createConnection("mysql://root@127.0.0.1:3306");
        console.log("Connected successfully!");
        await connection.query("CREATE DATABASE IF NOT EXISTS shopping_cart");
        console.log("Database ensured.");
        await connection.end();
    } catch (err) {
        console.error("Connection failed:", err.message);
    }
}

test();
