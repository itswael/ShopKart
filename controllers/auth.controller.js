const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const userValidDetails = require("../util/validation");
const sessionFlash = require('../util/session-flash');

function getSignUp(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if(!sessionData){
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      fullName: '',
      street: '',
      postal: '',
      city: ''
    }
  }

  res.render("customer/auth/signup", {inputData: sessionData});
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    fullName: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city    
  }
  if (
    !(userValidDetails.userDetailsAreValid)(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) || !userValidDetails.emailIsconfirmEmail(
        req.body.email,
        req.body['confirm-email']
    )
  ) {
    sessionFlash.flashDataToSession(req, {
      errorMessage: 'please check you input',
      ...enteredData

    }, function(){
      res.redirect("/signup");
    })
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    const existAlready = await user.existsAlready();

    if(existAlready){
      sessionFlash.flashDataToSession(req, {
        errorMessage: 'email already exist, please login',
        ...enteredData
      }, function(){
        res.redirect('/signup');
      })
      return;
    }

    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/login");
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if(!sessionData){
    sessionData = {
      email: '',
      password: '',
    }
  }
  res.render("customer/auth/login", {inputData: sessionData});
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  enteredData = {
    email: req.body.email,
    password: req.body.password
  }
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, {
      errorMessage: 'email doesnt exist, try signup',
      ...enteredData
    }, function(){
      res.redirect("/login");
    })
    
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, {
      errorMessage: 'username or password is incorrect',
      ...enteredData
    }, function(){
      res.redirect("/login");
    })
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignUp: getSignUp,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
