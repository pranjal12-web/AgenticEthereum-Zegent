const active_loans = require("../../../constants/loans/active.js")
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { compressWalletAddress } from "@/utils/compress_address"
import { Button } from "@radix-ui/themes"
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link"

export default async function Page(){
    return(
        <div className="flex flex-wrap gap-5 mx-10 my-10">
            {active_loans.map(loan => (
                <Card className="w-[30%] hover:cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-white transition-all duration-300">
                <CardHeader>
                  <CardTitle>{`Loan Id : ${loan.id}`}</CardTitle>
                  <CardDescription>{`Lender: ${compressWalletAddress(loan.lender_address)}`}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex text-sm flex-col gap-2">
                    <p>{`Threshold Score Eligibility: ${loan.credit_score_threshold}`}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row justify-between">
                  <Button variant="outline" className="flex gap-2">
                    <Link href="../loan">See Details</Link>
                    <ArrowRightIcon/>
                  </Button>
                  <Button color={`${(loan.is_Active_Loan)?"cyan":"crimson"}`} variant="soft">
                  {(loan.is_Active_Loan==true)?"Not Assigned":"Assigned"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
    )
}