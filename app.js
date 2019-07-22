const express = require('express');
const bodyParser = require('body-parser');
const config=require('config');
const mongoose = require('mongoose');
const passport = require('passport');
const indexRoute = require('./routes/index');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
//passport config 
require('./config/passport')(passport);
//DB config
var db = config.get('URL');
var port = process.env.PORT || 3000;
mongoose.connect(db,{ useNewUrlParser: true, useCreateIndex:true });
const app = express();
//EJS
app.set('view engine','ejs');
app.use(expressLayouts);
//bodyParser
app.use(express.urlencoded({extended:false}));

// EXPRESS session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))
  //passport mIDDLE ware
app.use(passport.initialize());
app.use(passport.session());


//Flash
app.use(flash());
//global vars 
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.listen(port,()=>{
    console.log(`Server Started on Port ${port}`);
})
