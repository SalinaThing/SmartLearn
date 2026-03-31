import React, { FC, useState } from "react";
import Image from "@/utils/Image";
import { BiSearch } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { FiBookOpen, FiStar, FiZap, FiPlayCircle } from "react-icons/fi";
import { useUser } from "@/hooks/useUser";
import profile1 from "../../assets/People1.jpg";
import profile2 from "../../assets/People2.jpg";
import profile3 from "../../assets/people3.jpg";
import HeroImage from "../../assets/Hero.jpg";

type Props = {
  setOpen: (open: boolean) => void;
  setRoute: (route: string) => void;
};

const Hero: FC<Props> = ({ setOpen, setRoute }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  const handleSearch = () => {
    if (search === "") {
      return
    } else {
      navigate(`/courses?title=${encodeURIComponent(search)}`);
    }
  }

  const quickSearch = (term: string) => {
    setSearch(term);
    navigate(`/courses?title=${encodeURIComponent(term)}`);
  }

  const handleProtectedNavigation = (path: string) => {
    if (!isAuthenticated) {
      setOpen(true);
      setRoute("SignUp");
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <div className="w-full 1000px:flex items-center">
        <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1100px:h-[600px] h-[50vh] w-[50vh] her0_animation rounded" />

        {/* Left Section - Smaller Banner */}
        <div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-[0] z-10">
          <Image
            src={HeroImage}
            alt=""
            width={380}
            height={380}
            className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-[10]"
          />
        </div>

        {/* Right Section - Text Section */}
        <div className="1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px]">
          <h2 className="dark:text-white text-gray-800 text-[28px] 1100px:text-[70px] font-[600] font-Josefin pb-2 mb-2 1000px:leading-[75px] 1500px:w-[80%]">
            Improve Your Online Learning Experience Better Instantly
          </h2>

          <p className="dark:text-gray-300 text-gray-600 
                font-Josefin font-[600] 
                text-[18px] 1500px:!w-[55%] 1100px:!w-[80%] mt-0">
            We have 40k+ Online courses & 500k+ Online registered student. Find your desired Courses from them.
          </p>

          {/* Action Buttons - Clean Design */}
          <div className="1500px:w-[60%] 1100px:w-[85%] w-full mb-5">
            <div className="flex flex-wrap items-center justify-center 1000px:justify-start gap-3">
               <div
                onClick={() => handleProtectedNavigation("/courses")}
                className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
              >
                Start learning free →
              </div>
              
              <div
                onClick={() => handleProtectedNavigation("/courses")}
                className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
              >
                Browse courses
              </div>
              <div
                onClick={() => handleProtectedNavigation("/courses")}
                className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
              >
                Premium courses
              </div>
              <div
                onClick={() => handleProtectedNavigation("/quiz")}
                className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
              >
                Quiz
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="1500px:w-[60%] 1100px:w-[85%] w-full">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="search"
                  placeholder="Search courses, quizzes, topics..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full h-[52px] outline-none 
                          bg-white dark:bg-[#111C43]
                          border-2 border-gray-200 dark:border-gray-700
                          hover:border-[#39c1f3] dark:hover:border-[#39c1f3]
                          focus:border-[#39c1f3] dark:focus:border-[#39c1f3]
                          rounded-xl px-5
                          text-gray-700 dark:text-white 
                          text-[15px] font-[400] 
                          font-Poppins
                          placeholder:text-gray-400 dark:placeholder:text-gray-500
                          transition-all duration-300
                          shadow-sm hover:shadow-md"
                />
              </div>

              <button
                className="flex items-center justify-center gap-2 px-6 h-[52px]
                          bg-gradient-to-r from-[#39c1f3] to-[#2a9fd8]
                          hover:from-[#2a9fd8] hover:to-[#1f8bc0]
                          text-white font-semibold
                          rounded-xl transition-all duration-300 
                          hover:shadow-lg hover:scale-[1.02]
                          active:scale-95 cursor-pointer
                          text-[15px] font-Poppins
                          shadow-md"
                onClick={handleSearch}
              >
                <BiSearch size={18} />
                Search
              </button>
            </div>

             {/* ── Popular tags — plain comma text matching the image ── */}
            <div className="mt-3 text-center 1000px:text-left">
              <span className="text-[13px] text-gray-500 dark:text-gray-400 font-Poppins">
                Popular:{" "}
                {[
                  { label: "React",       term: "React" },
                  { label: "Python",      term: "Python" },
                  { label: "UI/UX Design",term: "UI/UX Design" },
                  { label: "Node.js",     term: "Node.js" },
                ].map(({ label, term }, i, arr) => (
                  <React.Fragment key={term}>
                    <button
                      onClick={() => quickSearch(term)}
                      className="
                        text-gray-600 dark:text-gray-300
                        hover:text-[#39c1f3] dark:hover:text-[#39c1f3]
                        font-[500] font-Poppins text-[13px]
                        transition-colors duration-150
                        bg-transparent border-none p-0 cursor-pointer                        mr-2                      "
                    >
                      {label}
                    </button>
                    {i < arr.length - 1 && (
                      <span className="text-gray-400 dark:text-gray-600">, </span>
                    )}
                  </React.Fragment>
                ))}
              </span>
            </div>
          </div>
          <br />
          <br />

          {/* Student Icons */}
          <div className="1500px:w-[55%] 1100px:w-[80%] w-[90%]">
            <div className="flex items-center flex-wrap gap-3">
              <div className="flex items-center">
                <Image
                  src={profile1}
                  alt=" "
                  width={35}
                  height={35}
                  className="rounded-full border-2 border-white dark:border-gray-700 shadow-md"
                />
                <Image
                  src={profile2}
                  alt=" "
                  width={35}
                  height={35}
                  className="rounded-full ml-[-12px] border-2 border-white dark:border-gray-700 shadow-md"
                />
                <Image
                  src={profile3}
                  alt=" "
                  width={35}
                  height={35}
                  className="rounded-full ml-[-12px] border-2 border-white dark:border-gray-700 shadow-md"
                />
                
                <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] 1000px:pl-3 text-[18px] font-[600] mt-4">
                        40k+ Online Courses & 500k+ Registered Students

                  <div 
                      onClick={() => handleProtectedNavigation("/courses")} 
                      className="text-red-500 hover:text-indigo-600 transition duration-200 cursor-pointer px-2"
                  >
                      view courses
                  </div>
                </p>

              </div>
            </div>
          </div>
          <br />
        </div>
      </div>
    </>
  );
};

export default Hero;