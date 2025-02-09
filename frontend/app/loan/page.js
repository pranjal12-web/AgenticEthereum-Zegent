"use client"
import { useState ,useEffect} from 'react';
import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { Button } from "@radix-ui/themes"
import { compressWalletAddress } from "@/utils/compress_address"
import { CheckIcon,Cross1Icon } from "@radix-ui/react-icons";
import { ethers } from "ethers";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link';

const borrow_requests_for_assigned_loan = require("../../constants/borrow_requests/loan_borrow_requests")

export default  function Page(){
  const [collateralToken, setCollateralToken] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [repaymentDeadline, setRepaymentDeadline] = useState('');
  const [color,setcolor] = useState('green');
  const [formError, setFormError] = useState('');
  const [borrowData,setborrowData] = useState(borrow_requests_for_assigned_loan);
  const [isSubmitted,setisSubmitted]=useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
    console.log(walletAddress)
  }, [walletAddress]);

  async function sendTransaction() {
    console.log("nmgbbkh")
  }

  const set_color = () =>{
    setTimeout(()=>{
      setcolor("green");
    },10000)
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!collateralToken || !collateralAmount || !repaymentDeadline) {
      setFormError('Please fill in all fields');
      return;
    }

    setFormError('');
    // Simulate form submission (e.g., call an API or handle logic here)
    console.log({
      collateralToken,
      collateralAmount,
      repaymentDeadline,
    });

    let borrow_data = borrowData;
    
    setTimeout(()=>{
       setisSubmitted(true)
       borrowData.borrow_requests.push(
        {
          id:55,
          borrow_address:"0x54651adfd19b33B5E4A5027bE9d6aE02C1C3284E",
          collateral_token:collateralToken,
          collateral_amount_can_pay:collateralAmount,
          deadline_can_repay:repaymentDeadline,
          isApproved:false,
        }
      )
      setborrowData(borrow_data);

    // Reset the form
    setCollateralToken('');
    setCollateralAmount('');
    setRepaymentDeadline('');
    }
       ,10000)
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };
    return(
        <div className="ml-5 flex w-screen">
           <Card className="w-[30%] h-[45vh] hover:cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-white transition-all duration-300">
                <CardHeader>
                  <CardTitle>{`Loan Id : ${borrow_requests_for_assigned_loan.loan_id}`}</CardTitle>
                  <CardDescription>{`Lender: ${compressWalletAddress(borrow_requests_for_assigned_loan.lender_address)}`}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-around ">
                  <div className="flex flex-col gap-3">
                    <p>Threshold Score Eligibility</p>
                    <p>Lending Amount</p>
                    <p>Min Collateral Amount</p>
                    <p>Repayment Deadline</p>
                  </div>
                  <div className="border-2 border-white rounded-lg shadow-[0_0_15px_#ffffff] bg-gray-900 text-white"></div>
                  <div className="flex flex-col gap-3 items-end">
                    <div>{borrow_requests_for_assigned_loan.credit_score_threshold}</div>
                    <div>{borrow_requests_for_assigned_loan.lending_amount} {borrow_requests_for_assigned_loan.lending_token}</div>
                    <div>{borrow_requests_for_assigned_loan.minimum_collateral_amount} {borrow_requests_for_assigned_loan.collateral_token}</div>
                    <div>{borrow_requests_for_assigned_loan.deadline_repaying}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row justify-center">
                   {(borrow_requests_for_assigned_loan.loan_status == "Not Assigned")?(
                    <Dialog >
                      <div className='flex mt-[20px] w-[100%] justify-between'>
                      <DialogTrigger asChild>
                      <Button variant="outline">Create Borrow Request</Button>
                    </DialogTrigger>
                      <Link href={"../../zkproof"}>
              <Button variant="soft" color="indigo" className="hover:bg-black-200 hover:text-white-200 hover:cursor-pointer">Generate Proof</Button>
              </Link>
                      </div>
                    <DialogContent className="fixed mt-[300px] ml-[800px] inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                      <DialogHeader className="flex flex-col items-center">
                        <DialogTitle className="text-2xl font-bold text-white">Create Borrow Request</DialogTitle>
                      </DialogHeader>

                      <form
                        onSubmit={handleSubmit}
                        className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full space-y-4"
                      >
                        <div>
                          <label htmlFor="collateralToken" className="block text-gray-700">Collateral Token</label>
                          <input
                            type="text"
                            id="collateralToken"
                            name="collateralToken"
                            value={collateralToken}
                            onChange={(e) => setCollateralToken(e.target.value)}
                            className="mt-2 text-white w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter token name (e.g., ETH)"
                          />
                        </div>
              
                        <div>
                          <label htmlFor="collateralAmount" className="block text-gray-700">Collateral Amount</label>
                          <input
                            type="number"
                            id="collateralAmount"
                            name="collateralAmount"
                            value={collateralAmount}
                            onChange={(e) => setCollateralAmount(e.target.value)}
                            className="text-white mt-2 w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter amount"
                          />
                        </div>
              
                        <div>
                          <label htmlFor="repaymentDeadline" className="block text-gray-700">Repayment Deadline</label>
                          <input
                            type="date"
                            id="repaymentDeadline"
                            name="repaymentDeadline"
                            value={repaymentDeadline}
                            onChange={(e) => setRepaymentDeadline(e.target.value)}
                            className="text-white mt-2 w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        {(color == 'blue')?(
                          <Link onClick={set_color} href="../../zkproof" className='mt-4'>
                          <div className='py-5 px-10 hover:cursor-pointer bg-blue-500 text-white items-center justify-center'>
                            Generate zkproof and validate for loan
                          </div>
                          </Link>
                        ):(
                          <div className='py-3 pl-2 bg-green-500 text-bold text-white items-center justify-center'>
                          Verification Successful ! Passed Eligibility Threshold
                        </div>
                        )}
              
                        {formError && <p className="text-red-500 text-sm">{formError}</p>}
              
                        <div className="flex justify-center mt-4">
                          {isSubmitted ? (
                             <div className='px-12 py-5 rounded-lg bg-blue-500 hover:cursor-pointer' >Request Submitted</div>
                          ):(
                            <Button variant='soft' className='px-12 py-5 rounded-lg hover:bg-blue-500 hover:cursor-pointer' color='violet'>Submit Request</Button>
                          )}
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                   ):(
                    <div className="px-10 py-3 rounded-lg bg-red-700 text-white">Loan Already Assigned</div>
                   )}
                </CardFooter>
            </Card>
            <div className="flex flex-1 flex-col px-10">
              <div className="mb-5 flex text-blue-400 justify-center text-4xl">BORROW REQUESTS</div>
              <div className="flex flex-col gap-5 ">
                {(borrow_requests_for_assigned_loan.borrow_requests).map((request =>(
                  <Card className="shadow-md transition-all duration-300 hover:shadow-blue-500/70 hover:shadow-2xl hover:cursor-pointer hover:scale-105">
                  <CardHeader>
                    <CardTitle>{`Request Id: ${request.id}`}</CardTitle>
                    <CardDescription>{`Requested By: ${compressWalletAddress(request.borrow_address)}`}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-around">
                  <div className="flex flex-col gap-3">
                    <p>Passed Threshold</p>
                    <p>Collateral Amount</p>
                    <p>Repayment Deadline Asked</p>
                  </div>
                  <div className="border-2 border-white rounded-lg shadow-[0_0_15px_#ffffff] bg-gray-900 text-white"></div>
                  <div className="flex flex-col gap-3 items-end">
                    <div>{(request.has_passed_threshold)?"Yes":"No"}</div>
                    <div>{`${request.collateral_amount_can_pay} ${request.collateral_token}`}</div>
                    <div>{request.deadline_can_repay}</div>
                  </div>
                  </CardContent>
                  <CardFooter >
                    {/* Add condition to check that wallet connected is same as the loan lender */}
                    {(borrow_requests_for_assigned_loan.loan_status == "Not Assigned"?(
                      <div className="flex justify-end">
                        {request.isApproved ?(
                            <Button color="cyan" variant="soft" className="flex gap-3">
                                <CheckIcon/>
                                <div>Approved</div>
                            </Button>
                        ):(
                            <Button color="crimson" variant="soft" className="flex gap-3">
                                <Cross1Icon/>
                                <div>Not Approved</div>
                            </Button>
                        )}
                      </div>
                    ):(
                      <div className="w-full flex justify-between">
                            <Button className="text-white-300 flex gap-5">
                                <CheckIcon/>
                                <div>Approve</div>
                            </Button>
                            <Button variant="soft" color="crimson" className="">
                                <Cross1Icon/>
                                <div>Reject</div>
                            </Button>
                      </div>
                    ))}
                  </CardFooter>
                   </Card>
                )))}
              </div>
            </div>
        </div>
    )
}