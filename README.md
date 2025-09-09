# FeedMe McD

A small Node.js project where it manages orders. It has bots that process two types of orders; Normal and VIP. This project applies the priorty handling, using simple queue management built in JavaScript.  

---
## 📑 Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How the Project Works](#how-the-project-works)
  - [Models](#models)
  - [Controllers](#controllers)
  - [Util](#util)
  - [Main Index.js](#main-indexjs)
- [Algorithms Used](#algorithms-used)
  - [addQueue() Function in orderQueue.js](#addqueue-function-in-orderqueuejs)
  - [processBot(bot) Function in orderController.js](#processbotbot-function-in-ordercontrollerjs)
  - [removeBot() Function in orderController.js](#removebot-function-in-ordercontrollerjs)
- [Tech Stack](#tech-stack)

## Getting Started  

1. Clone repository 
   ```bash
   git clone https://github.com/aqiluqman/feedme-mcd.git
   ```
2. Navigate to project directory
   ```bash
   cd feedme-mcd
   ```
3. Start the project  
   ```bash
   npm start
   ```
4. Enter a desired commands, → **voila!** 🎉 The result is shown.  
---

## Project Structure
The goal is to organize the files with MVC architecture in mind for readability. 
```
├── src/
│ ├── controllers/
│ │ └── orderController.js # Main order and bot controller
| |
│ ├── models/
│ │ ├── bot.js # Cooking Bot model
│ │ └── order.js # Order model
| |
│ ├── utils/
│ │ └── orderQueue.js # Queue system (to manage VIP and Normal orders)
| |
│ └── index.js # Houses the CLI interface
│
├── LICENSE
├── package.json
└── README.md
```

## How the Project Works

### Models
> Define the properties in Order and Bot Model. 

### Controllers
> Handles order creation and assigning orders to bots

### Util
> Helps with managing the order queue according to their type

### Main Index.js
> Utilizes Node.js Readline to accept input and show output. 
> Runs an interval to check for idle bots every 1s.
> User input is processed through switch-case.

## Algorithms Used
This section highlights the core algorithms of the project. 

## `addQueue()` Function in orderQueue.js
```js
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
            let index = this.queue.map(o => o.orderType).lastIndexOf('VIP'); //list out order types and find the last index of VIP

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
```

#### Explanation
The algorithm checks for the order type first before it adds into the queue. This queue uses the FIFO (First-In, First-Out) concept. VIP orders are prioritized while normal orders are pushed normally. 

#### Why
The algorithm mainly uses existing JavaScript functions. 
_map()_ is used to extract the order types and create new array to find the last index of the VIP orders.
_lastIndexOf()_ is used to get the index of the last VIP order.

This approach was chosen to:
- Correctly give priority to VIP orders.
- New VIP orders will go at the top of the queue but after the oldest VIP orders.
- Normal orders will be inserted normally.

## `processBot(bot)` Function in orderController.js
```js
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
```

#### Explanation
The algorithm assigns the orders to the existing bots. The _processBot()_ function takes in Bot as its parameter. This enables the algorithm to check the bot status before assigning an order. Every bots will process an order in the queue and will take 10 seconds to process the order. Then, it will process the next order in the queue. The order queue and status will be updated in every step along with the bot status. 

There are 2 bot status:
1. IDLE
2. WORKING

Idle bots will be automatically assigned to pending orders.

#### Why
_setTimeout()_ is used to simulate the bots processing orders for 10 seconds. Each timeoutId would be stored in case a bot is removed during the 10s timeout frame.

This approach was chosen to:
- Assign one order each to idle bots.
- Next orders will be processed automatically.
- Bots will keep on working as long as there are pending orders.

## `removeBot()` Function in orderController.js
```js
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
```

#### Explanation
The algorithm is to handle a situation where a bot is removed and manage the ongoing orders assigned to the bot. This ensure that no orders go missing after a bot is removed. 

#### Why
Without this function, ongoing orders assigned to the removed bot will go missing. It uses the timeoutId stored in the Bot class in _processBot()_ to stop the current 10 seconds order process. Then, the order will be inserted back into the pending orders.

This approach was chosen to:
- Properly handle ongoing orders being processed by the removed bot.
- Ensure no orders go missing.

## Tech Stack
- Node.js (runtime)  
- JavaScript

_Note: This project is built for submission of FeedMe Assessment_

Thank you for your time!


## FeedMe Software Engineer Take Home Assignment
Below is a take home assignment before the interview of the position. You are required to
1. Understand the situation and use case. You may contact the interviewer for further clarification.
2. Fork this repo and implement the requirement with your most familiar tools.
3. Complete the requirement and perform your own testing.
4. Provide documentation for the any part that you think is needed.
5. Commit into your own github and share your repo with the interviewer.
6. Bring the source code and functioning prototype to the interview session.

### Situation
McDonald is transforming their business during COVID-19. They wish to build the automated cooking bots to reduce workforce and increase their efficiency. As one of the software engineer in the project. You task is to create an order controller which handle the order control flow. 

### User Story
As below is part of the user story:
1. As McDonald's normal customer, after I submitted my order, I wish to see my order flow into "PENDING" area. After the cooking bot process my order, I want to see it flow into to "COMPLETE" area.
2. As McDonald's VIP member, after I submitted my order, I want my order being process first before all order by normal customer.  However if there's existing order from VIP member, my order should queue behind his/her order.
3. As McDonald's manager, I want to increase or decrease number of cooking bot available in my restaurant. When I increase a bot, it should immediately process any pending order. When I decrease a bot, the processing order should remain un-process.
4. As McDonald bot, it can only pickup and process 1 order at a time, each order required 10 seconds to complete process.

### Requirements
1. When "New Normal Order" clicked, a new order should show up "PENDING" Area.
2. When "New VIP Order" clicked, a new order should show up in "PENDING" Area. It should place in-front of all existing "Normal" order but behind of all existing "VIP" order.
3. The order number should be unique and increasing.
4. When "+ Bot" clicked, a bot should be created and start processing the order inside "PENDING" area. after 10 seconds picking up the order, the order should move to "COMPLETE" area. Then the bot should start processing another order if there is any left in "PENDING" area.
5. If there is no more order in the "PENDING" area, the bot should become IDLE until a new order come in.
6. When "- Bot" clicked, the newest bot should be destroyed. If the bot is processing an order, it should also stop the process. The order now back to "PENDING" and ready to process by other bot.
7. No data persistance is needed for this prototype, you may perform all the process inside memory.

### Functioning Prototype
You may demostrate your final funtioning prototype with **one and only one** of the following method:
- CLI application
- UI application
- E2E test case

### Tips on completing this task
- Testing, testing and testing. Make sure the prototype is functioning and meeting all the requirements.
- Do not over engineering. Try to scope your working hour within 3 hours (1 hour per day). You may document all the optimization or technology concern that you think good to bring in the solution.
- Complete the implementation as clean as possible, clean code is a strong plus point, do not bring in all the fancy tech stuff.
