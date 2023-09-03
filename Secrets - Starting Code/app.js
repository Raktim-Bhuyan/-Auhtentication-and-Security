//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//TODO
mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "userDB",
  })
  .then(() => console.log("connected to MONGODB"))
  .catch((err) => console.log(err));

const userSchema = {
  email: String,
  password: String,
};
const User = mongoose.model("User", userSchema);
app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", async function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  // newUser
  //   .save()
  //   .then((d) => {
  //     console.log(d, "\nAdded Secret >>> redirecting to secret");
  //     return res.render("secrets");
  //   })
  //   .catch((e) => console.log(e));

  try {
    const data = await newUser.save();
    return res.render("secrets");
  } catch (e) {
    console.log(e);
  }
});
app.post("/login", async function(req,res){
  const username = req.body.username;
  const password = req.body.password;
   User.findOne({email:username})
   .then((foundUser)=>{
      if(foundUser.password === password){
        return res.render("secrets");
      }
    })
    .catch((err) =>console.log(err));
    
  
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
