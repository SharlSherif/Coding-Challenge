const fs = require("fs");
const { events } = JSON.parse(fs.readFileSync("../data/events.json"));

const setOfUsers = new Set(); // filter out duplicates
const homePageVisitors = events.filter(
  (event) => event.name == "Visited home page"
);
const eventsFrequency = {};

for (let event of homePageVisitors) {
  const userId = event.user_id;

  if (setOfUsers.has(userId)) continue;
  setOfUsers.add(userId);

  for (let event of events) {
    if (event.user_id == userId && event.name !== "Visited home page") {
      // if the event already exists, increase its frequency (aka add 1 to it)
      if (eventsFrequency[event.name] !== undefined) {
        eventsFrequency[event.name] = eventsFrequency[event.name] + 1;
      } else {
        // if its a new event, add it to the frequency list and set the count to 1
        eventsFrequency[event.name] = 1;
      }
    }
  }
}
// just sorting the object by value
const sortedEventsFrequency = Object.fromEntries(
  Object.entries(eventsFrequency).sort(([, a], [, b]) => b - a)
);
// only display the top 3 events
const mostFrequentEvents = Object.keys(sortedEventsFrequency).slice(0,3).join(",")
console.log(`After a user visits the home page, what are the 3 most frequent things s/he would do next? --> ${mostFrequentEvents}`);
