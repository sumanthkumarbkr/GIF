const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;

mongoose.Promises = global.Promise;
const foodsSchema = ({
    food_name: String,
    food_price: Number,
    hotel_id: String,
    food_type: String
});

const Food_Name = module.exports = mongoose.model("Foodname", foodsSchema);

module.exports.getUserById = (hotel_id, food_type, callback) => {
    Food_Name.find({ hotel_id: hotel_id, food_type: food_type }, {
        "food_type": "food_type",
        "food_price": "food_price",
        "hotel_id": "hotel_id",
        "food_name": "food_name"
    }, callback);
}



module.exports.addFoodname = (hotel_id, food_type, food_price, food_name, callback) => {
    Food_Name.create({
        "hotel_id": hotel_id,
        "food_type": food_type,
        "food_price": food_price,
        "food_name": food_name
    }, callback);
}


 

    module.exports.removeFood=(food_name,callback)=>{
        Food_Name.findOne({"food_name":food_name},(err,food)=>{
            if(err)
            {
                throw err;
            }
            else
            {
                Food_Name.findOneAndRemove({"food_name":food.food_name},callback);   
            }
        })
    }


module.exports.updateFoodname=(food_name, food_type,food_price,hotel_id, callback)=>{
    Food_Name.update({
        "hotel_id": hotel_id,
        "food_type": food_type,
        "food_price": food_price,
        "food_name": food_name
    }, callback);
    
        };
