const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
app.use(express.json()); 
app.use(cors());
const port = process.env.PORT || 8080;

app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on ${port} port`);
});
