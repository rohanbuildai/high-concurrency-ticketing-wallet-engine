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
         })
    }
}

const loginUser = async ( req , res ) => {

    try{

        const { email , password } = req.body ;

        const { existingUser , accessToken , refreshToken } = await authService.loginUser({
            email ,
            password
        })

        res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
        },
        });

    }catch(error) {
         return res.status(500).json({
            success : false ,
            message : "Internal server error" ,
         })
    }
}

const refreshAccessToken = async ( req , res ) => {

    try {

    console.log("COOKIES:", req.cookies);
    console.log("COOKIE HEADER:", req.headers.cookie);  
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    const tokens = await authService.refreshAccessToken({
      refreshToken,
    });

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
    });
   }catch(error) {

    console.error(error) ;
    console.log(error)

    return res.status(401).json({
      success: false,
      message: error.message,
    });
    

   }
}


module.exports = {
    registerUser ,
    loginUser ,
    refreshAccessToken
}