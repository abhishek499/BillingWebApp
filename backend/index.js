const express = require("express");
const app = express();

const path = require("path");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");


var ObjectID = require("mongodb").ObjectId;
var expressValidator = require("express-validator");

const MongoClient = require("mongodb").MongoClient;

const jwt = require("jsonwebtoken");
const bcryptt = require("bcryptjs");
const crypt = require("crypto");

const url =
  "mongodb+srv://abhishek:IjPIudaTPELpJK33@cluster0.p5gye.mongodb.net/myFirstDatabase?authSource=admin&replicaSet=atlas-5coxab-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";

const saltRounds = 10;

const bodyParser = require("body-parser");

const methodOverride = require("method-override");

const nodemailer = require("nodemailer");

const pdfkit = require("pdfkit");

ACCESS_TOKEN_SECRET =
  "asf67567a5s346edf5a7f68d9sgd897ga6g5dkjjhasjdgasdusatd68f67gaf8a987fdg6f65f67gf6dg56fghjmlkskbnsf8g6v8";

app.use(express.json());
app.use(cors());
app.use(expressValidator());

// Middleware
app.use(bodyParser.json());
app.use(methodOverride("_method"));

// // Mongo URI
// const mongoURI = "mongodb+srv://shrijay:thisispassowrd@cluster0.zygpc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// // Create mongo connection

const conn = mongoose.createConnection(url);

const doc = new pdfkit();

const fs = require("fs");

// let gfs;

// conn.once("open", () => {
//   // Init stream
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection("uploads");
// });

// Create storage engine
// const storage = new GridFsStorage({
//   url: url,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString("hex") + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: "uploads",
//         };
//         resolve(fileInfo);
//       });
//     });
//   },
// });
// const upload = multer({ storage });

var as = 1;
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post("/login", (req, res) => {
  // Authenticate User
  console.log("ABhishekkkk");
  const ress = res;
  req.checkBody("email", "email field cannot be empty.").notEmpty();
  req.checkBody("password", "password field cannot be empty.").notEmpty();
  const errors = req.validationErrors();
  emailarr = 1;
  passwordarr = 1;
  if (errors) {
    const error = {};
    console.log("req recieved!");
    errors.forEach((currentValue, index, array) => {
      if (currentValue.param == "email") {
        if (emailarr) {
          error.email = [currentValue.msg];
          emailarr = 0;
        } else error.email.push(currentValue.msg);
      }
      if (currentValue.param == "password") {
        if (passwordarr) {
          error.password = [currentValue.msg];
          passwordarr = 0;
        } else error.password.push(currentValue.msg);
      }
    });

    ress.status(401).json({ error: error });
  } else {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("billingDb");
      emails = req.body.email;
      passwordd = req.body.password;
      dbo
        .collection("users")
        .findOne({ email: emails }, function (err, result) {
          if (err) throw err;
          console.log(result);
          if (result) {
            bcryptt.compare(
              passwordd,
              result.Password,
              function (err, resulttt) {
                // result == true
                if (resulttt) {
                  const accessToken = jwt.sign(
                    { id: result._id },
                    ACCESS_TOKEN_SECRET,
                    { expiresIn: "60d" }
                  );
                  ress.json({
                    success: {
                      accessToken: accessToken,
                      admin: result.admin,
                      setupyourbusinessform: result.setupyourbusinessform
                        ? result.setupyourbusinessform
                        : false,
                      message: "you have successfully login",
                    },
                  });
                } else {
                  ress.status(401).send({
                    error: {
                      creadentialinvalid: "email or password is wrong",
                    },
                  });
                }
              }
            );
          } else {
            ress.status(401).json({
              error: { creadentialinvalid: "email or password is wrong" },
            });
          }
        });
    });
  }
});

