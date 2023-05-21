const env = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const appError = require("./src/utils/appError");
const globalErrorHandler = require("./src/controller/error.controller");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

env.config({ path: `${__dirname}/.env` });
const app = express();

// set Securing HTTP Header
app.use(helmet());

app.use(express.json());
const port = process.env.PORT || 7000;

// Rate Limit from same ip
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    " Too Many Request from this same IP. Please try again after 1 hour.",
});
app.use("/api", limiter);
app.use(cors());

// Data sanitization against NoSQL query injection.
// {
//   "email": {"$gt":""},
//   "password": "sudippal"
// }
// above code is able to successfully login in. without email. only password
app.use(mongoSanitize());

//Data sanitization against XSS attack
app.use(xss());

// environment polution
// if we have any filter multiple times then error occured. like "api/v1/tours?sort=price?sort=duration" to prevent that we use hpp module
app.use(
  hpp({
    whitelist: ["duration"],
  })
);

app.get("/", (req, res) => {
  res.status(200).send("welcome to OTAA project");
});

//DB connection part
const DB = process.env.DATABASE_URL.replace(
  "<password>",
  process.env.DATABASE_PASS
);
// console.log(DB)
mongoose.set("strictQuery", false);
mongoose
  .connect(DB)
  .then(() => console.log("connect with database successfully"));
// .catch((err) => console.log("error occured in connection of database", err));
//we can handle this rejection promise by catch or globally. below we handled it globally

//middlewre
// app.use((req, res, next) => {
//   console.log("hello from the middleware");
//   console.log(req.headers);
//   next();
// });
/////////
const Options = `*`;
app.options(Options, cors());

const defaultUrl = "/api/v1";

//import Router
const userRouter = require("./src/route/user.route");
const roleRouter = require("./src/route/role.route");

// use Router
app.use(defaultUrl, userRouter);
app.use(defaultUrl, roleRouter);

// now handle all other route for which does not exist
app.all("*", (req, res, next) => {
  //   res
  //     .status(404)
  //     .json({
  //       status: "failed",
  //       message: `can't able to find the ${req.originalUrl}`,
  //     });

  // const error = new Error(`can't able to find the ${req.originalUrl}`);
  // error.status = "failed";
  // error.statusCode = 404;
  // next(error);
  /*
    whatever we pass in next function express always take it as a error. 
    and it skip all the middleware in between and it directly goes to the 
    global error handled middleware.
    err.stack is used to give the error
    */
  //  after refactor
  next(new appError(`Can't able to find the ${req.originalUrl}`, 404));
});

// global error handeling
app.use(globalErrorHandler);

const server = app.listen(port, () => {
  console.log(`OTAA project running on port ${port} `);
});

/*
how to globally handled all unhandled promise rejection. whenever this error is occure it
emit an event. we can easily use that event and handled that error. check below-
*/

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  //let close the server
  server.close(() => {
    process.exit(1);
  });
});

/*
uncaught error
*/
process.on("uncaughtException", (err) => {
  console.log("Uncaught exception- shutting Down");
  //let close the server
  server.close(() => {
    process.exit(1);
  });
});
// console.log(xyz) // here xyz is not define so uncaught error will occure
