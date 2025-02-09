const paidLoans = require("../../../constants/borrows/paid.js")

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "@radix-ui/themes"
import Link from "next/link.js"
import {ArrowRightIcon} from "@radix-ui/react-icons"
import { compressWalletAddress } from "@/utils/compress_address.js"

export default async function Page(){
    return(
        <div className="mx-10 my-10 flex flex-wrap gap-5">
        {paidLoans.map(loan =>(
            <Card className="w-[30%] hover:cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-white transition-all duration-300">
                <CardHeader>
                  <CardTitle>{`Loan Id : ${loan.loan_id}`}</CardTitle>
                  <CardDescription>{`Borrower: ${compressWalletAddress(loan.borrow_address)}`}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                     <div className="flex">{`Amount to Pay: ${loan.collateral_amount_can_pay} ${loan.collateral_token}`}</div>
                     <div className="flex">{`Deadline: ${loan.deadline_can_repay}`}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row justify-between">
                  <Button variant="outline" className="flex gap-2">
                    <Link href="/loan/active">See Details</Link>
                    <ArrowRightIcon/>
                  </Button>
                  <Button color={`${(loan.status == "Paid")?"cyan":"crimson"}`} variant="soft">
                    {(loan.status=="Paid")?"Paid":"Not Paid"}
                  </Button>
                </CardFooter>
              </Card>
        ))}
        </div>
    )
}