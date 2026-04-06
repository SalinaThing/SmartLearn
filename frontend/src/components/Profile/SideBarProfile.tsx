"use client"
import React, { FC } from 'react'
import Image from '@/utils/Image'
import avatarDefault from "../../assets/pro7.jpg"
import { RiLockPasswordFill } from 'react-icons/ri';
import { AiOutlineLogout } from 'react-icons/ai';
import { VscVerifiedFilled } from 'react-icons/vsc';
import { MdOutlineAdminPanelSettings, MdOutlineQuiz } from 'react-icons/md';
import { BiBookOpen } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { IoNotificationsOutline } from 'react-icons/io5';

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: any;
}

const SideBarProfile:FC <Props> = ({user, active, avatar, setActive, logoutHandler}) => {
  const imageSrc =
    (user?.avatar && user.avatar.url) ||
    avatar ||
    avatarDefault;

  return (
    <div className="w-full">
      <div 
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
        active ===1 ? "dark:bg-slate-600 bg-white" : "bg-transparent"
          }`}
        onClick={() => setActive(1)}
      >
      <div className="relative">
        <Image
          src={imageSrc}
          alt=""
          width={50}
          height={50}
          className="w-[50px] h-[50px] 800px:w-[50px] 600px:h-[30px] cursor-pointer rounded-full"
        />
        {user.role === 'admin' && (
          <div className="absolute bottom-0 right-0 p-[1px] bg-white dark:bg-slate-800 rounded-full">
            <VscVerifiedFilled className="text-red-500" size={14} title="Admin" />
          </div>
        )}
        {user.role === 'teacher' && (
          <div className="absolute bottom-0 right-0 p-[1px] bg-white dark:bg-slate-800 rounded-full">
            <VscVerifiedFilled className="text-green-500" size={14} title="Teacher" />
          </div>
        )}
      </div>

      <h5 className="pl-2 block font-Poppins dark:text-white text-black">
        My Account
      </h5>
    </div>

    {/* Change Password */}
    <div 
      className={`w-full flex items-center px-3 py-4 cursor-pointer ${
      active ===2 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
        }`}
      onClick={() => setActive(2)}
    >
      <RiLockPasswordFill size={20} className="text-black dark:text-white" />
      <h5 className="pl-2 block font-Poppins dark:text-white text-black">
        Change Password
      </h5>
    </div>

    {user?.role?.toLowerCase() === "student" && (
      <div 
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
        active ===3 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
          }`}
        onClick={() => setActive(3)}
      >
        <BiBookOpen size={20} className="text-black dark:text-white" />
        <h5 className="pl-2 block font-Poppins dark:text-white text-black">
          Enrolled Courses
        </h5>
      </div>
    )}

    {/* Admin Dashboard */}
    {
      user?.role?.toLowerCase() === 'teacher' && (
        <Link
          className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 6 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
              }`}
            to={"/teacher"}
          >
          <MdOutlineAdminPanelSettings size={20} className="text-black dark:text-white" />
          <h5 className="pl-2 block font-Poppins dark:text-white text-black">
            Teacher Dashboard
          </h5>
        </Link>
      )
    }

    {user?.role?.toLowerCase() === "student" && (
      <div 
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
        active ===4 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
          }`}
        onClick={() => setActive(4)}
      >
        <MdOutlineQuiz size={20} className="text-black dark:text-white" />
        <h5 className="pl-2 block font-Poppins dark:text-white text-black">
          Quiz
        </h5>
      </div>
    )}

    {/* Student Dashboard */}
    {user?.role?.toLowerCase() === "student" && (
      <Link
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 7 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
            }`}
          to={"/student/dashboard"}
        >
        <MdOutlineAdminPanelSettings size={20} className="text-black dark:text-white" />
        <h5 className="pl-2 block font-Poppins dark:text-white text-black">
          Student Dashboard
        </h5>
      </Link>
    )}

    {/* Notifications */}
    <div 
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
        active === 8 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
          }`}
        onClick={() => setActive(8)}
      >
        <IoNotificationsOutline size={20} className="text-black dark:text-white" />
        <h5 className="pl-2 block font-Poppins dark:text-white text-black">
          Notifications
        </h5>
    </div>

    {/* Logout */}
    <div 
      className={`w-full flex items-center px-3 py-4 cursor-pointer ${
      active === 5 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
        }`}
      onClick={() => logoutHandler()}
    >
      <AiOutlineLogout size={20} className="text-black dark:text-white" />
      <h5 className="pl-2 block font-Poppins dark:text-white text-black">
        LogOut
      </h5>
    </div>

    </div>
  )
}

export default SideBarProfile;
