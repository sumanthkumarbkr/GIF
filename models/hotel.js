const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;

mongoose.Promises = global.Promise;




const hotelSchema = ({
    hotel_id: String,
    hotel_name: String,
    hotel_mobilenumber: String,
    hotel_email: String,
    hotel_address: String,
    hotel_taluk: String,
    
   
});

const Hotel = module.exports = mongoose.model("Hotel", hotelSchema);


module.exports.getUserById = (hotel_id, callback) => {
    Hotel.findOne({ hotel_id: hotel_id }, callback);
}

module.exports.getUserByTaluk = (hotel_taluk, callback) => {
    Hotel.find({ hotel_taluk: hotel_taluk }, {
        "hotel_taluk": "hotel_taluk",
        "hotel_name": "hotel_name",
        "hotel_id": "hotel_id",
        "hotel_mobilenumber": "hotel_mobilenumber",
        "hotel_email": "hotel_email",
        "hotel_address": "hotel_address",
        // "hotel_menu": "hotel_menu",
        // "hotel_img": "hotel_img"
    }, callback);
}

// module.exports.updateHotel = (hotel_id, food_type, food_time, food_name, food_price, callback) => {
//     Hotel.findOne({ hotel_id: hotel_id }, (err, hotel) => {
//         if (err) {
//             throw err;
//         }
//         else {
//             id = hotel._id;
//             Hotel.update({ "_id": id }, {
//                 "$push": {
//                     "hotel_menu": [{

//                         "food_names": [
//                             {
//                                 "food_name": food_name,
//                                 "food_price": food_price
//                             }
//                         ]
//                         ,
//                         "food_type": food_type,
//                         "food_time": food_time
//                     }]
//                 }
//             }, callback)

//         }
//     });

// }






