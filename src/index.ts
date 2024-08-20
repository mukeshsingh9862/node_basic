import express, { Application } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
// import swaggerUi from "swagger-ui-express";
import { serve, setup } from "swagger-ui-express";
import { bootstrapAdmin } from "./utils/bootstrap.util";
import Routes from "./routes";
import cors from "cors";
import dotenv from "dotenv";
import cron from 'node-cron'
import path from 'path'
import socketIo from "./sockets/indexSocket"
// const newrelic = require('newrelic');
let swaggerDoc = require('../public/swagger/swagger.json')

dotenv.config({ path: path.join(__dirname, '..', '.env') })
// connect to mongodb
require("./configs/mongoose.config");

const PORT = process.env.PORT || 8000;

const app: Application = express();
var server = require('http').createServer(app);

const io = socketIo(require('socket.io')(server, {
  cors: {
    origin: '*'
  }
}));
app.set('io', io);


// instrument express after the agent has been loaded
// newrelic.instrumentLoadedModule(
//   'express',    // the module's name, as a string
//   app // the module instance
// );

app.use(function (req, res, next) {
  // res.setHeader("Access-Control-Allow-Origin", "*.abc.io");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", 1);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authtoken, x-forwarded-for, x-key"
  );
  next();
});


// Middleware to block /postman requests
if (process.env.MODE != "local") {
  app.use((req, res, next) => {
    const userAgent = req.get('User-Agent');
    if (userAgent && userAgent.includes('Postman')) {
      return res.status(403).send('Access Forbidden');
    }
    next();
  });
}

// // Middleware to block /swagger requests
if (process.env.MODE != "local") {
  app.use((req, res, next) => {
    if (req.url.includes('/swagger')) {
      return res.status(403).send('Access Forbidden');
    }
    next();
  });
}

const corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-key', 'authtoken', 'x-forwarded-for', 'Accept', 'Origin', 'X-Requested-With'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));




console.log(process.env.MODE, 'process.env.MODE>>>>>>>>')

// if (process.env.MODE == "local") {
app.use(
  '/swagger',
  serve,
  setup(swaggerDoc)
)
// }


// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/api", Routes);
bootstrapAdmin(() => {
  console.log("Bootstraping finished!");
});

server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  console.log("swagger link ", `localhost:${PORT}/swagger`);
});


