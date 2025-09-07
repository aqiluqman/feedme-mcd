const { Bot } = require('./models/bot');
const { Order } = require('./models/order');
const orderController = require('./controllers/orderController');
const orderQueue = require('./utils/OrderQueue');

const readLine = require('readline');
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log("Welcome to FeedMe-McD! Available commands:");
console.log("1. create-normal - Create a normal order");
console.log("2. create-vip - Create a VIP order");
rl.setPrompt('> ');
rl.prompt(); //start prompting the user 

rl.on('line', (input) => { //listen for user inputs
    input = input.trim();   
    switch(input){
        case 'create-normal':
            console.log("Creating normal order...");
            console.log(orderController.createOrder('NORMAL'))
            break;
        case 'create-vip':
            console.log("Creating VIP order...");
            console.log(orderController.createOrder('VIP'));
            break;
        case 'status':
            console.log("Fetching status...");
            console.log(orderController.getStatus());
            break;
        case 'add-bot':
            console.log("Adding a new bot...");
            console.log(orderController.addBot());
            console.log(orderController.processBot());
            break;
        case 'remove-bot':
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
