const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the production-ready backend API.",
    version: "1.0.0",
    routes: ["/api", "/api/status", "/api/echo"]
  });
});

router.get("/status", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

router.post("/echo", (req, res) => {
  res.json({
    received: req.body,
    message: "Payload received successfully."
  });
});

module.exports = router;
