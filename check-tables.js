const mysql = require('mysql2/promise');

async function check() {
    try {
        const connection = await mysql.createConnection("mysql://root@127.0.0.1:3306/shopping_cart");
        const [rows] = await connection.query("SHOW TABLES");
        console.log("Tables in database:", rows);
        await connection.end();
    } catch (err) {
        console.error("Check failed:", err.message);
    }
}

check();