app.post("/registration", async (req, res) => {
  console.log("registerrring");
  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("billingDb");

      emails = req.body.email;

      dbo.collection("users").findOne(
        { "registration.email": emails },
        async function (err, result) {
          if (err) throw err;
          if (result) {
            db.close();

            return res
              .status(401)
              .json({ error: { email: "email alredy exist" } });
          }
          username = req.body.username;
          result = await dbo
            .collection("users")
            .findOne({ "registration.username": username });
          if (result) {
            db.close();

            return res
              .status(401)
              .json({ error: { username: "username alredy exist" } });
          } else {
            req.checkBody("fullname").trim();

            req.checkBody("number").trim();

            req.checkBody("email").trim();
            req.checkBody("password").trim();

            req.checkBody("username").trim();

            req
              .checkBody("username", "username field cannot be empty.")
              .notEmpty();
            req
              .checkBody(
                "username",
                "username must be between 4-20 charecter long"
              )
              .len(4, 20);
            req
              .checkBody("username", "username must be Alphanumeric")
              .isAlphanumeric();

            req
              .checkBody("fullname", "fullname field cannot be empty.")
              .notEmpty();
            req
              .checkBody(
                "fullname",
                "fullname must be between 4-15 charecter long"
              )
              .len(4, 40);
            req
              .checkBody("fullname", "fullname must be Charecter")
              .optional()
              .matches(/^[a-z0-9 ]+$/i);

            req.checkBody("number", "number field cannot be empty.").notEmpty();
            req.checkBody("number", "number field must be number.").isNumeric();

            req.checkBody("email", "email field cannot be empty.").notEmpty();
            req
              .checkBody(
                "email",
                "The email you entered is invalid, please try again. "
              )
              .isEmail();
            req
              .checkBody(
                "email",
                "Email address must be between 4-100 characters long, please try again."
              )
              .len(4, 100);

            req
              .checkBody("password", "password field cannot be empty.")
              .notEmpty();
            req
              .checkBody(
                "password",
                "Password must be between 8-100 characters long."
              )
              .len(8, 100);
            req
              .checkBody(
                "password",
                "Password must include one lowercase character, one uppercase character, a number, and special character."
              )
              .matches(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/,
                "i"
              );
            const errors = req.validationErrors();
            emailarr = 1;
            passwordarr = 1;

            numberarr = 1;
            fullnamearr = 1;

            usernamearr = 1;

            // if (errors) {
            //   error = {};
            //   errors.forEach((currentValue, index, array) => {
            //     if (currentValue.param == "username") {
            //       if (usernamearr) {
            //         error.username = [currentValue.msg];
            //         usernamearr = 0;
            //       } else error.username.push(currentValue.msg);
            //     }

            //     if (currentValue.param == "email") {
            //       if (emailarr) {
            //         error.email = [currentValue.msg];
            //         emailarr = 0;
            //       } else error.email.push(currentValue.msg);
            //     }
            //     if (currentValue.param == "fullname") {
            //       if (fullnamearr) {
            //         error.fullname = [currentValue.msg];
            //         fullnamearr = 0;
            //       } else error.fullname.push(currentValue.msg);
            //     }

            //     if (currentValue.param == "number") {
            //       if (numberarr) {
            //         error.number = [currentValue.msg];
            //         numberarr = 0;
            //       } else error.number.push(currentValue.msg);
            //     }

            //     if (currentValue.param == "password") {
            //       if (passwordarr) {
            //         error.password = [currentValue.msg];
            //         passwordarr = 0;
            //       } else error.password.push(currentValue.msg);
            //     }
            //   });

            //   res.status(200).json({ error: error });
            //   db.close();
            //   return;
            // } else {
            bcryptt.hash(
              req.body.password,
              saltRounds,
              async function (err, hash) {
                if (err) throw err;
                buffer = await crypt.randomBytes(48);
                tokenforurl = buffer.toString("hex");

                date = Date.parse(new Date());
                var myobj = {
                  verificationtoken: tokenforurl,
                  name: req.body.name,
                  email: req.body.email,
                  Password: hash,
                  number: req.body.phNo,
                  PlainPassword: req.body.password,
                  passwordverificationtoken: "",
                  passwordtoken: "",
                  verify: false,
                  added_on: date,
                  username: req.body.username,
                  updated_on: date,
                  admin: true,
                  setupyourbusinessform: false,
                  setupyourbusinessformentry: {},
                  employees: [],
                  products: [],
                  sales: [],
                  clients: [],
                  invoices: [],
                };
                dbo
                  .collection("users")
                  .insertOne(myobj, async function (err, result) {
                    if (err) throw err;

                    // async function main() {
                    //   // Generate test SMTP service account from ethereal.email
                    //   // Only needed if you don't have a real mail account for testing

                    //   // create reusable transporter object using the default SMTP transport
                    //   let transporter = nodemailer.createTransport({
                    //     service: "gmail",
                    //     host: "smtp.gmail.com",
                    //     port: 465,
                    //     secure: true, // true for 465, false for other ports
                    //     auth: {
                    //       user: "localbaziprayagraj@gmail.com", // generated ethereal user
                    //       pass: "local@bazi12", // generated ethereal password
                    //     },
                    //     tls: {
                    //       rejectUnauthorized: false,
                    //     },
                    //   });
                    //   urlfortokennew =
                    //     "http://15.207.215.123:5000/token/" + tokenforurl;
                    //   // send mail with defined transport object
                    //   let info = await transporter.sendMail({
                    //     from: '"Local Bazi " <localbaziprayagraj@gmail.com>', // sender address
                    //     to: req.body.email, // list of receivers
                    //     subject: "Verify Your Account", // Subject line
                    //     //text: "http://194.59.165.156/token/"+tokenforurl, // plain text body

                    //     html:
                    //       "<div><h3>Verify<br>" +
                    //       req.body.email +
                    //       "<br>Hi " +
                    //       req.body.fullname +
                    //       "<br>Please Confirm Your Email Address <br>Thank you for singin up for Localbazi. We are happy you are here<br>Click the button to verify your email address</h3></div>" +
                    //       "<h2><a href='" +
                    //       urlfortokennew +
                    //       "'>click here for verfication</a></h2>", // html body
                    //   });

                    //   console.log("Message sent: %s", info.messageId);
                    //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                    //   // Preview only available when sending through an Ethereal account
                    //   console.log(
                    //     "Preview URL: %s",
                    //     nodemailer.getTestMessageUrl(info)
                    //   );
                    //   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                    // }

                    // main().catch(console.error);

                    res.json({
                      success:
                        "you have done registration, we have sent you an email now please verify your email",
                    });
                    return;
                  });
              }
            );
          }
        }
        // }
      );
    }
  );
});

