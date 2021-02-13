const fs = require("fs");
const { events } = JSON.parse(fs.readFileSync("../data/events.json"));

/*
 you may be wondering, why the heck do we need a hashing function?
 I just thought that we could give a unique hash to each path we find! that way we can keep track if one is found more than once.
 That might not be the best solution IMO, but it would definitely work just fine.
 */
const crypto = require("crypto");

const sha256 = (x) =>
  crypto.createHash("sha256").update(x, "utf8").digest("hex");
/*
I'm assuming here that all users who just visited the site would land on the homepage, 
so I won't be tracking the homepage events since it doesn't make sense as it would always be on the top of each frequent path

*/
const setOfUsers = new Set(); // filter out duplicates
const blogPostVisitors = events.filter(
  (event) => event.name == "Visited blog post"
);

const eventsFrequency = {};

for (let event of blogPostVisitors) {
  const userId = event.user_id;

  if (setOfUsers.has(userId)) continue;
  setOfUsers.add(userId);

  // check if that user has ever bought anything, if no, then ignore
  if (
    events.find(
      (event) =>
        event.user_id == userId && event.name == "Purchased items in cart"
    ) == undefined
  )
    continue;

  const restOfTheEvents = events
    .filter(
      (event) =>
        (event.user_id == userId) & (event.name !== "Visited blog post") &&
        event.name !== "Visited home page"
    )
    .sort((a, b) => a.timestamp - b.timestamp); // sort by timestamp (ascending order)

  const clearPathOfEvents = [];
  // sometimes the user would log an event AFTER they have already purchased an item, we wanna exclude that from the path
  for (let event of restOfTheEvents) {
    clearPathOfEvents.push(event);
    if (event.name == "Purchased items in cart") break;
  }
  // group all the names in current order into one string separated by commas
  // i.e A,B,C,Z
  const hashContent = clearPathOfEvents.map((event) => event.name).join(",");
  // feed that path to the hash function so it generates the same hash if this path were to be found again
  const uniqueHashOfEvents = sha256(hashContent);
  if (eventsFrequency[uniqueHashOfEvents] !== undefined) {
    // just increase a counter and set the entire path array so we can use later for displaying the most frequent path
    eventsFrequency[uniqueHashOfEvents] = {
      path: hashContent,
      count: eventsFrequency[uniqueHashOfEvents].count + 1,
    };
  } else {
    eventsFrequency[uniqueHashOfEvents] = {
      path: hashContent,
      count: 1,
    };
  }
}

const mostFrequentPath = Object.keys(eventsFrequency)
  .map((key) => eventsFrequency[key])
  .sort((a, b) => b.count - a.count)

console.log(`After a user visits a blog post, what is the most frequent path of events s/he will follow to purchase the items in his/her cart? ---> ${mostFrequentPath[0].path}`);
