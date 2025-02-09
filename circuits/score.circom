pragma circom  2.0.0;
include "../node_modules/circomlib/circuits/comparators.circom";

template CompareCSandThreshold() {

    // Declaration of Input Signals.
    signal input MAX_DEPOSIT;
    signal input MAX_REPAY;
    signal input MAX_LIQUIDATION;
    signal input PENALTY_PER_LIQUIDATION;
    signal input totalDepositAmount;
    signal input totalBorrowAmount;
    signal input totalRepayAmount;
    signal input totalLiquidationAmount;
    signal input closedPositionCount;
    signal input borrowCount;
    signal input liquidateCount;
    signal input threshold_credit_score;
    
    //Output signal will be true if credit_score will be greater than equal to threshold
    signal output isThresholdPassed;

    //Variables defined 
    var normalizedDepositScore = ((totalDepositAmount/MAX_DEPOSIT)>1)?1:((totalDepositAmount/MAX_DEPOSIT));
    var normalizedRepayScore = ((totalRepayAmount/MAX_REPAY)>1)?1:((totalRepayAmount/MAX_REPAY));
    var x = (totalLiquidationAmount / MAX_LIQUIDATION);
    var normalizedLiquidationScore = (x > 1)?1 : (x);
    
    var one = (3*normalizedDepositScore)/10;
    var two = (25*(normalizedRepayScore))/100;
    var thr = (15*(closedPositionCount))/100;
    var four = (1*(borrowCount))/10;
    var five = (2*(normalizedLiquidationScore))/10;
    var partial_score = one + two + thr + four + five;
    
    var full_score = (((partial_score - ((liquidateCount>0)?(liquidateCount*PENALTY_PER_LIQUIDATION):0))*100));
    var credit_score = (full_score >100)?100:full_score;

    //Constraint 
    component greaterEqThan = GreaterEqThan(7);
    greaterEqThan.in[0] <-- credit_score;
    greaterEqThan.in[1] <-- threshold_credit_score;

    isThresholdPassed <-- greaterEqThan.out;
}

component main {public[MAX_DEPOSIT,MAX_LIQUIDATION,MAX_REPAY,PENALTY_PER_LIQUIDATION,threshold_credit_score]} = CompareCSandThreshold();