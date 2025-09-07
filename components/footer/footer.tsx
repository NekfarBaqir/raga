"use client";

import Logo from "@/components/footer/logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-6 px-4 md:px-8 mt-10">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="block md:flex items-center justify-between">
          <div className="block md:flex items-center justify-center pl-10 gap-5">
            <span className="text-2xl">RAGA</span>
            <hr className="flex md:hidden mt-4 mb-4" />
            <span className="hidden md:flex">|</span>
            <p>The Perfect Work Space For All People.</p>
          </div>
          <div className="block md:flex item-center justify-center pt-10 pr-20 gap-10">
            <div>
              <h2 className="text-xl mb-3">Company</h2>
              <div className="flex flex-col">
                <Link href="/about" className="mb-4">
                  About
                </Link>
                <Link href="/contact">Contact</Link>
              </div>
            </div>
            <div className="mt-10 md:mt-0">
              <h2 className="text-xl mb-3">Legal</h2>
              <div className="flex flex-col ">
                <Link href="/about" className="mb-4">
                  Terms of Service
                </Link>
                <Link href="/contact">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center md:mt-10 md:mb-10">
          <Link href="/">
            {" "}
            <Logo className="h-24 md:h-[300px] opacity-60" />
          </Link>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between mt-10 gap-4 mb-8 text-xs text-gray-500">
          <div className="text-base md:text-lg">
            © 2025. All rights reserved. Baqir Nekfer
          </div>
          <div className="flex items-center justify-center gap-3">
            <a
              href="mailto:shadcn@shadcnblocks.com"
              className="hover:text-white text-lg"
            >
              @ragaspace.com
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white">
              X
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white">
              ©
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
