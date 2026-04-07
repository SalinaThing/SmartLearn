
import { Link } from "react-router-dom";
import React, { FC, useState, useEffect } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import { VscVerifiedFilled } from "react-icons/vsc";
import toast from "react-hot-toast";
import CustomModal from "../utils/CustomModal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import { useSelector } from "react-redux";
import Image from "@/utils/Image";
const avatar = "/assets/heroicon3.jpg";
import { useUser } from "@/hooks/useUser";
import { useSession } from "@/auth/session";
import { useLogoutUserMutation, useSocialAuthMutation } from "@/redux/features/auth/authApi";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
  setActiveItem?: (item: number) => void;
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
  const socialAuthAttempted = React.useRef(false);
  const { user, isLoading, isFetching, refetch } = useUser();
  const { data: sessionData } = useSession();
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
  const [logoutUser] = useLogoutUserMutation();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        if (sessionData && !socialAuthAttempted.current) {
          socialAuthAttempted.current = true;
          socialAuth({
            email: sessionData.user?.email,
            name: sessionData.user?.name,
            avatar: sessionData.user?.image,
          }).unwrap().then(async () => {
            // Wait until user is loaded so protected routes don't temporarily redirect.
            try {
              await refetch();
            } catch {
              // Errors are handled by existing guards/toasts
            }
          }).catch((err: any) => {
            console.error("Social auth failed:", err);
          });
        }
      }
      if (sessionData === null) {
        // Handled by other useEffect
      }
    }
  }, [sessionData, user, socialAuth, isLoading, isFetching, isSuccess, refetch]);

  useEffect(() => {
    if (isSuccess) {
      const role = user?.role || "student";
      const displayRole = role.charAt(0).toUpperCase() + role.slice(1);
      toast.success(`Login with ${displayRole} successfully`);
    }
    if (error) {
      if ('data' in error) {
        const errorData = error as any;
        toast.error(errorData.data?.message || "An error occurred during social auth");
      } else {
        const fetchError = error as any;
        toast.error(fetchError?.error || "Failed to connect to server");
      }
    }
  }, [isSuccess, error, user]);


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

  // Derive auth state from the unified useUser hook
  const isAuthenticated = !!user;
  const currentUser = user;
  const profileImage = currentUser?.avatar?.url && currentUser.avatar.url.trim() !== "" ? currentUser.avatar.url : avatar;

  // Once we are authenticated, make sure any auth modal (Login/SignUp/Verification) is closed.
  useEffect(() => {
    if (open && isAuthenticated) setOpen(false);
  }, [open, isAuthenticated, setOpen]);

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
              to={"/"}
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
                isAuthenticated ? (
                  <div className="flex items-center gap-2 800px:gap-4">
                    <Link
                      to={user.role === 'admin' ? "/admin" : user.role === 'teacher' ? "/teacher" : "/student/dashboard"}
                      className="hidden 800px:block text-[15px] font-Poppins font-[500] text-black dark:text-white hover:text-[#39c1f3] transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link to={"/profile"}>
                      <div className="relative">
                        <Image
                          src={profileImage}
                          alt=" "
                          width={30}
                          height={30}
                          className="w-[30px] h-[30px] rounded-full cursor-pointer border-2"
                          style={{
                            borderColor: activeItem === 5 ? "#ffc107" : "transparent",
                          }}
                        />
                        {user.role === 'admin' && (
                          <div className="absolute bottom-0 right-0 p-[1px] bg-white dark:bg-slate-900 rounded-full">
                            <VscVerifiedFilled className="text-red-500" size={12} title="Admin" />
                          </div>
                        )}
                        {user.role === 'teacher' && (
                          <div className="absolute bottom-0 right-0 p-[1px] bg-white dark:bg-slate-900 rounded-full">
                            <VscVerifiedFilled className="text-green-500" size={12} title="Teacher" />
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>

                ) : (
                  <div className="hidden 800px:flex items-center gap-4 ml-4">
                    <button
                      className="text-[15px] min-w-[120px] px-8 py-2 font-Poppins font-[500] text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300"
                      onClick={() => {
                        setOpen(true);
                        setRoute("Login");
                      }}
                    >
                      Login
                    </button>
                    <button
                      className="text-[15px] min-w-[120px] px-8 py-2 font-Poppins font-[500] text-white bg-gradient-to-r from-[#39c1f3] to-[#2a9fd8] hover:from-[#2a9fd8] hover:to-[#1f8bc0] rounded-lg transition duration-300 shadow-sm hover:shadow-md"
                      onClick={() => {
                        setOpen(true);
                        setRoute("SignUp");
                      }}
                    >
                      Sign Up
                    </button>
                  </div>
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

              {
                isAuthenticated ? (
                  <Link to={"/profile"} className="ml-5 my-2 inline-block">
                    <div className="relative inline-block">
                      <Image
                        src={profileImage}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-[40px] h-[40px] rounded-full cursor-pointer border-2"
                        style={{
                          borderColor: activeItem === 5 ? "#ffc107" : "transparent",
                        }}
                      />
                      {user.role === 'admin' && (
                          <div className="absolute bottom-0 right-0 p-[2px] bg-white dark:bg-slate-900 rounded-full">
                            <VscVerifiedFilled className="text-red-500" size={16} title="Admin" />
                          </div>
                      )}
                      {user.role === 'teacher' && (
                          <div className="absolute bottom-0 right-0 p-[2px] bg-white dark:bg-slate-900 rounded-full">
                            <VscVerifiedFilled className="text-green-500" size={16} title="Teacher" />
                          </div>
                      )}
                    </div>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-4 mt-6 px-5">
                    <button
                      className="w-full min-h-[45px] text-[16px] py-2.5 font-Poppins font-[500] text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300"
                      onClick={() => {
                        setOpen(true);
                        setRoute("Login");
                      }}
                    >
                      Login
                    </button>
                    <button
                      className="w-full min-h-[45px] text-[16px] py-2.5 font-Poppins font-[500] text-white bg-[#39c1f3] hover:bg-[#2a9fd8] rounded-lg transition duration-300 shadow-sm"
                      onClick={() => {
                        setOpen(true);
                        setRoute("SignUp");
                      }}
                    >
                      Sign Up
                    </button>
                  </div>
                )
              }

              <br />
              <br />

              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                Copyright © 2026 SmartLearn
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
                refetch={refetch}
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
                refetch={refetch}
              />
            )
          }
        </>
      )}

    </div>
  );
};

export default Header;
