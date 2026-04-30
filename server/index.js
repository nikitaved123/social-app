const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { WebSocketServer } = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "supersecret";

// ===== LOGIN =====
app.post("/login", (req, res) => {
  const { name } = req.body;

  const user = {
    id: Date.now(),
    name,
  };

  const token = jwt.sign(user, SECRET);

  res.json({ token, user });
});

// ===== VERIFY TOKEN =====
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};

app.get("/me", auth, (req, res) => {
  res.json(req.user);
});

// ===== START SERVER =====
const server = app.listen(3001, () =>
  console.log("Server running on http://localhost:3001")
);

// ===== WEBSOCKET =====
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  const token = new URL(req.url, "http://localhost").searchParams.get("token");

  try {
    const user = jwt.verify(token, SECRET);
    ws.user = user;

    console.log("User connected:", user.name);

    ws.on("message", (msg) => {
      // рассылаем всем
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(
            JSON.stringify({
              user: user.name,
              message: msg.toString(),
            })
          );
        }
      });
    });
  } catch {
    ws.close();
  }
});