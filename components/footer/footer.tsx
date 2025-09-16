"use client";

import Logo from "@/components/footer/logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" text-white py-10 px-6 md:px-12 mt-10">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className=" block md:flex justify-center items-center text-background md:pl-10 md:text-left space-y-3 md:space-y-0 md:space-x-5">
            <span className="text-2xl font-semibold text-primary">RAGA</span>
            <span className="text-black dark:text-white"> | </span>
            <p className=" text-sm md:text-base text-black dark:text-foreground">
            A launchpad for innovation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start md:items-start gap-10 pr-16">
            <div className="sm:text-left">
              <h2 className="text-lg font-medium mb-3 text-black dark:text-primary-foreground">
                Company
              </h2>
              <div className="flex flex-col gap-2 text-stone-700 dark:text-gray-300">
                <Link href="/about" className="hover:text-foreground">
                  About
                </Link>
                <Link href="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </div>
            </div>
            <div className="sm:text-left text-black dark:text-primary-foreground">
              <h2 className="text-lg font-medium mb-3">Legal</h2>
              <div className="flex flex-col gap-2 text-stone-700 dark:text-gray-300 ">
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center flex-col">
          <Link href="/" className="py-3 px-2">
            <Logo
              className="w-full  object-cover h-auto"
            />
          </Link>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-stone-700 dark:text-gray-400">
            <div className="md:pl-8 w-full text-center ">
              © 2025. All rights reserved.
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
