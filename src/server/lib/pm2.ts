import { exec } from "child_process";
import { PM2Process } from "../../common/types/pm2";
import { Action } from "../../common/types/general";

let lastApps: PM2Process[] = [];
let lastError: any | null = null;

async function loop() {
  exec("pm2 jlist", (err, stdout) => {
    lastError = err;

    if (!err) {
      try {
        lastApps = JSON.parse(stdout);
      } catch (err) {
        lastError = err;
      }
    }

    if (lastError) {
      console.error(lastError);
      return;
    }
  });

  setTimeout(loop, 1000);
}

loop();

export function getApps() {
  if (lastError) {
    throw lastError;
  }

  return lastApps;
}

export function manageApp(id: string, action: Action): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(`pm2 ${action} ${id}`, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
