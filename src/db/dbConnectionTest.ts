import monk, { IMonkManager } from "monk";

export const initDatabase = (): Promise<IMonkManager> => {
  const connectionString = (process.env.MONGO_CONNECTION_STRING || "")
    .replace("mongodb://", "");
  if (!connectionString) {
    throw new Error("No credentials for mongodb connection.");
  }
  return monk(connectionString);
};
