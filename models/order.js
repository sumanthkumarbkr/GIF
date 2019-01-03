const mongoose=require("mongoose");
const Schema=mongoose.Schema;


mongoose.Promise=global.Promise;
const foodSchema=({
    food_name:String
})

const orderSchema=({
    order_id:String,
    hotel_id:String,
    food_names:[foodSchema],
    user_name:String,
    food_time:Date,
    order_status:String,
    payment_type:String,
    final_cost:Number

})
const order= module.exports=mongoose.model("order",orderSchema);

module.exports.addorder=(order, callback)=>{
    order.save(callback);
}
