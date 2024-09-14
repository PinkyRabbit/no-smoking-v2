export class RequestOptions {
  readonly connectionString = (process.env.MONGO_CONNECTION_STRING || "")
    .replace("mongodb://", "");
  readonly options = {
    loggerLevel: "error",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
}