app.get("/", (req, res) => {
  res.json({ asd: "asdguj" });
  console.log("asd");
});

app.post("/adduser", async (req, res) => {
  console.log("add New User");
  jwt.verify(req.body.token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("billingDb");

        emails = req.body.email;

        dbo.collection("users").findOne(
          { _id: new ObjectID(user.id) },
          async function (err, result) {
            console.log(result);

            if (err) throw err;
            console.log(
              result.employees.find((element) => element.email === emails)
            );
            if (result.employees.length !== 0) {
              if (
                result.employees.find((element) => element.email === emails)
              ) {
                db.close();

                return res
                  .status(200)
                  .json({ error: { message: "email alredy exist" } });
              }
            }
            {
              req.checkBody("fullname").trim();

              req.checkBody("email").trim();
              req.checkBody("password").trim();

              req
                .checkBody("fullname", "fullname field cannot be empty.")
                .notEmpty();
              req
                .checkBody(
                  "fullname",
                  "fullname must be between 4-15 charecter long"
                )
                .len(4, 40);
              req
                .checkBody("fullname", "fullname must be Charecter")
                .optional()
                .matches(/^[a-z0-9 ]+$/i);

              req.checkBody("email", "email field cannot be empty.").notEmpty();
              req
                .checkBody(
                  "email",
                  "The email you entered is invalid, please try again. "
                )
                .isEmail();
              req
                .checkBody(
                  "email",
                  "Email address must be between 4-100 characters long, please try again."
                )
                .len(4, 100);

              req
                .checkBody("password", "password field cannot be empty.")
                .notEmpty();
              req
                .checkBody(
                  "password",
                  "Password must be between 8-100 characters long."
                )
                .len(8, 100);
              req
                .checkBody(
                  "password",
                  "Password must include one lowercase character, one uppercase character, a number, and special character."
                )
                .matches(
                  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/,
                  "i"
                );
              const errors = req.validationErrors();
              emailarr = 1;
              passwordarr = 1;

              fullnamearr = 1;

              // if (errors) {
              //   error = {};
              //   errors.forEach((currentValue, index, array) => {
              //     if (currentValue.param == "email") {
              //       if (emailarr) {
              //         error.email = [currentValue.msg];
              //         emailarr = 0;
              //       } else error.email.push(currentValue.msg);
              //     }
              //     if (currentValue.param == "fullname") {
              //       if (fullnamearr) {
              //         error.fullname = [currentValue.msg];
              //         fullnamearr = 0;
              //       } else error.fullname.push(currentValue.msg);
              //     }

              //     if (currentValue.param == "password") {
              //       if (passwordarr) {
              //         error.password = [currentValue.msg];
              //         passwordarr = 0;
              //       } else error.password.push(currentValue.msg);
              //     }
              //   });

              //   res.status(401).json({ error: error });
              //   db.close();
              //   return;
              // } else {
              bcryptt.hash(
                req.body.password,
                saltRounds,
                async function (err, hash) {
                  if (err) throw err;

                  date = Date.parse(new Date());
                  var myobj = {
                    name: req.body.name,
                    email: req.body.email,
                    PlainPassword: req.body.password,
                    Password: hash,
                    added_on: date,
                    updated_on: date,
                    admin: false,
                  };
                  dbo.collection("users").findOneAndUpdate(
                    { _id: new ObjectID(user.id) },
                    {
                      $push: {
                        employees: myobj,
                      },
                    },
                    async function (err, result) {
                      if (err) throw err;

                      return res.json({
                        success: "you have successfully added an employee",
                      });
                    }
                  );
                }
              );
            }
          }
          // }
        );
      }
    );
  });
});

