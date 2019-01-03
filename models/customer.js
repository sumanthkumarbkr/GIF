const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');
const Schema=mongoose.Schema;
   

mongoose.Promises=global.Promise;


const UserSchema=({
    user_name:String,
    user_password:String,
    user_mobilenumber:String,
    user_email:String
});

const User   =   module.exports  =   mongoose.model("User", UserSchema);

module.exports.getUserByUsername=(user_name, callback)=>{
    User.findOne({user_name:user_name}, callback);
}

module.exports.addUser=(user_name,user_password,user_mobilenumber,user_email, callback)=>{
    bcrypt.genSalt(10,(err,Salt)=>{
        bcrypt.hash(user_password,Salt,(err,hash)=>{
            if(err)
            {
                throw err   
            }
            else
            {
                user_password=hash
                User.create({"user_name":user_name,"user_password":user_password,"user_mobilenumber":user_mobilenumber,"user_email":user_email },callback)
            }
        })
    })
}



module.exports.checkUser  =  (user_password, hash, callback)=>{
    bcrypt.compare(user_password, hash, (err, isMatch)=>{
        if(err){
            throw err
        }
        else{
            callback(null, isMatch)
        }
    })
}


module.exports.comparePassword=(user_password, hash, callback)=>{
    bcrypt.compare(user_password, hash, (err, isMatch)=>{
        if(err){
            throw err;
        }
        callback(null, isMatch);
    });
}



module.exports.updateUser=(user_name, updateUser, callback)=>{
    bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(updateUser.user_password, salt, (err,hash)=>{
                if(err)
                    {
                         throw err;
                    }
                 updateUser.user_password=hash;
                    User.findOneAndUpdate({"user_name":user_name}, {"user_name":updateUser.user_name, "user_password":updateUser.user_password, "user_mobilenumber":updateUser.user_mobilenumber, "user_email":updateUser.user_email}, callback);
                    });
            });
    }



 module.exports.removeUser=(user_name,callback)=>{
    User.findOne({"user_name":user_name},(err,user)=>{
        if(err)
        {
            throw err;
        }
        else
        {
         User.findOneAndRemove({"user_name":user.user_name},callback);   
        }
    })
}

module.exports.updatePassword=(user_name, temp_password, callback)=>{
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(temp_password, salt, (err,hash)=>{
            if(err)
            throw err;
            else
            User.findOneAndUpdate({"user_name":user_name}, {"user_password":hash},callback);
        })
})
}
