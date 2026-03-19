import Link from 'next/link'
import React from 'react'

type Props = Record<string, never>

const Footer = (props: Props) => {
  return (
    <footer className="bg-white pt-10 pb-5 font-Poppins">
      <div className="w-[95%] 800px:w-full 800px:max-w-[85%] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 800px:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-[24px] font-[600] text-black">About</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-[16px] text-[#000000a4] hover:text-[#000]">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-[16px] text-[#000000a4] hover:text-[#000]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[16px] text-[#000000a4] hover:text-[#000]">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[24px] font-[600] text-black">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/courses" className="text-[16px] text-[#000000a4] hover:text-[#000]">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-[16px] text-[#000000a4] hover:text-[#000]">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/course-dashboard" className="text-[16px] text-[#000000a4] hover:text-[#000]">
                  Course Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[24px] font-[600] text-black">Social Links</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="https://www.youtube.com/channel/UCHz6Sne9splmvm-q2W1_HWQ"
                  className="text-[16px] text-[#000000a4] hover:text-[#000]"
                >
                  Youtube
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/shahriar_sajeeb_/"
                  className="text-[16px] text-[#000000a4] hover:text-[#000]"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.github.com/shahriarsajeeb"
                  className="text-[16px] text-[#000000a4] hover:text-[#000]"
                >
                  github
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[24px] font-[600] text-black">Contact Info</h3>
            <p className="text-[16px] text-[#000000a4] leading-6">
              Call Us: 1-885-665-2022
            </p>
            <p className="text-[16px] text-[#000000a4] leading-6">
              Address: +7011 Vermont Ave, Los Angeles, CA 90044
            </p>
            <p className="text-[16px] text-[#000000a4] leading-6">
              Mail Us: hello@elearning.com
            </p>
          </div>
        </div>
        <br />
        <br />
        <p className="text-center text-black text-[16px] pb-2">
          Copyright © 2023 ELearning | All Rights Reserved
        </p>
      </div>
    </footer>
  )
}

export default Footer