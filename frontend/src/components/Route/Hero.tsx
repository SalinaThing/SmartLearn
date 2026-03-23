import React, { FC, useState } from "react";
import Image from "@/utils/Image";
import { BiSearch } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Loader from "../Loader/Loader";

const heroIcon1 = "/assets/heroicon1.jpg";
const heroIcon2 = "/assets/heroicon2.jpg";
const heroIcon3 = "/assets/heroicon3.jpg";

type Props = {};

const Hero: FC<Props> = () => {
  const {data, isLoading} = useGetHeroDataQuery("Banner")
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if(search === ""){
      return
    }else{
      navigate(`/courses?title=${encodeURIComponent(search)}`);
    }

  }

  return (
    <>
      {
        isLoading ? (
          <Loader/>
        ): (
          <div className="w-full 1000px:flex items-center">
            <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500px] 1100px:h-[600px] h-[50vh] w-[50vh] her0_animation rounded"/>

              {/* Left Section - Smaller Banner */}
              <div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-[0] z-10">
                <Image
                  src={data?.layout?.banner?.image?.url || data?.layout?.banner?.title || "/placeholder.png"}
                  alt=""
                  width={380}
                  height={380}
                  className="object-contain 1100:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-[10]"
                />
                
              </div>

            {/* Right Section */}
            {/* Text Section */}
            <div className="1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px">
              <h2 className="dark:text-white text-gray-800 text-[28px] 1100px:text-[70px] font-[600] font-Josefin py-2 1000px:leading-[75px] 1500px:w-[80%]">
                {data?.layout?.banner?.title}
              </h2>
              <br/>

              <p className="dark:text-gray-300 text-gray-600 
                font-Josefin font-[600] 
                text-[18px] 1500px:!w-[55%] 1100px:!w-[80%]">
                {data?.layout?.banner?.subTitle}
              </p>
              <br/>
              <br/>

              {/* Search Box */}
              <div className="1500px:w-[55%] 1100px:w-[80%] h-[50px] bg-transparent relative">
                <input
                  type="search"
                  placeholder="Search Courses..."
                  value={search}
                  onChange={(e)=> setSearch(e.target.value)}
                  className="bg-transparent 
                      border dark:border-none 
                      dark:bg-[#575757] 
                      dark:placeholder:text-[#ffffffdd] 
                      rounded-[5px] p-2 
                      w-full h-full outline-none 
                      text-[#0000004e] dark:text-[#ffffffe6] 
                      text-[20px] font-[500] 
                      font-Josefin shadow-sm"
                />

                {/* Search Button inside the box */}
                <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] top-0 right-0 bg-[#39c1f3] rounded-r-[5px]"
                  onClick={handleSearch}
                >
                  <BiSearch 
                    className="text-white"
                    size={30} 
                  />
                </div>
              </div>
              <br/>
              <br/>

              {/* Student Icons */}
              <div className="1500px:w-[55%] 1100px:w-[80%] w-[90%] flex items-center">

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
                    to="/courses"
                    className="dark:text-[#46e256] text-[crimson] ml-2"
                  >
                    view courses
                  </Link>
                </p>

              </div>
              <br/>
            </div>
          </div>
        )}
    </>
  );
};

export default Hero;
