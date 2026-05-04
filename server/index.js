const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { WebSocketServer } = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "supersecret";

// ===== ФЕЙК БД =====
const likes = {};      // { postId: [userId] }
const comments = {};   // { postId: [{ id, text, user }] }

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
      const data = JSON.parse(msg.toString());

      // ===== LIKE =====
      if (data.type === "LIKE") {
        const { postId } = data;

        if (!likes[postId]) likes[postId] = [];

        const alreadyLiked = likes[postId].includes(user.id);

        if (alreadyLiked) {
          likes[postId] = likes[postId].filter((id) => id !== user.id);
        } else {
          likes[postId].push(user.id);
        }

        broadcast({
          type: "LIKE_UPDATE",
          postId,
          likes: likes[postId],
        });
      }

      // ===== COMMENT =====
      if (data.type === "COMMENT") {
        const { postId, text } = data;

        if (!comments[postId]) comments[postId] = [];

        const newComment = {
          id: Date.now(),
          text,
          user: ws.user,
        };

        comments[postId].push(newComment);

        broadcast({
          type: "COMMENT_UPDATE",
          postId,
          comments: comments[postId],
        });
      }

      // ===== CHAT =====
      if (data.type === "CHAT") {
        broadcast({
          type: "CHAT",
          user: user.name,
          message: data.message,
        });
      }
    });

    function broadcast(data) {
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(data));
        }
      });
    }

  } catch (err) {
    console.log("WS auth error");
    ws.close();
  }
});