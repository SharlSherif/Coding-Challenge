const fs = require("fs");
const { events } = JSON.parse(fs.readFileSync("../data/events.json"));

const setOfUsers = new Set(); // filter out duplicates
const homePageVisitors = events.filter(
  (event) => event.name == "Visited home page"
);

let usersWhoPurchased = 0;
for (let event of homePageVisitors) {
  const userId = event.user_id;

  if (setOfUsers.has(userId)) continue;
  setOfUsers.add(userId);

  const purchaseEventsOfUser = events.find(
    (event) =>
      event.user_id == userId && event.name == "Purchased items in cart"
  );
  if (purchaseEventsOfUser) {
    usersWhoPurchased++;
  }
}
console.log(
  `What is the overall conversion rate of a user visiting the home page and then purchasing an item? ${Math.round(
    (usersWhoPurchased / homePageVisitors.length) * 100
  )}%`
);
