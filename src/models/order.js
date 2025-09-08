class Order {
    constructor(id, createTime, status, orderType, completionTime){
        this.id = id;
        this.createTime = createTime; //show createTime
        this.status = status; //order status (PENDING, IN-PROGRESS, COMPLETED)
        this.orderType = orderType; //NORMAL OR VIP
        this.completionTime = completionTime; //show completion
    }
} 

module.exports = { Order };