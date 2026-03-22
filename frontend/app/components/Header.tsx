"use client";
import Link from "next/link";
import React, { FC, useState, useEffect } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import toast from "react-hot-toast";
import CustomModal from "../utils/CustomModal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "../../public/assets/heroicon3.jpg";
import { useSession } from "next-auth/react";
import { useLogoutUserQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({
  activeItem,
  setOpen,
  setActiveItem,
  route,
  setRoute,
  open,
}) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { data: userData, isLoading, refetch } = useLoadUserQuery(undefined,{refetchOnMountOrArgChange:true});
  const { data } = useSession();
  const [logoutUser, setLogoutUser] = useState(false);

  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
  const { } = useLogoutUserQuery(undefined, {
    skip: !logoutUser ? true : false,
  })

  useEffect(() => {
    if(!isLoading){
      if (!userData) {
        if(data){
          socialAuth({
            email: data.user?.email,
            name: data.user?.name,
            avatar: data.user?.image,
          });
          refetch();
        }
      } 
      if (data === null){
        if(isSuccess){
          toast.success("Login Successfully");
        }
      }
      if(data === null && !isLoading && !userData){
        setLogoutUser(true);
      }
    }
  }, [data, userData, socialAuth, isLoading]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login successfully!!");
    }
    if (error) {
        if('data' in error){
            const errorData = error as any;
            toast.error(errorData.data?.message || "An error occurred during social auth");
        } else {
            const fetchError = error as any;
            toast.error(fetchError?.error || "Failed to connect to server");
        }
    }
  }, [isSuccess, error]);


  //Proper scroll handling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 85) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCloseSidebar = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === "screen") {
      setOpenSidebar(false);
    }
  };

  //console.log(user) getting user data in browser
  const profileImage = user?.avatar?.url && user.avatar.url.trim() !== "" ? user.avatar.url : avatar;

  return (
    <div className="w-full relative">
      <div
        className={`${active
          ? "dark:bg-opacity-50 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
          : "bg-white dark:bg-slate-900 w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
          }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            {/* Logo */}
            <Link
              href={"/"}
              className="text-[25px] font-Poppins font-[500] text-black dark:text-white"
            >
              SmartLearn
            </Link>

            <div className="flex items-center">
              <NavItems
                activeItem={activeItem}
                isMobile={false}
                onNavClick={() => { }}
              />

              <ThemeSwitcher />

              {/* Mobile Menu */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>

              {/* Desktop User Icon */}
              {
                userData ? (
                  <Link href={"/profile"}>
                    <Image
                      src={userData?.user.avatar  ? userData.user.avatar.url : avatar}
                      alt=" "
                      width={30}
                      height={30}
                      className="w-[30px] h-[30px] rounded-full cursor-pointer border-2"
                      style={{
                        borderColor: activeItem === 5 ? "#ffc107" : "transparent",
                      }}
                    />
                  </Link>

                ) : (
                  <HiOutlineUserCircle
                    size={25}
                    className="hidden 800px:block cursor-pointer dark:text-white text-black ml-4"
                    onClick={() => {
                      setOpen(true);
                    }}
                  />
                )
              }
            </div>
          </div>
        </div>

        {/* mobile sidebar */}
          {openSidebar && (
            <div
              className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
              onClick={handleCloseSidebar}
              id="screen"
            >
              <div className="w-[70%] fixed z-[99999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                <NavItems activeItem={activeItem} isMobile={true} />

                <HiOutlineUserCircle
                  size={25}
                  className="cursor-pointer ml-5 my-2 text-black dark:text-white"
                  onClick={() => setOpen(true)}
                />

                <br />
                <br />

                <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                  Copyright © 2023 ELearning
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Login Modal */}
        {route === "Login" && (
          <>
            {
              open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  activeItem={activeItem}
                  component={Login}
                  setRoute={setRoute}
                  refetch={refetch}
                />
              )
            }
          </>
        )}

        {/* SignUp Modal */}
        {route === "SignUp" && (
          <>
            {
              open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  activeItem={activeItem}
                  component={SignUp}
                  setRoute={setRoute}
                />
              )
            }
          </>
        )}

        {/* Verification Modal */}
        {route === "Verification" && (
          <>
            {
              open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  activeItem={activeItem}
                  component={Verification}
                  setRoute={setRoute}
                />
              )
            }
          </>
        )}

    </div>
  );
};

export default Header;