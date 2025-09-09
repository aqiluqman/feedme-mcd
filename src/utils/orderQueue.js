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
            let index = this.queue.map(o => o.orderType).lastIndexOf('VIP');

            if(index === -1){ //if no vip then add to the front
                this.queue.unshift(order);
            } else {
                this.queue.splice(index + 1, 0, order) //add behind the exisitng vip order
            }
        } else {
            this.queue.push(order); // add to end of queue
        }
        return this.queue;
    }

    dequeue() {
        return this.queue.shift(); //take out order from the Q
    }
}

module.exports = { OrderQueue };