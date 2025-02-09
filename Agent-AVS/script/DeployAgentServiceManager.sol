// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {AgentServiceManager} from "../src/AgentServiceManager.sol";
import {IDelegationManager} from "eigenlayer-contracts/src/contracts/interfaces/IDelegationManager.sol";
import {AVSDirectory} from "eigenlayer-contracts/src/contracts/core/AVSDirectory.sol";
import {ISignatureUtils} from "eigenlayer-contracts/src/contracts/interfaces/ISignatureUtils.sol";

contract DeployAgentServiceManager is Script {
    // Eigen Core Contracts
    address internal constant AVS_DIRECTORY =
        // 0xdc64a140aa3e981100a9beca4e685f962f0cf6c9;
        0xdAbdB3Cd346B7D5F5779b0B614EdE1CC9DcBA5b7;
    address internal constant DELEGATION_MANAGER =
        // 0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0;
        0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A;

    address internal deployer;
    address internal operator;
    AgentServiceManager serviceManager;

    // Setup
    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));
        operator = vm.rememberKey(vm.envUint("OPERATOR_PRIVATE_KEY"));
        vm.label(deployer, "Deployer");
        vm.label(operator, "Operator");
    }

    function run() public {
        // Deploy
        vm.startBroadcast(deployer);
        serviceManager = new AgentServiceManager(AVS_DIRECTORY);
        vm.stopBroadcast();

        // Register
        // Register as an operator
        IDelegationManager delegationManager = IDelegationManager(
            DELEGATION_MANAGER
        );

        IDelegationManager.OperatorDetails
            memory operatorDetails = IDelegationManager.OperatorDetails({
                __deprecated_earningsReceiver: operator,
                delegationApprover: address(0),
                stakerOptOutWindowBlocks: 0
            });

        vm.startBroadcast(operator);
        delegationManager.registerAsOperator(operatorDetails, "");
        vm.stopBroadcast();

        // Register operator to AVS
        AVSDirectory avsDirectory = AVSDirectory(AVS_DIRECTORY);
        bytes32 salt = keccak256(abi.encodePacked(block.timestamp, operator));
        uint256 expiry = block.timestamp + 1 hours;

        bytes32 operatorRegistrationDigestHash = avsDirectory
            .calculateOperatorAVSRegistrationDigestHash(
                operator,
                address(serviceManager),
                salt,
                expiry
            );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            vm.envUint("OPERATOR_PRIVATE_KEY"),
            operatorRegistrationDigestHash
        );
        bytes memory signature = abi.encodePacked(r, s, v);

        ISignatureUtils.SignatureWithSaltAndExpiry
            memory operatorSignature = ISignatureUtils
                .SignatureWithSaltAndExpiry({
                    signature: signature,
                    salt: salt,
                    expiry: expiry
                });

        vm.startBroadcast(operator);
        serviceManager.registerOperatorToAVS(operator, operatorSignature);
        vm.stopBroadcast();
    }
}


//anvil --chain-id 31337 --fork-url https://eth-mainnet.g.alchemy.com/v2/iSzxbriTSnXfa8-TZTsTDEzJqJhtJFPL
//forge script/DeployAgentServiceManager.sol --rpc-url http://localhost:8545 --broadcast