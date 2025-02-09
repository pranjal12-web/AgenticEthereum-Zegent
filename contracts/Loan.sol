pragma solidity ^0.8.28;

import "./Verifier.sol";
import "./SafeMath.sol";

contract Loan is Groth16Verifier {
    using SafeMath for uint256;

    uint256 public loanCounter;
    uint256 public borrowRequestCounter;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    struct LoanInfo {
        uint256 id;
        address lender_address;
        uint256 credit_score_threshold;
        string lending_token;
        uint256 lending_amount;
        string collateral_token;
        uint256 minimum_collateral_amount;
        string deadline_repaying;
        bool is_Active_Loan;
    }

    struct BorrowRequest {
        uint256 id;
        address borrow_address;
        uint256 loan_id;
        string collateral_token;
        uint256 collateral_amount_can_pay;
        string deadline_can_repay;
        bool has_passed_threshold;
        bool isApproved;
    }

    struct ApprovedBorrowRequest {
        uint256 loan_id;
        uint256 borrow_request_id;
        bool has_repayed;
    }

    mapping(uint256 => LoanInfo) public loans;
    mapping(uint256 => BorrowRequest) public borrowRequests;
    mapping(uint256 => ApprovedBorrowRequest) public approvedBorrowRequests;

    event LoanCreated(uint256 indexed loanId, address indexed lender);
    event BorrowRequestCreated(uint256 indexed requestId, address indexed borrower);
    event BorrowRequestApproved(uint256 indexed loanId, uint256 indexed requestId);
    event LoanRepaid(uint256 indexed loanId, uint256 indexed requestId);

    function createLoan(
        uint256 credit_score_threshold,
        string memory lending_token,
        uint256 lending_amount,
        string memory collateral_token,
        uint256 minimum_collateral_amount,
        string memory deadline_repaying
    ) external {
        loanCounter++;
        loans[loanCounter] = LoanInfo(
            loanCounter,
            msg.sender,
            credit_score_threshold,
            lending_token,
            lending_amount,
            collateral_token,
            minimum_collateral_amount,
            deadline_repaying,
            true
        );
        emit LoanCreated(loanCounter, msg.sender);
    }

    function verifyLoanThresholdPassed(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[6] calldata _pubSignals
    ) public view returns (bool) {
        return Groth16Verifier.verifyProof(_pA, _pB, _pC, _pubSignals);
    }

    function createBorrowRequest(
        uint256 loan_id,
        string memory collateral_token,
        uint256 collateral_amount_can_pay,
        string memory deadline_can_repay,
        bool has_passed_threshold
    ) external {
        require(loans[loan_id].is_Active_Loan, "Loan is not active");

        borrowRequestCounter++;
        borrowRequests[borrowRequestCounter] = BorrowRequest(
            borrowRequestCounter,
            msg.sender,
            loan_id,
            collateral_token,
            collateral_amount_can_pay,
            deadline_can_repay,
            has_passed_threshold,
            false
        );
        emit BorrowRequestCreated(borrowRequestCounter, msg.sender);
    }

    function approveBorrowRequest(uint256 requestId) external {
        BorrowRequest storage request = borrowRequests[requestId];
        LoanInfo storage loan = loans[request.loan_id];
        require(msg.sender == loan.lender_address, "Only lender can approve");
        require(request.has_passed_threshold, "Threshold not met");

        request.isApproved = true;
        approvedBorrowRequests[request.loan_id] = ApprovedBorrowRequest(
            request.loan_id,
            request.id,
            false
        );
        emit BorrowRequestApproved(request.loan_id, request.id);
    }

    function repayLoan(uint256 loan_id) external {
        ApprovedBorrowRequest storage approvedRequest = approvedBorrowRequests[loan_id];
        require(approvedRequest.borrow_request_id != 0, "Loan is not approved");
        require(!approvedRequest.has_repayed, "Loan already repaid");

        approvedRequest.has_repayed = true;
        emit LoanRepaid(loan_id, approvedRequest.borrow_request_id);
    }
}