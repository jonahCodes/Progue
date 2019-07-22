const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport=require('passport')

router.get("/register", function(req, res) {
  res.render("register");
});

router.get("/login", function(req, res) {
  res.render("login");
});

//register handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  //check password match
  if (password !== password2) {
    errors.push({ msg: "Password doesnt match" });
  }
  //check pass length
  if (password.length < 6) {
    errors.push({ msg: "password should be atleast 6 characters" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //Validation pass
    User.findOne({ email: email }).then(user => {
      if (user) {
        //User exists
        errors.push({ msg: "Email is already InUsed" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        //ES6 PLANIN TEXT
        const newUser = new User({
          name,
          email,
          password
        });
        //hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err)throw err;
              //setPASSWORD to HASh
              newUser.password = hash;
              //save user
              newUser.save()
              .then(user=>{
                  req.flash('success_msg',"you are now registered and can login")
                  res.redirect('/users/login');
              })
              .catch(err=>{console.log(err)})
          })
        );
      }
    });
  }
});
//login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/' || next(),
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout',(req,res)=>{
  req.logout();
  req.flash('success_msg',"you are logged out");
  res.redirect('/users/login');
})

module.exports = router;
