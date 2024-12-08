const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models");
const routes = require("./routes");
const { initSocket } = require("./utils/socket");

dotenv.config();

const app = express();
const server = require("http").createServer(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", routes);
app.use("/uploads", express.static("uploads")); // Serve uploaded files

initSocket(server); // Initialize socket

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }).then(() => {
  console.log("Database connected");

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
