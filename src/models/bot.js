class Bot {
    constructor(id, name, status, currentOrderId, timeoutId){
        this.id = id; //the unique id for the bot
        this.name = name; //bot name or num
        this.status = status; //bot status (IDLE, WORKING)
        this.currentOrderId = currentOrderId; //the order id the bot is currently working on
        this.timeoutId = timeoutId //tracks the timeoutId in case it gets removed
    }
}

module.exports = { Bot };