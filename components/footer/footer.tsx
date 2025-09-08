"use client";

import Logo from "@/components/footer/logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1B1E22] text-white py-10 px-6 md:px-12 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="text-center text-background md:text-left space-y-3">
            <span className="text-2xl font-semibold text-background">RAGA</span>
            <p className=" text-sm md:text-base text-background dark:text-foreground">
              The Perfect Work Space For All People.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center md:items-start gap-10">
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-medium mb-3 text-background">
                Company
              </h2>
              <div className="flex flex-col gap-2 text-gray-300">
                <Link href="/about" className="hover:text-background">
                  About
                </Link>
                <Link href="/contact" className="hover:text-background">
                  Contact
                </Link>
              </div>
            </div>
            <div className="text-center sm:text-left text-background">
              <h2 className="text-lg font-medium mb-3">Legal</h2>
              <div className="flex flex-col gap-2 text-gray-300">
                <Link href="/terms" className="hover:text-background">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="hover:text-background">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center my-10">
          <Link href="/">
            <Logo
              className="
                h-20 w-auto      
                md:h-52 md:w-auto
                lg:h-[230px]  
                xl:h-[300px] xl:w-auto 
                opacity-70
              "
              theme="dark"
            />
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-gray-400">
          <div>© 2025. All rights reserved. Baqir Nekfer</div>
          <div className="flex items-center gap-3">
            <a
              href="mailto:shadcn@shadcnblocks.com"
              className="hover:text-white"
            >
              @ragaspace.com
            </a>
            <span className="hidden sm:block">|</span>
            <a href="#" className="hover:text-white">
              X
            </a>
            <span className="hidden sm:block">|</span>
            <a href="#" className="hover:text-white">
              ©
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
