const { Schema, model}  = require('mongose');

const paySchema = new Schema({
    buyOrder: String, 
    sessionId: String, 
    amount: Number, 
    // returnUrl: String,
});

module.exports = model('payModel', paySchema);