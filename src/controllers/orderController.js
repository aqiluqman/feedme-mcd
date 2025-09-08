const { Order } = require('../models/order');
const { Bot } = require('../models/bot');
const { OrderQueue } = require('../utils/OrderQueue');

class OrderController{
    constructor(){
        this.orders = []; //store current orders
        this.pending = [] //store pending orders
        this.ongoing = [] //store ongoing orders
        this.completed = [] //store completed orders
        this.nextOrderId = 1;
        this.orderQueue = new OrderQueue();
        this.bots = []; //store available bots
        this.nextBotId = 1;
    }

    createOrder(type){
        console.log("Create order of type: " + type);
        const order = new Order(this.nextOrderId, new Date(), 'PENDING', type);
        this.nextOrderId++;
        this.pending = this.orderQueue.addQueue(order); //add orders into pending first
        return "the order has been added to the queue. Pending orders: " + this.pending.length;
    }

    getStatus() {
        console.log("\n=================== Order Status ===================");

        //pending
        console.log("\nPending Orders:");
        console.table(this.pending.map(order => ({
            "Order ID": order.id,
            "Type": order.orderType,
            "Created At": order.createTime
        })));

        //ongoing
        console.log("\nOngoing Orders:");
        console.table(this.ongoing.map(order => ({
            "Order ID": order.id,
            "Type": order.orderType,
            "Created At": order.createTime
        })));

        //completed
        console.log("\nCompleted Orders:");
        console.table(this.completed.map(order => ({
            "Order ID": order.id,
            "Type": order.orderType,
            "Created At": order.createTime,
            "Completed At": order.completionTime
        })));

        //bots
        console.log("\nBots:");
        console.table(this.bots.map(bot => ({
            "Bot ID": bot.id,
            "Name": bot.name,
            "Status": bot.status,
            "Current Order ID": bot.currentOrderId || ""
        })));
    }

    addBot(){
        const bot = new Bot(this.nextBotId, `Bot-${this.nextBotId}`, 'IDLE', null);
        this.bots.push(bot);
        this.nextBotId++;
        this.processBot(bot);
        return `added ${bot.name}. No. of bots: ${this.bots.length}`;
    }
    
    //fn will be used to check for idle bots. 
    checkIdleBots(){
        if(this.bots){
            if(this.bots.length > 0){
                const idleBots = this.bots.filter(bot => bot.status === 'IDLE');
                if(idleBots.length > 0){
                    for(var bot of idleBots){
                        this.processBot(bot);
                    }
                }
            }
        }
    }

    //fn to assign orders to bots
    processBot(bot){
        if(this.pending.length === 0){
            bot.status = 'IDLE';
            return "No pending orders to process.";
        } else {
            const order = this.orderQueue.dequeue(); //find the next order in queue and remove from queue 
    
            bot.status = 'WORKING'; //change bot status to working
            bot.currentOrderId = order.id; //asign bot to the order removed from queue
            order.status = 'IN-PROGRESS';
            this.ongoing.push(order); //move order to ongoing
            this.pending = this.orderQueue.queue; //update pending orders

            bot.timeoutId = setTimeout(() => { //simulate 10s cooking
                order.status = 'COMPLETED';
                order.completionTime = new Date();
                this.ongoing = this.ongoing.filter(o => o.id !== order.id); //remove order from ongoing
                bot.currentOrderId = null;
                this.completed.push(order);
                this.processBot(bot); //assign next order after completing
            }, 10000);          
        }
    }

    removeBot(){
        if(this.bots.length === 0){
            return "No bots to remove.";
        } else {
            const removedBot = this.bots.pop(); //remove the newest bot

            //check if the bot is working on an order, if yes, stop the on-going order
            if(removedBot.status === 'WORKING' && removedBot.currentOrderId){
                clearTimeout(removedBot.timeoutId); //use timeoutId to stop the setTimeout earlier
                const order = this.ongoing.find(o => o.id === removedBot.currentOrderId); //find the order obj
                if(order) {
                    order.status = 'PENDING';
                    this.pending.push(order);
                    this.ongoing = this.ongoing.filter(o => o.id !== order.id); //update the ongoing list to remove the order
                }
            }
            return `Removed ${removedBot.name}. No. of bots: ${this.bots.length}`;
        }
    }
}

module.exports = new OrderController();

