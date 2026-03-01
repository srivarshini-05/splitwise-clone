const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/overview", require("./routes/overview"));
app.use("/api/finance", require("./routes/finance"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/budget", require("./routes/budget"));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});