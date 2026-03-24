import { Link } from 'react-router-dom'
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
                <Link to="/about" className="text-[16px] text-[#000000a4] hover:text-[#000]">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-[16px] text-[#000000a4] hover:text-[#000]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-[16px] text-[#000000a4] hover:text-[#000]">
                  FAQ
                </Link>
              </li>

              <li>
                <Link to="/feedback" className="text-[16px] text-[#000000a4] hover:text-[#000]">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[24px] font-[600] text-black">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/courses" className="text-[16px] text-[#000000a4] hover:text-[#000]">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-[16px] text-[#000000a4] hover:text-[#000]">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/quizes" className="text-[16px] text-[#000000a4] hover:text-[#000]">
                  Quizes
                </Link>
              </li>
               <li>
                <Link to="/notice" className="text-[16px] text-[#000000a4] hover:text-[#000]">
                  Notice
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[24px] font-[600] text-black">Social Links</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://www.youtube.com/channel/UCHz6Sne9splmvm-q2W1_HWQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] text-[#000000a4] hover:text-[#000]"
                >
                  Youtube
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/shahriar_sajeeb_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] text-[#000000a4] hover:text-[#000]"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.github.com/shahriarsajeeb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] text-[#000000a4] hover:text-[#000]"
                >
                  Github
                </a>
              </li>

               <li>
                <a
                  href="https://www.twitter.com/shahriarsajeeb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] text-[#000000a4] hover:text-[#000]"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[24px] font-[600] text-black">Contact Info</h3>
            <p className="text-[16px] text-[#000000a4] leading-6">
              Call Us: 01-1234567, 01-7654321
            </p>
            <p className="text-[16px] text-[#000000a4] leading-6">
              Address: Gokarna 6, Kathmandu, Nepal
            </p>
            <p className="text-[16px] text-[#000000a4] leading-6">
              Mail Us: smart@elearning.com
            </p>
          </div>
        </div>
        <br />
        <br />
        <p className="text-center text-black text-[16px] pb-2">
          Copyright © 2023 Smart | All Rights Reserved
        </p>
      </div>
    </footer>
  )
}

export default Footer
