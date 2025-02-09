"use client"
import Image from "next/image"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import { Button } from "@radix-ui/themes";
import logo from "../../public/logo.webp"
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";

export default function ActiveLoansLayout({ children }) {
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* MetaMask is installed */
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
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
    return(
        <div>
        <div className="w-[90vw] mx-5 my-5 px-2 py-2 flex flex-row items-center justify-between text-white border border-gray-600 shadow-lg shadow-gray-700">
            <div className="flex items-center gap-5">
              <Image src={logo} alt="logo" className="w-[30px] h-[30px]"></Image>
              <div className="font-bold">Zegent</div>
            </div>
           <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Loans</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-col px-2 py-2 w-[200px] gap-5 hover:cursor-pointer">
                   <Link href="../loans/all" className="px-2 py-2 rounded-md font-bold text-lg hover:bg-white hover:text-black"><NavigationMenuLink >All</NavigationMenuLink></Link>
                   <Link href="../loans/active" className="px-2 py-2 rounded-md font-bold text-lg hover:bg-white hover:text-black"><NavigationMenuLink >Active</NavigationMenuLink></Link>
                   <Link href="../loans/assigned" className="px-2 py-2 rounded-md font-bold text-lg hover:bg-white hover:text-black"><NavigationMenuLink>Assigned</NavigationMenuLink></Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Borrowings</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-col px-2 py-2 w-[200px] gap-5 hover:cursor-pointer">
                   <Link href="../../borrows/paid" className="px-2 py-2 rounded-md font-bold text-lg hover:bg-white hover:text-black"><NavigationMenuLink >Paid</NavigationMenuLink></Link>
                   <Link href="../../borrows/pending" className="px-2 py-2 rounded-md font-bold text-lg hover:bg-white hover:text-black"><NavigationMenuLink >Pending</NavigationMenuLink></Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <Link href={"../../zkproof"}>
              <Button variant="soft" color="indigo" className="hover:bg-black-200 hover:text-white-200 hover:cursor-pointer">Generate Proof</Button>
              </Link>
              <Link href={"../../ai_chatbot"}>
               <Button variant="soft" color="indigo" className="hover:bg-black-200 hover:text-white-200 hover:cursor-pointer">TRADING BOT</Button>
              </Link>
               {/* <Button className="hover:bg-blue-600 hover:cursor-pointer" onClick={connectWallet}>Connect Wallet</Button> */}
               <Button
              className="hover:bg-blue-600 hover:cursor-pointer"
              onClick={connectWallet}
            >
              <span className="is-link has-text-weight-bold">
                {walletAddress && walletAddress.length > 0
                  ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
                  : "Connect Wallet"}
              </span>
            </Button>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <section>{children}</section>
        </div>
    )
}