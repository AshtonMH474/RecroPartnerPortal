import databaseClient from "../../tina/__generated__/databaseClient";

let client;

export function getTinaClient() {
  if (!client) {
    client = databaseClient;
  }
  return client;
}