const bcrypt = require("bcrypt") ;
const jwt = require("jsonwebtoken") ;
const crypto = require("crypto") ;

const userModel = require("../Models/userModel") ;
const refreshTokenModel = require("../Models/refreshTokenModel") ;

const registerUser = async ( { name , email , password } ) => {

    try {

        const normalizedEmail = email.trim().toLowerCase() ;

        if ( !name || !normalizedEmail || !password ) {
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

const loginUser = async ( { email , password } ) => {

    try {

        const normalizedEmail = email.trim().toLowerCase() ;

        if ( !normalizedEmail || !password ) {
            throw new Error("Please fill all the fields") ;
        }

        const existingUser = await userModel.getUserByEmail({
            email : normalizedEmail
        })

        if ( !existingUser ) {
            throw new Error("Invalid email or password") ;
        }

        const matchedPassword = await bcrypt.compare( password , existingUser.password_hash ) ;

        if ( !matchedPassword ) {
            throw new Error("Invalid email or password") ;
        }

        const accessToken = jwt.sign(
            {
                id : existingUser.id
            } ,
            process.env.ACCESS_TOKEN_SECRET ,
            {
                expiresIn : process.env.ACCESS_TOKEN_EXPIRES_IN
            }
        ) ;

        const refreshToken = jwt.sign(
            {
                id : existingUser.id
            } ,
            process.env.REFRESH_TOKEN_SECRET ,
            {
                expiresIn : process.env.REFRESH_TOKEN_EXPIRES_IN
            }
        ) ;

        const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex") ;

        const decodedRefreshToken = jwt.decode(refreshToken) ;

        const expiresAt = new Date(decodedRefreshToken.exp * 1000);

        await refreshTokenModel.createRefreshToken({
            userId : existingUser.id ,
            tokenHash : refreshTokenHash ,
            expiresAt
        }) ;

        return {
            existingUser ,
            refreshToken ,
            accessToken ,
        }

    }catch(error) {
        console.error(error) ;

        throw error ;
    }
}

module.exports = {
    registerUser ,
    loginUser
}