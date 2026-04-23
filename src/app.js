const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const transportRoutes = require("./routes/transportRoutes");
const omborRoutes = require("./routes/omborRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ ok: true, service: "temir-zavod-backend" });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/transports", transportRoutes);
app.use("/api/ombor", omborRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

module.exports = app;
