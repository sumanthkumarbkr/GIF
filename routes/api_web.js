const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Retailer = require('../models/retailer')
const validator = require('validator')
const rn = require('random-number')
const Hotel = require('../models/hotel')
const Food_Type = require('../models/foodtype')
const Food_Name = require('../models/foodname')
const User = require('../models/customer')
const order = require('../models/order')
const fs = require('fs');
const fileUpload = require('express-fileupload');
var options = {
    min: 100000,
    max: 999999,
    integer: true
};


router.post('/retailer-register', (req, res, next) => {
    // let img_file_1=req.files.img_1;
    // let img_file_2=req.files.img_2;
    // let img_file_3=req.files.img_3;
    retailer_name = req.body.retailer_name;
    retailer_password = req.body.retailer_password;
    retailer_mobilenumber = req.body.retailer_mobilenumber;
    retailer_email = req.body.retailer_email;
    hotel_name = req.body.hotel_name;
    hotel_mobilenumber = req.body.hotel_mobilenumber;
    hotel_email = req.body.hotel_email;
    hotel_id = hotel_name.substr(0, 3).toUpperCase() + rn(options);
    // console.log(retailer_name, retailer_email, retailer_mobilenumber, hotel_id);
    // img_file_1.mv('./public/uploads/product'+'_'+hotel_id+'_1.jpg', (err)=>{
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         console.log('success');
    //     }
    // });
    //     img_file_2.mv('./public/uploads/product'+'_'+hotel_id+'_2.jpg', (err)=>{
    //         if(err){
    //             console.log(err);
    //         }
    //         else{
    //             console.log('success');
    //         }
    //     });

    //         img_file_3.mv('./public/uploads/product'+'_'+hotel_id+'_3.jpg', (err)=>{
    //             if(err){
    //                 console.log(err);
    //             }
    //             else{
    //                 console.log('success');
    //             }
    //         });
    if (validator.isInt(retailer_mobilenumber) && retailer_mobilenumber.length == 10 && validator.isInt(hotel_mobilenumber) && hotel_mobilenumber.length == 10) {
        if (validator.isEmail(retailer_email) && validator.isEmail(hotel_email)) {
            Retailer.getUserByUsername(retailer_name, (err, retailer) => {
                if (err) {
                    throw err;
                }
                if (retailer) {
                    res.json({ success: false, msg: 'Username exists' })
                }
                else {
                    Retailer.addRetailer(retailer_name, retailer_password, retailer_mobilenumber, retailer_email, hotel_id, (err, retailer) => {
                        if (err) {
                            res.json({ success: false, msg: "Error occured" })
                        }
                        else {
                            temp_hotel = new Hotel({
                                hotel_id: hotel_id,
                                hotel_name: req.body.hotel_name,
                                hotel_mobilenumber: req.body.hotel_mobilenumber,
                                hotel_email: req.body.hotel_email,
                                hotel_address: req.body.hotel_address,
                                hotel_taluk: req.body.hotel_taluk,
                                // hotel_img:{img_1:'https://radiant-ocean-37495.herokuapp.com/uploads/product_'+req.body.hotel_id+'_1.jpg',
                                // img_2:'https://radiant-ocean-37495.herokuapp.com/uploads/product_'+req.body.hotel_id+'_2.jpg',
                                // img_3:'https://radiant-ocean-37495.herokuapp.com/uploads/product_'+req.body.hotel_id+'_3.jpg'},

                                hotel_menu: []
                            });
                            Hotel.create(temp_hotel, (err, hotel) => {
                                if (err)
                                    throw err
                                else
                                    res.json({ success: true, msg: "Retailer Registered Successfully" })
                            })

                        }
                    })
                }
            })
        }
        else {
            res.json({ success: false, msg: "Email format does not satisfy" })
        }
    }
    else {
        res.json({ success: false, msg: "Mobile format does not satisfy" })
    }
});



router.post('/login-retailer', (req, res, next) => {
    retailer_name = req.body.retailer_name
    retailer_password = req.body.retailer_password
    Retailer.getUserByUsername(retailer_name, (err, retailer) => {
        if (err) {
            throw err;
        }
        if (!retailer) {
            res.json({ success: false, msg: 'User not found' });
        }
        Retailer.comparePassword(retailer_password, retailer.retailer_password, (err, isMatch) => {
            if (err) {
                throw err;
            }
            if (isMatch) {
                const token = jwt.sign(retailer.toJSON(), retailer.retailer_name, {
                    expiresIn: 604800 //1 week
                });
                res.json({ success: true, token: "JWT" + token, retailer: { retailer_name: retailer.retailer_name }, hotel_id: { hotel_id: retailer.hotel_id } });
            }
            else {
                res.json({ success: false, msg: 'Wrong Password' });
            }
        });
    });
});

