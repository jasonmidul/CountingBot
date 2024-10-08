const { CountingBot } = require("../Classes/CountingBot");

/**
 * @param {CountingBot} client
 */

async function antiCrash(client) {
  process.on("unhandledRejection", (reason, promise) => {
    console.log("[AntiCrash] | [UnhandledRejection_Logs] | [start]");
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
    console.log("[AntiCrash] | [UnhandledRejection_Logs] | [end]");
  });

  process.on("uncaughtException", (err, origin) => {
    console.log("[AntiCrash] | [UncaughtException_Logs] | [Start]");
    console.log(`Uncaught exception: ${err}\n` + `Exception origin: ${origin}`);
    console.log("[AntiCrash] | [UncaughtException_Logs] | [End]");
  });

  process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log("[AntiCrash] | [UncaughtExceptionMonitor_Logs] | [Start]");
    console.log(`Uncaught exception monitor: ${err}\n` + `Exception origin: ${origin}`);
    console.log("[AntiCrash] | [UncaughtExceptionMonitor_Logs] | [End]");
  });

  console.log("[INFO] AntiCrash Events Loaded!");
}

module.exports = { antiCrash };