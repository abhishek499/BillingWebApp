const express = require("express");
const app = express();

app.use(express.json());

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
