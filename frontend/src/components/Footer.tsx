import { Link, useNavigate } from 'react-router-dom'
import React from 'react'
import { useUser } from '@/hooks/useUser';

type Props = {
  setOpen?: (open: boolean) => void;
  setRoute?: (route: string) => void;
};

const Footer = ({ setOpen, setRoute }: Props) => {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  const handleProtectedNavigation = (path: string) => {
    if (!isAuthenticated && setOpen && setRoute) {
      setOpen(true);
      setRoute("SignUp");
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-900 pt-10 pb-5 font-Poppins border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="w-[95%] 800px:w-full 800px:max-w-[85%] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 800px:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-[24px] font-[600] text-black dark:text-white">About</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-[16px] text-[#000000a4] dark:text-gray-400 hover:text-[#000] dark:hover:text-white">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[16px] text-[#000000a4] dark:text-gray-400 hover:text-[#000] dark:hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-[16px] text-[#000000a4] dark:text-gray-400 hover:text-[#000] dark:hover:text-white">
                  FAQ
                </Link>
              </li>

              <li>
                <div
                  onClick={() => handleProtectedNavigation("/feedback")}
                  className="text-[16px] text-[#000000a4] dark:text-gray-400 hover:text-[#000] dark:hover:text-white cursor-pointer"
                >
                  Feedback
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[24px] font-[600] text-black dark:text-white">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/courses" className="text-[16px] text-[#000000a4] dark:text-gray-400 hover:text-[#000] dark:hover:text-white">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-[16px] text-[#000000a4] dark:text-gray-400 hover:text-[#000] dark:hover:text-white">
                  My Account
                </Link>
              </li>
              <li>
                <div
                  onClick={() => handleProtectedNavigation("/quiz")}
                  className="text-[16px] text-[#000000a4] dark:text-gray-400 hover:text-[#000] dark:hover:text-white cursor-pointer"
                >
                  Quiz
                </div>
              </li>
              <li>
                <div
                  onClick={() => handleProtectedNavigation("/announcement")}
                  className="text-[16px] text-[#000000a4] dark:text-gray-400 hover:text-[#000] dark:hover:text-white cursor-pointer"
                >
                  Announcement
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[24px] font-[600] text-black dark:text-white">Social Links</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://www.youtube.com/channel/UCHz6Sne9splmvm-q2W1_HWQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] text-[#000000a4] dark:text-gray-400 hover:text-[#000] dark:hover:text-white"
                >
                  Youtube
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/shahriar_sajeeb_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] text-[#000000a4] dark:text-gray-400 hover:text-[#000] dark:hover:text-white"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.github.com/shahriarsajeeb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] text-[#000000a4] dark:text-gray-400 hover:text-[#000] dark:hover:text-white"
                >
                  Github
                </a>
              </li>

              <li>
                <a
                  href="https://www.twitter.com/shahriarsajeeb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] text-[#000000a4] dark:text-gray-400 hover:text-[#000] dark:hover:text-white"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[24px] font-[600] text-black dark:text-white">Contact Info</h3>
            <p className="text-[16px] text-[#000000a4] dark:text-gray-400 leading-6">
              Call Us: 01-1234567, 01-7654321
            </p>
            <p className="text-[16px] text-[#000000a4] dark:text-gray-400 leading-6">
              Address: Gokarna 6, Kathmandu, Nepal
            </p>
            <p className="text-[16px] text-[#000000a4] dark:text-gray-400 leading-6">
              Mail Us: smart@elearning.com
            </p>
          </div>
        </div>
        <br />
        <br />
        <p className="text-center text-black dark:text-white text-[16px] pb-2">
          Copyright © 2026 SmartLearn | All Rights Reserved
        </p>
      </div>
    </footer>
  )
}

export default Footer
