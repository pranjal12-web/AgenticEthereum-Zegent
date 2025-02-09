const {network} = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const Loan = await deploy("Loan", {
      from: deployer,
      log: true,
      // we need to wait if on a live network so we can verify properly
      waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`Loan Contract deployed at ${Loan.address}`)
}

module.exports.tags = ["all", "loan"]