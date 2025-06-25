const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const item1_name = "cold drink";
const item1_price = 50;

const item2_name = "coffee";
const item2_price = 150;

const item3_name = "Tea";
const item3_price = 20;

let total = 0;

console.log("Welcome to the Restaurant!");
console.log("Here is the menu:");
console.log("1. " + item1_name + " - ₹" + item1_price);
console.log("2. " + item2_name + " - ₹" + item2_price);
console.log("3. " + item3_name + " - ₹" + item3_price);
console.log("Type 'done' when you are finished ordering.");

function askOrder() {
  rl.question("Enter item number (1-3) or 'done': ", function (item) {
    if (item === "done") {
      console.log("Your total bill is: ₹" + total);
      console.log("Thank you! Visit again.");
      rl.close();
    } else {
      const itemNum = Number(item);
      rl.question("Enter quantity: ", function (qty) {
        const quantity = Number(qty);
        if (itemNum === 1) {
          total += item1_price * quantity;
          console.log("Added " + quantity + " x " + item1_name);
        } else if (itemNum === 2) {
          total += item2_price * quantity;
          console.log("Added " + quantity + " x " + item2_name);
        } else if (itemNum === 3) {
          total += item3_price * quantity;
          console.log("Added " + quantity + " x " + item3_name);
        } else {
          console.log("Invalid item number.");
        }
        askOrder();
      });
    }
  });
}

askOrder();