app.post("/addservice", async (req, res) => {
  console.log("addding service");
  jwt.verify(req.body.token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("billingDb");

        req.checkBody("name").trim();

        req.checkBody("hsnnumber").trim();

        req.checkBody("tax").trim();
        req.checkBody("description").trim();

        req.checkBody("name", "name field cannot be empty.").notEmpty();
        req
          .checkBody("name", "name must be between 4-30 charecter long")
          .len(4, 30);

        req
          .checkBody("description", "description field cannot be empty.")
          .notEmpty();
        req
          .checkBody(
            "description",
            "description must be between 4-400 charecter long"
          )
          .len(4, 400);

        req.checkBody("tax", "tax field cannot be empty.").notEmpty();
        req.checkBody("tax", "tax field must be number.").isNumeric();

        req
          .checkBody("hsnnumber", "hsnnumber field cannot be empty.")
          .notEmpty();
        req
          .checkBody("hsnnumber", "hsnnumber field must be number.")
          .isNumeric();
        req
          .checkBody(
            "hsnnumber",
            "hsnnumber must be between 5-6 charecter long"
          )
          .len(5, 6);

        const errors = req.validationErrors();

        namearr = 1;
        taxarr = 1;

        hsnnumberarr = 1;
        descriptionarr = 1;

        // if (errors) {
        //   error = {};
        //   errors.forEach((currentValue, index, array) => {
        //     if (currentValue.param == "description") {
        //       if (descriptionarr) {
        //         error.description = [currentValue.msg];
        //         descriptionarr = 0;
        //       } else error.description.push(currentValue.msg);
        //     }

        //     if (currentValue.param == "tax") {
        //       if (taxarr) {
        //         error.tax = [currentValue.msg];
        //         taxarr = 0;
        //       } else error.tax.push(currentValue.msg);
        //     }
        //     if (currentValue.param == "hsnnumber") {
        //       if (hsnnumberarr) {
        //         error.hsnnumber = [currentValue.msg];
        //         hsnnumberarr = 0;
        //       } else error.hsnnumber.push(currentValue.msg);
        //     }

        //     if (currentValue.param == "name") {
        //       if (namearr) {
        //         error.name = [currentValue.msg];
        //         namearr = 0;
        //       } else error.name.push(currentValue.msg);
        //     }
        //   });

        //   res.status(401).json({ error: error });
        //   db.close();
        //   return;
        // } else {
        var myobj = {
          name: req.body.name,
          hsnnumber: req.body.hsnCode,
          // description: req.body.description,
          tax: req.body.gst,
        };
        dbo.collection("users").findOneAndUpdate(
          { _id: new ObjectID(user.id) },
          {
            $push: {
              products: myobj,
            },
          },
          async function (err, result) {
            if (err) throw err;

            return res.json({
              success: "you have successfully add new service",
            });
          }
        );
      }
      // }
    );
  });
});