router.post('/show-retailer', (req, res, next) => {
    retailer_name = req.body.retailer_name;

    Retailer.getUserByUsername(retailer_name, (err, retailer) => {
        console.log(retailer);
        if (err) {
            res.json({ success: false, msg: "Retailer could not be find" });
        }
        else {

            res.json(retailer);
        }
    })
});

router.post('/retailer-update', (req, res, next) => {
    let updatedRetailer = new Retailer({
        "retailer_name": req.body.retailer_name,
        "retailer_password": req.body.retailer_password,
        "retailer_email": req.body.retailer_email,
        "retailer_mobilenumber": req.body.retailer_mobilenumber
    });

    Retailer.updateRetailer(updatedRetailer.retailer_name, updatedRetailer, (err, retailer) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "User Updation Failed" });
        }
        else {
            res.json({ success: true, msg: "User Updation Successful" });
        }
    });
});


router.post('/retailer-remove', (req, res, next) => {
    retailer_name = req.body.retailer_name;
    Retailer.removeRetailer(retailer_name, (err, retailer) => {
        if (err) {
            res.json({ success: false, msg: "Retailer is not found" });
        }
        else {
            res.json({ success: true, msg: "Removed Retailer Successful" });
        }
    })
})


router.post('/show-Hotel-details', (req, res, next) => {
    hotel_id = req.body.hotel_id;
    Hotel.getUserById(hotel_id, (err, hotel) => {
        console.log(hotel);
        if (err) {
            res.json({ success: false, msg: "Retailer could not be find" });
        }
        else {

            res.json(hotel);
        }
    })
});


router.post('/user-show-Hotels', (req, res, next) => {
    hotel_taluk = req.body.hotel_taluk;
    Hotel.getUserByTaluk(hotel_taluk, (err, hotel) => {
        console.log(hotel);
        if (err) {
            res.json({ success: false, msg: "No hotel found" });
        }
        else {

            res.json(hotel);
        }
    })
});




router.post('/customer-register', (req, res) => {
    user_name = req.body.user_name;
    user_password = req.body.user_password;
    user_mobilenumber = req.body.user_mobilenumber;
    user_email = req.body.user_email;
    if (validator.isInt(user_mobilenumber) && user_mobilenumber.length == 10) {
        if (validator.isEmail(user_email)) {
            User.find({ "user_name": user_name }, (err, user) => {
                if (err)
                    throw err;
                if (!user)
                    res.json({ success: false, msg: "username exists" })
                else {

                    User.addUser(user_name, user_password, user_mobilenumber, user_email, (err, user) => {
                        if (err) {
                            res.json({ success: false, msg: "Error occured" })
                        }
                        else {
                            res.json({ success: true, msg: "customer Registered Successfully" })
                        }
                    })
                }
            })
        }
        else {
            res.json({ success: false, msg: "Email format does not satisfy" })
        }
    }
    else {
        res.json({ success: false, msg: "Mobile format does not satisfy" })
    }
});


router.post('/customer-login', (req, res, next) => {
    user_name = req.body.user_name
    user_password = req.body.user_password
    User.findOne({ user_name: user_name }, (err, user) => {
        if (err) {
            throw err
        }
        if (!user) {
            res.json({ success: false, msg: "Invalid Credentials" })
        }
        else {
            User.checkUser(user_password, user.user_password, (err, isMatch) => {
                if (err) {
                    throw err
                }
                if (isMatch) {
                    res.json({ success: true, msg: "Login successful" })
                }
                else {
                    res.json({ success: false, msg: "Invalid Credentials" })
                }
            })

        }
    })
})




router.post('/show-customer', (req, res, next) => {
    user_name = req.body.user_name;
    User.getUserByUsername(user_name, (err, user) => {
        console.log(user);
        if (err) {
            res.json({ success: false, msg: "customer could not be find" });
        }
        else {

            res.json(user);
        }
    })
});


router.post('/customer-update', (req, res, next) => {
    let updatedUser = new User({
        "user_name": req.body.user_name,
        "user_password": req.body.user_password,
        "user_email": req.body.user_email,
        "user_mobilenumber": req.body.user_mobilenumber
    });

    User.updateUser(updatedUser.user_name, updatedUser, (err, user) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "User Updation Failed" });
        }
        else {
            res.json({ success: true, msg: "User Updation Successful" });
        }
    });
});


router.post('/customer-remove', (req, res, next) => {
    user_name = req.body.user_name;
    User.removeUser(user_name, (err, user) => {
        if (err) {
            res.json({ success: false, msg: "Username is not found" });
        }
        else {
            res.json({ success: true, msg: "Removed user Successful" });
        }
    })
})


router.get('/forgot-password', (req, res, next) => {
    res.render('forgot-password');
});

