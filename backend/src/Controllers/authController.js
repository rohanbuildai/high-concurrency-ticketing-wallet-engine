const authService = require("../Services/authService") ;

const registerUser = async ( req , res ) => {

    try {

        const { name , email , password } = req.body ;

        const newUser = await authService.registerUser({
            name ,
            email ,
            password
        })

        return res.status(200).json({
            success : true ,
            message : "User registered Successfully" ,
            data : newUser
        })

    }catch(error) {
         return res.status(500).json({
            success : false ,
            message : "Internal server error" ,
            error : error.message
         })
    }
}

module.exports = {
    registerUser
}