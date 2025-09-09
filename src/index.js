const orderController = require('./controllers/orderController');

const readLine = require('readline');
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log("Welcome to FeedMe-McD! Available commands:");
console.log("1. [cn] - Create a Normal Order");
console.log("2. [cv] - Create a VIP order");
console.log("3. [st] - Check Order Status");
console.log("4. [add] - Add Bot");
console.log("5. [rm] - Remove Bot");
rl.setPrompt('> ');
rl.prompt(); //start prompting the user 

// Periodically check for idle bots every 100ms
setInterval(() => {
    orderController.checkIdleBots();
}, 100);

rl.on('line', (input) => { //listen for user inputs
    input = input.trim();   
    switch(input){
        case 'cn':
            console.log(orderController.createOrder('NORMAL'))
            break;
        case 'cv':
            console.log(orderController.createOrder('VIP'));
            break;
        case 'st':
            console.log("Fetching status...");
            orderController.getStatus();
            break;
        case 'add':
            console.log("Adding a new bot...");
            console.log(orderController.addBot());
            break;
        case 'rm':
            console.log("Removing a bot...");
            console.log(orderController.removeBot());
            break;
        case 'exit':
            console.log("Thank you for using FeedMe! Exiting...");
            rl.close();
            return;
        default:
            console.log("Invalid command. Please try again.");
    }
    rl.prompt(); //re-prompt the user after handling the switch case
}).on('close', () => {
    console.log("Session ended.");
    process.exit(0);
});
