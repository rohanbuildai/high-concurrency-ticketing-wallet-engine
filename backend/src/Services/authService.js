const bcrypt = require("bcrypt") ;

const userModel = require("../Models/userModel") ;

const registerUser = async ( { name , email , password } ) => {

    try {

        const normalizedEmail = email.trim().toLowerCase() ;

        if ( !name || !email || !password ) {
            throw new Error("Please fill all the fields") ;
        }

        const existingUser = await userModel.getUserByEmail({
            email : normalizedEmail
        })

        if ( existingUser ) {
            throw new Error("Email already exist") ;
        }

        const hashedPassword = await bcrypt.hash( password , 10 ) ;

        const newUser = await userModel.registerUser({
            name ,
            email : normalizedEmail ,
            password : hashedPassword
        })

        return newUser ;

    }catch(error) {
        console.error(error) ;

        throw error ;
    }
}

module.exports = {
    registerUser
}