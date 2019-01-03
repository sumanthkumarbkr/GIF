const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;

mongoose.Promises = global.Promise;



const foodtypeSchema = ({
    food_type: String,
    food_time: String,
    hotel_id:String,

})



const Food_Type = module.exports = mongoose.model("Foodtype", foodtypeSchema);

module.exports.getUserById = (hotel_id, callback) => {
    Food_Type.find({ hotel_id: hotel_id },{
        "food_type":"food_type",
        "food_time":"food_time",
        "hotel_id":"hotel_id"

    }, callback);
}

module.exports.addFoodtype = (hotel_id, food_type,food_time,callback)=>{
     Food_Type.create({"hotel_id":hotel_id,
      "food_type":food_type,
      "food_time":food_time,
     },callback)
}