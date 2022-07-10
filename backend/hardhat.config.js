require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path:".env"});



module.exports = {
  solidity: "0.8.9",
  networks: {
    "mumbai" : {
      url : process.env.ALCHEMY_API_KEY_URL,
      accounts : [process.env.MUMBAI_PRIVATE_KEY]
    }
  }
};
