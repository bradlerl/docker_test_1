const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static(__dirname));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

app.get('/api/data', async (req, res) => {
    try {
        console.log("Connecting to SQL Server...")
        const [rows] = await pool.query('SELECT * FROM Rivals');
        res.json(rows);
    } catch (err) {
        console.error("SQL ERROR:", err);
        res.status(500).send(err.message);
    }
});

app.get('/', (req, res) => {
    res.send('API is running');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
