const bcrypt = require("bcrypt") ;
const jwt = require("jsonwebtoken") ;
const crypto = require("crypto") ;
const pool = require("../config/db") ;

const userModel = require("../Models/userModel") ;
const refreshTokenModel = require("../Models/refreshTokenModel") ;

const registerUser = async ( { name , email , password } ) => {

    try {

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            throw new Error("Please fill all the fields");
        }

        const normalizedEmail = email.trim().toLowerCase() ;

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

        console.log("LOGIN USER:", existingUser);
        console.log("LOGIN USER ID:", existingUser.id);

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

const refreshAccessToken = async( { refreshToken } ) => {
    const client = await pool.connect() ;
    let decodedRefreshToken ;
    let transactionStarted = false ;


    try {

        decodedRefreshToken = jwt.verify( refreshToken , process.env.REFRESH_TOKEN_SECRET ) ;

        const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex") ;

        const storedToken = await refreshTokenModel.getRefreshTokenByHash({
            client ,
            refreshTokenHash
        })

        if ( !storedToken ) {
            throw new Error("Refresh Token not found") ;
        }

        if ( storedToken.revoked_at !== null ) {
            throw new Error("Refresh Token not found") ;
        }

        if ( storedToken.expires_at <= new Date() ) {
            throw new Error("Refresh Token has been expired");
        }

        if ( decodedRefreshToken.id !== storedToken.user_id ) {
            throw new Error("Invalid refresh token");
        }

        await client.query("BEGIN");
        transactionStarted = true ;

        const revokedToken = await refreshTokenModel.revokeRefreshToken({
            client ,
            tokenId : storedToken.id
        })

        if ( !revokedToken ) {
            throw new Error("Unable to revoke refresh token");
        }

        const newAccessToken = jwt.sign(
            {
                id : storedToken.user_id
            } ,
            process.env.ACCESS_TOKEN_SECRET ,
            {
                expiresIn : process.env.ACCESS_TOKEN_EXPIRES_IN
            }
        ) ;

        const newRefreshToken = jwt.sign(
            {
                id : storedToken.user_id
            } ,
            process.env.REFRESH_TOKEN_SECRET ,
            {
                expiresIn : process.env.REFRESH_TOKEN_EXPIRES_IN
            }
        ) ;

        const newRefreshTokenHash = crypto
        .createHash("sha256")
        .update(newRefreshToken)
        .digest("hex") ;

        const decodedNewRefreshToken = jwt.decode(newRefreshToken) ;

        const expiresAt = new Date(decodedNewRefreshToken.exp * 1000);

        const newStoredToken = await refreshTokenModel.createRefreshToken({
        client,
        userId: decodedRefreshToken.id,
        tokenHash: newRefreshTokenHash,
        expiresAt,
        });

        const updatedOldToken = await refreshTokenModel.setReplacedByToken({
            client,
            tokenId: storedToken.id,
            replacedByTokenId: newStoredToken.id
        });

        if ( !updatedOldToken ) {
            throw new Error("Unable to link refresh tokens");
        }

        await client.query("COMMIT") ;

        return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        };

    }catch(error) {

        if ( transactionStarted ) {
            await client.query("ROLLBACK") ;
        }

        console.error(error) ;

        throw error ;

    }finally {
        client.release() ;
    }
}

module.exports = {
    registerUser ,
    loginUser ,
    refreshAccessToken
}