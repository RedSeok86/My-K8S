const http = require("http");
const mysql = require("mysql2/promise");

const PORT = process.env.PORT || 3000;

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.url === "/health") {
    res.end(JSON.stringify({
      status: "OK",
      app: "nodejs-app",
      version: "v3"
    }));
    return;
  }

  if (req.url === "/db-check") {
    try {
      const conn = await mysql.createConnection(dbConfig);
      const [rows] = await conn.execute("SELECT NOW() AS now");
      await conn.end();

      res.end(JSON.stringify({
        status: "DB_OK",
        dbTime: rows[0].now
      }));
      return;
    } catch (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({
        status: "DB_FAIL",
        error: err.message
      }));
      return;
    }
  }

  if (req.url === "/add-user") {
    try {
      const conn = await mysql.createConnection(dbConfig);

      await conn.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await conn.execute("INSERT INTO users (name) VALUES (?)", ["jaeseok"]);
      await conn.end();

      res.end(JSON.stringify({
        status: "INSERT_OK",
        name: "jaeseok"
      }));
      return;
    } catch (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({
        status: "DB_FAIL",
        error: err.message
      }));
      return;
    }
  }

  if (req.url === "/users") {
    try {
      const conn = await mysql.createConnection(dbConfig);

      await conn.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      const [rows] = await conn.execute("SELECT * FROM users ORDER BY id DESC");
      await conn.end();

      res.end(JSON.stringify({
        status: "OK",
        users: rows
      }));
      return;
    } catch (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({
        status: "DB_FAIL",
        error: err.message
      }));
      return;
    }
  }

  res.statusCode = 404;
  res.end(JSON.stringify({
    error: "Not Found",
    available_paths: ["/health", "/db-check", "/add-user", "/users"]
  }));
});

server.listen(PORT, () => {
  console.log(`Node.js app listening on port ${PORT}`);
});