app.post("/addclient", async (req, res) => {
  console.log("addding client");
  jwt.verify(req.body.token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("billingDb");

        req.checkBody("businessname").trim();

        req.checkBody("contactnumber").trim();

        req.checkBody("address").trim();

        req
          .checkBody("businessname", "businessname field cannot be empty.")
          .notEmpty();
        req
          .checkBody(
            "businessname",
            "businessname must be between 4-40 charecter long"
          )
          .len(4, 40);

        req.checkBody("address", "address field cannot be empty.").notEmpty();
        req
          .checkBody("address", "address must be between 4-400 charecter long")
          .len(4, 400);

        req
          .checkBody("contactnumber", "contactnumber field cannot be empty.")
          .notEmpty();
        req
          .checkBody("contactnumber", "contactnumber field must be number.")
          .isNumeric();
        req
          .checkBody(
            "contactnumber",
            "contactnumber must be between 5-6 charecter long"
          )
          .len(8, 13);

        const errors = req.validationErrors();

        businessnamearr = 1;
        addressarr = 1;

        contactnumberarr = 1;

        // if (errors) {
        //   error = {};
        //   errors.forEach((currentValue, index, array) => {
        //     if (currentValue.param == "businessname") {
        //       if (businessnamearr) {
        //         error.businessname = [currentValue.msg];
        //         businessnamearr = 0;
        //       } else error.businessname.push(currentValue.msg);
        //     }

        //     if (currentValue.param == "address") {
        //       if (addressarr) {
        //         error.address = [currentValue.msg];
        //         addressarr = 0;
        //       } else error.address.push(currentValue.msg);
        //     }
        //     if (currentValue.param == "contactnumber") {
        //       if (contactnumberarr) {
        //         error.contactnumber = [currentValue.msg];
        //         contactnumberarr = 0;
        //       } else error.contactnumber.push(currentValue.msg);
        //     }
        //   });

        //   res.status(401).json({ error: error });
        //   db.close();
        //   return;
        // } else {
        var myobj = {
          businessname: req.body.businessName,
          contactnumber: req.body.contactNo,
          address: req.body.address,
          gstIn: req.body.gstIn,
        };
        dbo.collection("users").findOneAndUpdate(
          { _id: new ObjectID(user.id) },
          {
            $push: {
              clients: myobj,
            },
          },
          async function (err, result) {
            if (err) throw err;

            return res.json({
              success: "you have successfully add new client",
            });
          }
        );
      }
      // }
    );
  });
});

app.delete("/client", async (req, res) => {
  jwt.verify(req.body.token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("billingdb");
        dbo
          .collection("client")
          .deleteOne(
            { _id: new ObjectID(req.body.id) },
            async function (err, result) {
              if (err) throw err;

              return res.json({
                success: "you have successfully delete client",
              });
            }
          );
      }
    );
  });
});

