function getSignUp(req, res){
    res.render('customer/auth/signup');
}

function getLogin(req, res){
    res.render('customer/auth/login');
}


module.exports = {
    getSignUp: getSignUp,
    getLogin: getLogin
}