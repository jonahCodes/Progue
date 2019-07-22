const localStratgey = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


//load User model 
const User = require('../models/User');
module.exports = function(passport){
    passport.use(
        new localStratgey({
            usernameField:'email'
        },(email,password,done)=>{
                //match user
                User.findOne({email:email})
                .then(user=>{
                    if(!user){
                        return done(null, false,{message:"That email is not registered"});
                    }
                    //Match password 
                    bcrypt.compare(password,user.password,(err,ismatch)=>{
                        if(err)throw err;
                        if(ismatch){
                            return done(null,user);
                        }else{
                            return done(null,false,{message:"email or password doesn't match "});
                        }
                    });
                })
                .catch(err=>{console.log(err);});

                
        })
    );
    passport.serializeUser((user, done)=> {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done)=> {
        User.findById(id, (err, user)=>{
          done(err, user);
        });
      });
}