app.get("/client", async (req, res) => {
  jwt.verify(req.body.token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("billingdb");

        const data = dbo.collection("client").find({}).toArray();

        return res.json({
          success: "you have successfully get all client",
          data: data,
        });
      }
    );
  });
});

app.get("/service", async (req, res) => {
  jwt.verify(req.body.token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("billingdb");

        const data = dbo.collection("service").find({}).toArray();

        return res.json({
          success: "you have successfully get all services",
          data: data,
        });
      }
    );
  });
});

app.delete("/service", async (req, res) => {
  jwt.verify(req.body.token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("billingdb");
        dbo
          .collection("service")
          .deleteOne(
            { _id: new ObjectID(req.body.id) },
            async function (err, result) {
              if (err) throw err;

              return res.json({
                success: "you have successfully delete service",
              });
            }
          );
      }
    );
  });
});

app.post("/setupyourbusinessform", async (req, res) => {
  jwt.verify(req.body.token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        console.log(req.body);
        if (err) throw err;
        var dbo = db.db("billingDb");

        req.checkBody("businessname").trim();

        req.checkBody("registerofficeaddress").trim();

        req.checkBody("corporateofficeaddress").trim();
        req.checkBody("gstin").trim();

        req.checkBody("number").trim();

        req.checkBody("email").trim();
        req.checkBody("pincode").trim();
        req.checkBody("pan").trim();

        req
          .checkBody("businessname", "businessname field cannot be empty.")
          .notEmpty();
        req
          .checkBody(
            "businessname",
            "businessname must be between 4-30 charecter long"
          )
          .len(4, 30);

        req
          .checkBody(
            "registerofficeaddress",
            "registerofficeaddress field cannot be empty."
          )
          .notEmpty();
        req
          .checkBody(
            "registerofficeaddress",
            "registerofficeaddress must be between 4-50 charecter long"
          )
          .len(4, 50);

        req
          .checkBody(
            "corporateofficeaddress",
            "corporateofficeaddress field cannot be empty."
          )
          .notEmpty();
        req
          .checkBody(
            "corporateofficeaddress",
            "corporateofficeaddress must be between 4-50 charecter long"
          )
          .len(4, 50);

        req.checkBody("gstin", "gstin field cannot be empty.").notEmpty();
        req
          .checkBody("gstin", "gstin must be between 4-20 charecter long")
          .len(4, 20);

        req.checkBody("number", "number field cannot be empty.").notEmpty();
        req.checkBody("number", "number field must be number.").isNumeric();
        req.checkBody("pincode", "pincode field cannot be empty.").notEmpty();
        req.checkBody("pincode", "pincode field must be number.").isNumeric();

        req.checkBody("email", "email field cannot be empty.").notEmpty();

        req
          .checkBody(
            "email",
            "The email you entered is invalid, please try again. "
          )
          .isEmail();
        req
          .checkBody(
            "email",
            "Email address must be between 4-100 characters long, please try again."
          )
          .len(4, 100);

        req.checkBody("pan", "pan field cannot be empty.").notEmpty();
        req
          .checkBody("pan", "pan must be between 4-20 charecter long")
          .len(4, 20);

        const errors = req.validationErrors();
        emailarr = 1;
        businessnamearr = 1;
        registerofficeaddressarr = 1;
        corporateofficeaddressarr = 1;
        numberarr = 1;
        gstinarr = 1;
        pincodearr = 1;
        panarr = 1;

        // if (errors) {
        //   error = {};
        //   errors.forEach((currentValue, index, array) => {
        //     if (currentValue.param == "pan") {
        //       if (panarr) {
        //         error.pan = [currentValue.msg];
        //         panarr = 0;
        //       } else error.pan.push(currentValue.msg);
        //     }

        //     if (currentValue.param == "pincode") {
        //       if (pincodearr) {
        //         error.pincode = [currentValue.msg];
        //         pincodearr = 0;
        //       } else error.pincode.push(currentValue.msg);
        //     }

        //     if (currentValue.param == "gstin") {
        //       if (gstinarr) {
        //         error.gstin = [currentValue.msg];
        //         gstinarr = 0;
        //       } else error.gstin.push(currentValue.msg);
        //     }

        //     if (currentValue.param == "corporateofficeaddress") {
        //       if (corporateofficeaddressarr) {
        //         error.corporateofficeaddress = [currentValue.msg];
        //         corporateofficeaddressarr = 0;
        //       } else error.corporateofficeaddress.push(currentValue.msg);
        //     }

        //     if (currentValue.param == "registerofficeaddress") {
        //       if (registerofficeaddressarr) {
        //         error.registerofficeaddress = [currentValue.msg];
        //         registerofficeaddressarr = 0;
        //       } else error.registerofficeaddress.push(currentValue.msg);
        //     }

        //     if (currentValue.param == "businessname") {
        //       if (businessnamearr) {
        //         error.businessname = [currentValue.msg];
        //         businessnamearr = 0;
        //       } else error.businessname.push(currentValue.msg);
        //     }

        //     if (currentValue.param == "email") {
        //       if (emailarr) {
        //         error.email = [currentValue.msg];
        //         emailarr = 0;
        //       } else error.email.push(currentValue.msg);
        //     }

        //     if (currentValue.param == "number") {
        //       if (numberarr) {
        //         error.number = [currentValue.msg];
        //         numberarr = 0;
        //       } else error.number.push(currentValue.msg);
        //     }
        //   });

        //   res.status(200).json({ error: error });
        //   db.close();
        //   return;
        // } else
        {
          var myobj = {
            bName: req.body.bName,
            regOfficeAdd: req.body.regOfficeAdd,
            corpOfficeAdd: req.body.corpOfficeAdd,
            gstIn: req.body.gstIn,
            mob: req.body.mob,
            bEmail: req.body.emailId,
            pinCode: req.body.pinCode,
            pan: req.body.pan,
          };

          dbo.collection("users").findOneAndUpdate(
            { _id: new ObjectID(user.id) },
            {
              $set: {
                setupyourbusinessform: true,
                setupyourbusinessformentry: myobj,
              },
            },
            async function (err, result) {
              if (err) throw err;

              res.json({
                success: {
                  message: "you have done setupyourbusinessform registration",
                  setupyourbusinessform: true,
                },
              });
            }
          );
        }
      }
    );
  });
});

