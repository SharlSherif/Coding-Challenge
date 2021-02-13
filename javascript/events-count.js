const fs = require("fs");
const { events } = JSON.parse(fs.readFileSync("../data/events.json"));

console.log(`How many events are recorded? ${events.length} events`);
