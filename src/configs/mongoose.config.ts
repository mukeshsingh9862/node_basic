import mongoose from 'mongoose';

const dbURI = process.env.MONGODB_URI;
const dbName = process.env.DBNAME;

mongoose
  .connect(dbURI as string, {
    dbName: dbName,
    // useNewUrlParser: true,
    // useUnifiedTopology: true
  })
  .then(() => {/* console.log("Mongodb connected to " + process.env.MONGODB_URI) */})
  .catch((err: any) => console.log(err));

mongoose.connection.on("connected", function () {
  console.info("connected to " + dbName);
});

// If the connection throws an error
mongoose.connection.on("error", function (err: any) {
  console.info("DB connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", function () {
  console.info("DB connection disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});