app.post("/changepassword", (req, res) => {
  // Authenticate User
  console.log("asd");

  jwt.verify(req.body.token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("billingdb");

      req.checkBody("changepassword").trim();

      req
        .checkBody("changepassword", "password field cannot be empty.")
        .notEmpty();
      req
        .checkBody(
          "changepassword",
          "Password must be between 8-20 characters long."
        )
        .len(8, 20);
      req
        .checkBody(
          "changepassword",
          "Password must include one lowercase character, one uppercase character, a number, and special character."
        )
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/,
          "i"
        );
      const errors = req.validationErrors();

      changepasswordpasswordarr = 1;

      if (errors) {
        error = {};
        errors.forEach((currentValue, index, array) => {
          if (currentValue.param == "changepassword") {
            if (changepasswordpasswordarr) {
              error.password = [currentValue.msg];
              changepasswordpasswordarr = 0;
            } else error.password.push(currentValue.msg);
          }
        });

        res.status(401).json({ error: error });
        db.close();
        return;
      } else {
        bcryptt.hash(
          req.body.changepassword,
          saltRounds,
          async function (err, hash) {
            if (err) throw err;

            dbo.collection("register").findOneAndUpdate(
              { _id: new ObjectID(user.id) },
              {
                $set: {
                  Password: hash,
                  PlainPassword: req.body.changepassword,
                },
              },
              async function (err, result) {
                if (err) throw err;

                res.json({
                  success: "you have Succefully changed your password",
                });
                return;
              }
            );
          }
        );
      }
    });
  });
});
//change

