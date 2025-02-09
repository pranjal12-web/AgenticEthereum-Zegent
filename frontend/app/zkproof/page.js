"use client";

// Import useState from 'react' library
import { useState } from "react";
import { Button } from "@radix-ui/themes"
import "./style.css"
const proof = require("../../constants/prover/proof");
const public_signals = require("../../constants/prover/public")
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
 } from "@/components/ui/card"
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from "@/components/ui/dialog"
 import {CheckCircledIcon} from "@radix-ui/react-icons"
import Link from "next/link";


export default function Page(){

   const [isLoading,setisLoading] = useState(false);
   const setLoader = ()=>{
      console.log(",rmngnjreglne")
      setisLoading(true)
      setTimeout(()=>(setisLoading(false)),10000)
   }
  
    return(
        <div className="flex flex-col flex-1 gap-5 items-center mt-10 pl-10 mb-[200px]">
           <div className="flex gap-3 items-center rounded-lg border-white-500">
              <div className="px-6 py-3 bg-green-500 rounded-lg">
                Connected Wallet
              </div>
              <div>
              <div className="bg-blue-500/50 px-6 py-3 rounded-lg">
              0x00d5201c4def4d1a199c63e07eac53f43252a0ea'
              </div>
              </div>
           </div>
           <div className="flex gap-5">
           <Card className="w-[600px] py-5 hover:cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-white transition-all duration-300">
                <CardHeader>
                  <CardTitle>PROOF</CardTitle>
                  <CardDescription>Private signals to be sent to verifier for verifying</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3 ">
                    <div className="flex justify-between items-center">
                       <p>pi_a : </p>
                       <div className="w-[400px]">{proof[0].pi_a}</div>
                    </div>
                    <div className="flex justify-between items-center">
                       <p>pi_b : </p>
                       <div className="w-[400px]">{proof[0].pi_b}</div>
                    </div>
                    <div className="flex justify-between items-center">
                       <p>pi_c : </p>
                       <div className="w-[400px]">{proof[0].pi_c}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="w-[600px] py-5 hover:cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-white transition-all duration-300">
               <CardHeader>
                  <CardTitle>
                     PUBLIC SIGNALS
                  </CardTitle>
                  <CardDescription>
                     Public Signals to be sent to verify proof
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  {public_signals.map(signal =>(
                     <div>{signal}</div>
                  ))}
               </CardContent>
              </Card>
           </div>
           <Dialog>
             <DialogTrigger>
               <Button onClick={(setLoader)} variant="soft" color="orange"> VERIFY PROOF FOR LOAN THRESHOLD</Button>
             </DialogTrigger>
             <DialogContent className="bg-black/60 backdrop-blur-md flex flex-col items-center justify-center">
               <DialogHeader>
                  {isLoading == true ? (
                   <div className="flex flex-col ">
                     <DialogTitle>Loading</DialogTitle>
                     <div className='loader '></div>
                   </div>
                  ):
                  (
                     <div>
                        <DialogTitle className='text-white'>Verification Successful 🎉 ! Eligible For Loan Id:23</DialogTitle>
                 <DialogDescription>
                  <div className="flex justify-center">
                  <CheckCircledIcon className="w-[200px] h-[200px] text-green-500" />
                  </div>
                 <DialogTitle className=" mt-2 text-2xl font-bold">
                     <div className="flex justify-space-between">
                        <div>Success</div>
                        <Link href="../../loan">
                        <Button className="px-5 py-3" variant="soft" color="cyan">GO BACK</Button>
                        </Link>
                     </div>
                  </DialogTitle>
                 </DialogDescription>
                     </div>
                  )
                  }
               </DialogHeader>
             </DialogContent>
            </Dialog>
        </div>
    )
}