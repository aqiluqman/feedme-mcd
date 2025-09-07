const { Order } = require('../models/order.js');

class OrderQueue {
    constructor() {
        this.queue = [];
    }

    addQueue(orderData) {
        const order = new Order(orderData);
        if(order.orderType === 'VIP') {
            this.queue.unshift(order); //add to front of queue
            
        } else {
            this.queue.push(order); //add to end of queue
        }
        return this.queue;
    }

    dequeue() {
        return this.queue.shift();
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

module.exports = { OrderQueue };