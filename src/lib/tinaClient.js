import { EventEmitter } from "events";
EventEmitter.defaultMaxListeners = 30; // ⬅️ add this at the very top

import databaseClient from "../../tina/__generated__/databaseClient";

// Use a global variable that persists across hot reloads & lambda invocations
let cached = globalThis.__tinaClient;

if (!cached) {
  cached = { client: databaseClient };
  globalThis.__tinaClient = cached;
}

export const tinaClient = cached.client;
