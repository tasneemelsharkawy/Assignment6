require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");

const collectionRoutes = require("./routes/collectionRoutes");
const bookRoutes = require("./routes/bookRoutes");
const logRoutes = require("./routes/logRoutes");

const app = express();
app.use(express.json());

app.use("/", collectionRoutes);
app.use("/", bookRoutes);
app.use("/", logRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start the server:", error.message);
  }
}

start();

module.exports = app;
