// Hack for running cron job in intervals less than one mintute.
// Runs EXEC_COMMAND every INTERVAL_SECS seconds
// IMPORTANT: THIS FILE MUST EXIST AND BE RUN AT PROJECT ROOT

const { exec } = require("child_process");

const INTERVAL_SECS = 5; // every 5 seconds
const EXEC_COMMAND = `yarn jobs:email`;

const job = () => {
  // console.log("ping");
  exec(EXEC_COMMAND, function (err, stdout, stderr) {
    console.log(stdout);
    if (err) {
      console.log(err);
    }
    if (stderr) {
      console.log(stderr);
    }
  });
};

const buildIntervals = () => {
  const iterations = 60 / INTERVAL_SECS;
  console.log(`Job will have ${iterations} iterations per minute`);
  return () => {
    for (let i = 0; i < iterations; i++) {
      setTimeout(job, INTERVAL_SECS * (i + 1) * 1000);
    }
  };
};

const start = buildIntervals();

start();
