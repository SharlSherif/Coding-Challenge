const fs = require("fs");
const { events } = JSON.parse(fs.readFileSync("../data/events.json"));
const { users } = JSON.parse(fs.readFileSync("../data/users.json"));

const setOfUsers = new Set(); // filter out duplicates
let totalAge = 0;
const homePageVisitors = events.filter(
  (event) => event.name == "Visited home page"
);
for (let event of homePageVisitors) {
  const userId = event.user_id;
  // ignore any user that we've already pushed to the set
  // since it means that it was already accounted for
  if (setOfUsers.has(userId)) continue;
  setOfUsers.add(userId);

  const userAge = users[userId].age;
  totalAge += userAge;
}

const averageAge = Math.round(totalAge / homePageVisitors.length);
console.log(
  `What is the average age of all distinct users who visited the home page? around ${averageAge}`
);
