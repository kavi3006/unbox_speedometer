import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  database: process.env.PGDATABASE || "speeddb",
});

app.use(cors());
app.use(express.json());

app.get("/api/speed/latest", async (_req, res) => {
  const q = await pool.query(
    "SELECT * FROM speed_data ORDER BY ts DESC LIMIT 1"
  );
  res.json(q.rows[0] || {});
});

let lastId = null;
setInterval(async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM speed_data ORDER BY ts DESC LIMIT 1"
    );
    const latest = result.rows[0];
    if (latest && latest.id !== lastId) {
      lastId = latest.id;
      io.emit("speedUpdate", latest); // emit event
    }
  } catch (err) {
    console.error("Fetching error:", err.message);
  }
}, 1000);

server.listen(4000, () =>
  console.log("Backend running on http://localhost:4000")
);
