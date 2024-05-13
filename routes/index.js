var express = require('express');
var router = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

/* GET home page. */
router.get('/', isLoggedIn ,function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use(cookieParser());

const secret = "secret";


router.get("/loginPage", (req, res) => {
  res.render("login")
})


router.get("/signUp", (req, res) => {
  res.render("signUp")
})

// APIS

router.post("/signUp", async (req, res) => {
  let { username, name, email, password } = req.body;

  let emailCondition = await userModel.findOne({ email });

  if (emailCondition) {
    res.json({
      success: false,
      msg: "Email Is Already Exist !"
    })
  }
  else {

    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {

        let user = await userModel.create({
          username,
          name,
          email,
          password: hash
        })

        res.redirect("/loginPage")

      })
    })

  }

});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email });

  console.log(user)

  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {

      if (result === true) {

        let token = jwt.sign({ email: user.email, userID: user._id }, secret);
        res.cookie("token", token);

        return res.json({
          success: true,
          userID: user._id
        })
      }
      else {
        return res.json({
          success: false,
          msg: "Password is wrong !"
        })
      }

    });
  }
  else {
    return res.json({
      success: false,
      msg: "Email Is Wrong !"
    })
  }

})

router.post("/logout",(req,res)=>{
  if(req.cookies.token){
    res.clearCookie("token");
    res.redirect("/loginPage")
  }
  else{
    res.json({
      success: false,
      msg: "You are already not logged in !"
    })
  }
})

function isLoggedIn(req, res, next) {
  if (req.cookies.token) {
    jwt.verify(req.cookies.token, secret, function (err, decoded) {
      if (err) {
        return res.status(401).send('Unauthorized');
      } else {
        next();
      }
    });
  } else {
    return res.redirect("/loginPage")
  }
}






module.exports = router;
