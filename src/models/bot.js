class Bot {
    constructor(id, name, status, currentOrderId){
        this.id = id; //the unique id for the bot
        this.name = name; //bot name or num
        this.status = status; //bot status (IDLE, WORKING)
        this.currentOrderId = currentOrderId; //the order id the bot is currently working on
    }
}

module.exports = { Bot };