const bcrypt = require('bcryptjs');
const db = require('../data/database');

class User{
    constructor(email, password, fullname, street, postal, city){
        this.email = email;
        this.password = password;
        this.fullname = fullname;
        this.address = {
            street: street,
            postal: postal,
            city: city
        }
    }

    getUserWithSameEmail(){
        return db.getDb().collection('users').findOne({email: this.email});
    }

    async existsAlready(){
        const exsistingUser = await this.getUserWithSameEmail();
        if(exsistingUser){
            return true;
        }
        return false;
    }

   async signup(){
        const hashedPassword = await bcrypt.hash(this.password, 12);
        await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            fullname: this.fullname,
            address: this.address
        });
    }

    hasMatchingPassword(hashedPassword){
        return bcrypt.compare(this.password, hashedPassword);
    }
}

module.exports = User;