app.get("/token/:token", (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("billingdb");
    tokeen = req.params.token;

    dbo
      .collection("register")
      .findOneAndUpdate(
        { verificationtoken: tokeen },
        { $set: { verify: true } },
        function (err, result) {
          if (err) throw err;

          db.close();
          //res.send(nomineeverification)
          res.render("verification");
        }
      );
  });
});

app.post("/getuser", (req, res) => {
  // Authenticate User
  console.log("calling");

  jwt.verify(req.body.token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("billingDb");

      dbo
        .collection("users")
        .findOne({ _id: new ObjectID(user.id) }, function (err, result) {
          if (err) throw err;

          res.json(result.employees);
        });
    });
  });
});

app.get("/yes", (req, res) => {
  res.send("Hello World! asd");
  console.log("yes called");
});

app.post("/addinvoice", async (req, res) => {
  console.log("addding invoice");
  jwt.verify(req.body.token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("billingDb");

        req.checkBody("businessName").trim();

        req.checkBody("name", "name field cannot be empty.").notEmpty();
        req
          .checkBody("name", "name must be between 4-30 charecter long")
          .len(4, 30);

        req
          .checkBody("description", "description field cannot be empty.")
          .notEmpty();
        req
          .checkBody(
            "description",
            "description must be between 4-400 charecter long"
          )
          .len(4, 400);

        req.checkBody("tax", "tax field cannot be empty.").notEmpty();
        req.checkBody("tax", "tax field must be number.").isNumeric();

        req
          .checkBody("hsnnumber", "hsnnumber field cannot be empty.")
          .notEmpty();
        req
          .checkBody("hsnnumber", "hsnnumber field must be number.")
          .isNumeric();
        req
          .checkBody(
            "hsnnumber",
            "hsnnumber must be between 5-6 charecter long"
          )
          .len(5, 6);

        const errors = req.validationErrors();

        namearr = 1;
        taxarr = 1;

        hsnnumberarr = 1;
        descriptionarr = 1;

        // if (errors) {
        //   error = {};
        //   errors.forEach((currentValue, index, array) => {
        //     if (currentValue.param == "description") {
        //       if (descriptionarr) {
        //         error.description = [currentValue.msg];
        //         descriptionarr = 0;
        //       } else error.description.push(currentValue.msg);
        //     }

        //     if (currentValue.param == "tax") {
        //       if (taxarr) {
        //         error.tax = [currentValue.msg];
        //         taxarr = 0;
        //       } else error.tax.push(currentValue.msg);
        //     }
        //     if (currentValue.param == "hsnnumber") {
        //       if (hsnnumberarr) {
        //         error.hsnnumber = [currentValue.msg];
        //         hsnnumberarr = 0;
        //       } else error.hsnnumber.push(currentValue.msg);
        //     }

        //     if (currentValue.param == "name") {
        //       if (namearr) {
        //         error.name = [currentValue.msg];
        //         namearr = 0;
        //       } else error.name.push(currentValue.msg);
        //     }
        //   });

        //   res.status(401).json({ error: error });
        //   db.close();
        //   return;
        // } else {
        var myobj = {
          businessName: req.body.businessName,
          services: req.body.services,
        };
        dbo.collection("users").findOneAndUpdate(
          { _id: new ObjectID(user.id) },
          {
            $push: {
              invoice: myobj,
            },
          },

          async function (err, result) {
            if (err) throw err;

            doc.pipe(fs.createWriteStream("output.pdf"));

            doc
              .fontSize(30)
              .text("Marketonic", { align: "center", weight: "bold" });

            doc.moveDown();

            doc.rect(doc.x, 0, 410, doc.y).stroke();

            doc.end();
            return res.json({
              success: "you have successfully add new service",
            });
          }
        );
      }
      // }
    );
  });
});

app.listen(8000, () => {
  console.log("Server has succesfully started at port at 8000");
});
