//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.use(session({
  secret:"Our little secret",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());


//TODO
mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "userDB",
  })
  .then(() => console.log("connected to MONGODB"))
  .catch((err) => console.log(err));

  //global mongoose schema
const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
});
userSchema.plugin(passportLocalMongoose);

//userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields : ["password"]});
const User = mongoose.model("User", userSchema);

//3 lines
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});
app.get("/secrets",function(req,res){
  if(req.isAuthenticated()){
    res.render("secrets");
  }
  else{
    res.redirect("/login");
  }
})

app.post("/register", async function (req, res) {
  User.register({username:req.body.username},req.body.password)
  .then(
    ()=>{
      passport.authenticate("local")
      
        (req,res,function(){
          res.redirect("/secrets");
        })
      
    }
  )
  .catch(
    (err) =>{
      console.log(err);
      res.redirect("/register");
    }
  )
}
  
);
  

  // newUser
  //   .save()
  //   .then((d) => {
  //     console.log(d, "\nAdded Secret >>> redirecting to secret");
  //     return res.render("secrets");
  //   })
  //   .catch((e) => console.log(e));

  // try {
  //   const data = await newUser.save();
  //   return res.render("secrets");
  // } catch (e) {
  //   console.log(e);
  // }
app.get("/logout",function(req,res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})
app.post("/login", async function(req,res){
  const user = new User({
    username: req.body.username,
    password:req.body.password
  }
  );
    req.login(user,function(err){
      if(err){
        console.log(err);
        res.redirect("/register");
      }
      else{
        passport.authenticate("local")(req,res,function(){
          res.redirect("/secrets");
        });
      }
    });
    
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