router.post('/forgot-password', (req, res, next) => {
    user_name = req.body.user_name;
    var server = email.server.connect({
        user: "getitfast12345@gmail.com",
        password: "gif12345",
        host: "smtp.gmail.com",
        ssl: true
    });
    User.findOne({ "user_name": user_name }, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            res.send('User does not exist');
        }
        else {
            tempPassword = password_generator(12, false)
            User.updatePassword(user_name, tempPassword, (err, user) => {
                if (err) {
                    console.log('Error! Could not update password');
                }
                if (user) {
                    console.log('Password Updated for' + user.user_name);
                }
            });
            User.findOne({ "user_name": user_name }, (err, user) => {
                if (err)
                    throw err;
                else {
                    server.send({
                        text: "Hey, please log-in using the password:" + tempPassword,
                        from: "getitfast12345@gmail.com",
                        to: user.user_email,
                        cc: "",
                        subject: "Forgot Password"
                    }, function (err, message) {
                        //  console.log(err || message); 
                        if (err) {
                            res.send(err);
                        }
                        else {
                            res.send("success")
                        }

                    });
                }
            })

        }
    });


});



router.post('/add-order', (req, res, next) => {
    order_id = "ORD" + rn(options)
    hotel_id = req.body.hotel_id
    let total_cost = 0
    names_food = []
    for (i = 0; i < req.body.food_names.length; i++) {
        total_cost = total_cost + req.body.food_names[i].food_price;
        tax_cost = total_cost * 0.05;
        txn_cost = total_cost * 0.10;
        final_cost = tax_cost + txn_cost + total_cost;
        names_food.push({ "food_name": req.body.food_names[i].food_name })
    }
    neworder = new order({
        order_id: order_id,
        hotel_id: hotel_id,
        user_name: req.body.user_name,
        food_names: names_food,
        food_time: new Date,
        order_status: "Pending",
        final_cost: final_cost
    });
    order.addorder(neworder, (err, order) => {
        if (err) {
            res.json({ success: false, msg: "order cannot placed" });
        }
        else {
            res.json(order)
        }
    })
})




router.post('/add-hotel-foodtype', (req, res, next) => {
    hotel_id = req.body.hotel_id;
    food_type = req.body.food_type;
    food_time = req.body.food_time;
    Food_Type.findOne({ "food_type": food_type }, (err, foodtype) => {
        if (err)
            throw err;
        if (foodtype)
            res.json({ success: false, msg: "foodtype exists" })
        else {
            Food_Type.addFoodtype(hotel_id, food_type, food_time, (err, foodtype) => {
                if (err)
                    throw err
                else
                    res.json({ success: true, msg: "Type Registered Successfully" })
            })
        }
    })
})


router.post('/add-hotel-foodname', (req, res, next) => {
    hotel_id = req.body.hotel_id;
    food_name = req.body.food_name;
    food_price = req.body.food_price;
    food_type = req.body.food_type;
    Food_Name.findOne({ "food_name": food_name }, (err, foodname) => {
        if (err)
            throw err;
        if (foodname)
            res.json({ success: false, msg: "food_name exists" })
        else {
            Food_Name.addFoodname(hotel_id, food_type, food_price, food_name, (err, foodname) => {
                if (err)
                    throw err
                else
                    res.json({ success: true, msg: "Name Registered Successfully" })
            })
        }
    })
})



router.post('/show-Hotel-foodtype-details', (req, res, next) => {
    hotel_id = req.body.hotel_id;
    Food_Type.getUserById(hotel_id, (err, foodtype) => {
        console.log(foodtype);
        if (err) {
            res.json({ success: false, msg: "Retailer could not be find" });
        }
        else {

            res.json(foodtype);
        }
    })
});

router.post('/show-Hotel-foodnames-details', (req, res, next) => {
    food_type = req.body.food_type
    hotel_id = req.body.hotel_id;
    Food_Name.getUserById(hotel_id,food_type, (err, foodname) => {
        console.log(foodname);
        if (err) {
            res.json({ success: false, msg: "Retailer could not be find" });
        }
        else {

            res.json(foodname);
        }
    })
});



router.post('/foodname-update', (req, res, next) => {
   
        food_name= req.body.food_name;
        food_price=req.body.food_price;
        food_type=req.body.food_type;
        hotel_id=req.body.hotel_id;
       
 
    Food_Name.updateFoodname(food_name, food_type,food_price,hotel_id, (err, name) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Food Updation Failed" });
        }
        else {
            res.json({ success: true, msg: "Food Updation Successful" });
        }
    });
});






router.post('/food-remove', (req, res, next) => {
    food_name = req.body.food_name;
    Food_Name.removeFood(food_name, (err, food) => {
        if (err) {
            res.json({ success: false, msg: "food_name is not found" });
        }
        else {
            res.json({ success: true, msg: "Removed food_name Successful" });
        }
    })
})

module.exports = router;