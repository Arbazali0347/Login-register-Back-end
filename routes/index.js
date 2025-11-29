var express = require('express');
// User model
var router = express.Router();
const UserModel = require("./users");
const passport = require("passport");
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(UserModel.authenticate()));
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home');
});

router.get('/profile', isLoggedIn , async function (req, res, next) {
  const user = await UserModel.findOne({username: req.session.passport.user})
  console.log("You Name is" + user)
  res.render('profile', {footer: true, user})
});

router.get('/user-details-page', isLoggedIn, function (req, res, next) {
  res.render('user-details');
});

router.post('/user-details', isLoggedIn ,async function (req, res, next) {
  const {First, Last, Discription} = req.body;
  user = await UserModel.findOneAndUpdate({username: req.session.passport.user},{
    firstname: First,
    lastname: Last,
    description: Discription
  },{new: true});
  res.redirect("/profile")
});

router.get('/register-page' ,function (req, res, next) {
  res.render("register");
});

router.post('/register', function (req, res, next) {
  const { username, password, email } = req.body;
  const userdata = new UserModel({
    username: username,
    email: email
  });
  UserModel.register(userdata, password)
    .then(function (registeredUser){
      req.session.userId = registeredUser._id;
      passport.authenticate("local")(req, res, function () {
        res.redirect("/user-details-page");
      });
    })
    .catch(function (err) {
      console.log("Registration Error:", err);
      res.status(400).send("Registration failed: " + err.message);
    });
    
});

router.get('/login-page', function (req, res, next) {
  if(req.isAuthenticated()){
    res.redirect("/profile")
  }
  res.render('login', { title: 'Express' });
});

router.post('/login', passport.authenticate('local', {
  // successRedirect: "/succe",
  failureRedirect: "/login-page"
}), function(req, res, next){
  res.redirect("/profile");
});

router.get('/logout', function(req, res, next){
  req.logout(function(err){
    if (err) { return next(err)}
    res.redirect("/")
  })
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/")
}
module.exports = router;