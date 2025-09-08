# FeedMe McD

A small Node.js project where it manages orders. It has bots that process two types of orders; Normal and VIP. This project applies the priorty handling, using simple queue management.  

---
## 📑 Table of Contents
- [Getting Started](#getting-started)  
- [Project Structure](#project-structure)  
- [How the Project Works](#how-the-project-works)  
  - [Controllers](#controllers)  
  - [Models](#models)  
  - [Util](#util)  
  - [Main Index.js](#main-indexjs)  
- [Algorithms Used](#algorithms-used)  
  - [addQueue() Function](#addqueue-function)  
    - [Explanation](#explanation)  
    - [Why](#why)  
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
The goal is to organize the files with MVC architecture in mind.
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

### Controllers
> Processes the data I/O 

### Models
> Define the properties needed in each model

### Util
> Helps with managing the orders according to their type

### Main Index.js
> Utilizes Node.js Readline to accept input and show output. 
> Runs an interval to check for idle bots every 1s.
> User input is processed through switch-case.

## Algorithms Used

## `addQueue()` Function
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
            this.queue.unshift(order); // add to front of queue
        } else {
            this.queue.push(order); // add to end of queue
        }
        return this.queue;
}
```

#### Explanation
Takes in order data to arrange the order based on the order type. 

#### Why
This approach was chosen to:
- Correctly give priority to VIP orders.

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
