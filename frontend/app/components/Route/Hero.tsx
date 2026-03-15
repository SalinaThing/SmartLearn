"use client";

import React, { FC } from "react";
import Image from "next/image";
import { BiSearch } from "react-icons/bi";
import Link from "next/link";

import avatar from "../../../public/assets/Hero.jpg";
import heroIcon1 from "../../../public/assets/heroicon1.jpg";
import heroIcon2 from "../../../public/assets/heroicon2.jpg";
import heroIcon3 from "../../../public/assets/heroicon3.jpg";

type Props = {};

const Hero: FC<Props> = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-between px-6 1000px:px-12 relative overflow-hidden">

      {/* Left Section - Smaller Banner */}
      <div className="w-[40%] flex items-center justify-center relative">
        <Image
          src={avatar}
          alt="Banner Image"
          width={380}
          height={380}
          priority
          className="object-contain max-w-[350px] w-full h-auto"
        />
        
      </div>

      {/* Right Section */}
      <div className="w-[60%] flex flex-col">

        <h2 className="dark:text-white text-gray-800 
          text-[32px] 1100px:text-[50px] 
          font-[600] font-Josefin leading-tight">
          Improve Your Online Learning Experience Better Instantly
        </h2>

        <p className="dark:text-gray-300 text-gray-600 
          font-Josefin font-[600] 
          text-[18px] mt-6">
          We have 40k+ Online courses & 500k+ Online registered students.
          Find your desired courses from them.
        </p>

      {/* Search Box */}
        <div className="mt-8 relative w-full max-w-[600px]">
       <input
            type="search"
            placeholder="Search Courses..."
            className="w-full h-[55px] 
            border border-gray-300 
            dark:border-none dark:bg-[#575757] 
            dark:placeholder:text-[#ffffffcc] 
            rounded-md pl-5 pr-14 
            outline-none 
            text-gray-700 dark:text-white 
            text-[18px] font-[500] font-Josefin shadow-sm"
            />

        {/* Search Button inside the box */}
        <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 
            h-[40px] w-[40px] 
            bg-[#39c1f3] hover:bg-[#2ea9d6] 
            rounded-md 
            flex items-center justify-center 
            transition"
        >
            <BiSearch size={22} className="text-white" />
        </button>
        </div>

        {/* Student Icons */}
        <div className="mt-8 flex items-center">

          <Image
            src={heroIcon1}
            alt="Student 1"
            width={40}
            height={40}
            className="rounded-full"
          />

          <Image
            src={heroIcon2}
            alt="Student 2"
            width={40}
            height={40}
            className="rounded-full ml-[-15px]"
          />

          <Image
            src={heroIcon3}
            alt="Student 3"
            width={40}
            height={40}
            className="rounded-full ml-[-15px]"
          />

          <p className="font-Josefin dark:text-[#edfff4] 
            text-[#000000b3] pl-4 text-[16px] font-[600]">
            40k+ Online Courses & 500k+ Registered Students
            <Link
              href="/courses"
              className="dark:text-[#46e256] text-[crimson] ml-2"
            >
              view courses
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default Hero;