import monk from "monk";

export const initDatabase = (): Promise<void> => {
  const connectionString = (process.env.MONGO_CONNECTION_STRING || "")
    .replace("mongodb://", "");
  if (!connectionString) {
    throw new Error("No credentials for mongodb connection.");
  }
  return monk(connectionString).then(connection => connection.close());
};
