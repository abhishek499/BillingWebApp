const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

//Routers
const userRouter = require("./routes/UserRoutes");
app.use("/user", userRouter);

db.sequelize.sync().then((result) => {
  // console.log(result);
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
})
.catch((err) => {
  console.log(err);
})
