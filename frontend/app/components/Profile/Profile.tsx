"use client"
import React, { FC, useEffect, useState } from 'react'
import SideBarProfile from './SideBarProfile';
import { useLogoutUserQuery } from '../../../redux/features/auth/authApi';
import { signOut } from 'next-auth/react';
import ProfileInfo from "./ProfileInfo"
import ChangePassword from "./ChangePassword"

type Props = {
  user: any;
}

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [logoutUser, setLogoutUser] = useState(false);

  const { isSuccess, error } = useLogoutUserQuery(undefined, {
    skip: !logoutUser ? true : false,
  });
  const [active, setActive] = useState(1);

  const logOutHandler = async () => {
    setLogoutUser(true);
  }

  useEffect(() => {
    if (isSuccess || error) {
      signOut({ redirect: false }).then(() => {
        window.location.reload();
      });
    }
  }, [isSuccess, error]);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 85);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-[85%] flex mx-auto">
      <div className={`w-[150px] 800px:w-[310px] h-[390px] dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff1d] border-[#000000] shadow-xl rounded-[5px] dark:shadow-sm mt-[80px] mb-[80px] sticky ${scroll ? "top-[120px]" : "top-[30px]"
        } left-[30px]`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logoutHandler={logOutHandler}
        />
      </div>

      <div className="w-full h-full bg-transparent mt-[80px] ml-4">
        {active === 1 && (
          <ProfileInfo avatar={avatar} user={user} />
        )}

        {active === 2 && (
          <div className="text-black dark:text-white">
            <ChangePassword />
          </div>
        )}

        {active === 3 && (
          <div className="text-black dark:text-white">
            Enrolled Courses
          </div>
        )}

        {active === 4 && (
          <div className="text-black dark:text-white">
            Quiz section
          </div>
        )}
      </div>
    </div>
  )
}
export default Profile;