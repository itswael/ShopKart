function isEmpty(value){
    return !value || value.trim() === '';
}

function userCredentialsAreValid(email, password){
    return (!isEmpty(email) &&
    email.includes('@') &&
    email.includes('.') &&
    password &&
    password.trim().length >= 6);
}

function emailIsconfirmEmail(email, confirmEmail){
    return email === confirmEmail;
}

function userDetailsAreValid(email, password, name, street, postal, city){
     return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(name) &&
    !isEmpty(street) &&
    !isEmpty(postal) && 
    !isEmpty(city) &&
    postal.trim().length === 6);
}

module.exports = {
    userDetailsAreValid: userDetailsAreValid,
    emailIsconfirmEmail: emailIsconfirmEmail
}
