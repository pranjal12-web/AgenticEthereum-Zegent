import "./globals.css";
import { Quote,Button } from "@radix-ui/themes";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen">
    <div style={{zIndex:10,position:"relative"}} className="flex justify-end py-5">
      <Button color="orange" variant="soft" style={{borderRadius:"15px"}}>
        <Link href={'/loans/active'}>
          Get Started
        </Link>
      </Button>
    </div>
    <div className="flex-1 flex flex-col items-center mb-20 justify-center self-center">
      <span className="logo">Zegent</span>
      <Quote className="quote">A zero-knowledge proof based finance protocol integrated with autonomous AI agent </Quote>
    </div>
    </div>
  );
}
