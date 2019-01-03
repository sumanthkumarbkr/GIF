const mongoose= require('mongoose');
const bcrypt = require('bcryptjs')
const Schema=mongoose.Schema;

mongoose.Promises=global.Promise;

const retailerSchema=({
    retailer_name:String,
    retailer_password:String,
    retailer_mobilenumber:String,
    retailer_email:String,
    hotel_id:String
});

const Retailer   =   module.exports  =   mongoose.model("Retailer", retailerSchema);

module.exports.addRetailer = (retailer_name, retailer_password,retailer_mobilenumber,retailer_email,hotel_id ,callback)=>{
    bcrypt.genSalt(10, (err,salt)=>{
        bcrypt.hash(retailer_password, salt, (err,hash)=>{
            if(err){
                throw err
            }
            else{
                retailer_password=hash
                Retailer.create({"retailer_name":retailer_name, "retailer_password":retailer_password,"retailer_mobilenumber":retailer_mobilenumber,"retailer_email":retailer_email, "hotel_id":hotel_id},callback)
            }
        })
    })
}

module.exports.checkRetailer  =  (retailer_password, hash, callback)=>{
    bcrypt.compare(retailer_password, hash, (err, isMatch)=>{
        if(err){
            throw err
        }
        else{
            callback(null, isMatch)
        }
    })

    
}

module.exports.getUserByUsername=(retailer_name, callback)=>{
    Retailer.findOne({retailer_name:retailer_name}, callback);
}


module.exports.comparePassword=(retailer_password, hash, callback)=>{
    bcrypt.compare(retailer_password, hash, (error, isMatch)=>{
        if(error){
            throw error;
        }
        callback(null, isMatch);
    });
}

module.exports.updateRetailer=(retailer_name, updatedRetailer, callback)=>{
    bcrypt.genSalt(10, (err, salt)=>{
        console.log(updatedRetailer.retailer_password);
        bcrypt.hash(updatedRetailer.retailer_password, salt, (err,hash)=>{
            if(err){
                throw err;
            }
            updatedRetailer.retailer_password=hash;
            Retailer.findOne({retailer_name:retailer_name},(err, retailer)=>{
                // console.log(user);
                if(err){
                    throw err;
                }
                else{
                    id=retailer._id;
                    Retailer.findByIdAndUpdate(id, updatedRetailer, callback);
                }
            });
    });
    });
        };


        module.exports.removeRetailer  =  (retailer_name,callback)=>{
            Retailer.findOne({retailer_name:retailer_name},(err,retailer)=>{
                if(err){
                    throw err;
                }
                else{
                    id=retailer._id;
                    Retailer.update({"_id":id},callback)
                }
            })
        }