const { Order } = require('../models/order');
const { Bot } = require('../models/bot');
const { OrderQueue } = require('../utils/OrderQueue');

class OrderController{
    constructor(){
        this.orders = []; //store current orders
        this.pending = [] //store pending orders
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

    getStatus(){
        return {
            pending: this.pending.length,
            completed: this.completed.length,
            bots: this.bots.length
        };
    }

    addBot(){
        const bot = new Bot(this.nextBotId, `Bot-${this.nextBotId}`, 'IDLE', null);
        this.bots.push(bot);
        this.nextBotId++;
        return `Added ${bot.name}. Total bots: ${this.bots.length}`;
    }

    async processBot(){
        if(this.pending.length === 0){
            return "No pending orders to process.";
        } else if (this.bots.length > 0){
            const bot = this.bots.findOne(b => b.status === 'IDLE'); //find the latest idle bot
            if(bot){
                const order = this.orderQueue.dequeue(); //find the next order in queue
                if(!order) {
                    return "No orders in the queue.";
                }
                bot.status = 'WORKING'; //change bot status to working
                bot.currentOrderId = order.id;
                order.status = 'IN-PROGRESS';

                await new Promise(resolve => setTimeout(resolve, 10000)); //simulate 10s order processing time

                order.status = 'COMPLETED';
                bot.status = 'IDLE';
                bot.currentOrderId = null;
                this.completed.push(order);
                this.pending = this.orderQueue.queue;
            }
        }
    }

    removeBot(){
        if(this.bots.length === 0){
            return "No bots to remove.";
        } else {
            const removedBot = this.bots.pop();
            //check if the bot is working on an order
            if(removedBot.status === 'WORKING' && removedBot.currentOrderId){
                const order = this.orders.find(o => o.id === removedBot.currentOrderId);
                if(order) {
                    order.status = 'PENDING';
                    this.pending.push(order);
                }
            }
            return `Removed ${removedBot.name}. Total bots: ${this.bots.length}`;
        }
    }
}

module.exports = new OrderController();

