export const getCreditScore = (data) => {
    const MAX_DEPOSIT = 5000;
    const MAX_REPAY = 1000;
    const MAX_LIQUIDATION = 2000;
    const PENALTY_PER_LIQUIDATION = 5;
  
    const totalDepositAmount = data.account.deposits.reduce((sum, deposit) => sum + parseFloat(deposit.amountUSD), 0);
    const totalBorrowAmount = data.account.borrows.reduce((sum, borrow) => sum + parseFloat(borrow.amountUSD), 0);
    const totalRepayAmount = data.account.repays.reduce((sum, repay) => sum + parseFloat(repay.amountUSD), 0);
    const totalLiquidationAmount = data.account.liquidations.reduce((sum, liquidation) => sum + parseFloat(liquidation.amountUSD), 0);
  
    const normalizedDepositScore = Math.min(totalDepositAmount / MAX_DEPOSIT, 1.0) * 100;
    const normalizedRepayScore = Math.min(totalRepayAmount / MAX_REPAY, 1.0) * 100;
    const normalizedLiquidationScore = Math.min(totalLiquidationAmount / MAX_LIQUIDATION, 1.0) * 100;
  
    let creditScore = 
        (0.3 * normalizedDepositScore) +
        (0.25 * normalizedRepayScore) +
        (0.15 * data.account.closedPositionCount) +
        (0.1 * data.account.borrowCount) -
        (0.2 * normalizedLiquidationScore);
  
    if (data.account.liquidateCount > 0) {
        const liquidationPenalty = data.account.liquidateCount * PENALTY_PER_LIQUIDATION;
        creditScore -= liquidationPenalty;
    }
  
    creditScore = Math.max(0, Math.min(creditScore, 1));
    creditScore *= 100;
    
    return creditScore;
  };
  