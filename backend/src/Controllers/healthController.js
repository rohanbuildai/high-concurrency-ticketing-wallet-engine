const healthCheck = (req, res) => {

  try {

    res.status(200).json({
      success: true,
      message: "Your backend server is healthy",
    });

  } catch (error) {

    console.error(error) ;

    throw error ;
  }

};

module.exports = {
    healthCheck
}