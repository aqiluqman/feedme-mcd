const { Order } = require('../models/order.js');

/**
 * util to manage order queues
 */
class OrderQueue {
    constructor() {
        this.queue = [];
    }
    
    addQueue(orderData) {
        //manages all the orders that come in. Prioritize VIP orders.
        const order = new Order(
            orderData.id,
            orderData.createTime,
            orderData.status,
            orderData.orderType,
            orderData.completionTime
        );

        if(order.orderType === 'VIP') {
            this.queue.unshift(order); // add to front of queue
        } else {
            this.queue.push(order); // add to end of queue
        }
        return this.queue;
    }

    dequeue() {
        return this.queue.shift(); //take out order from the Q
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

module.exports = { OrderQueue };