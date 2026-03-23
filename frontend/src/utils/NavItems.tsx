import { Link } from 'react-router-dom';
import React, { FC } from 'react'

export const navItemsData = [
    {
        name: "Home",
        link: "/"
    },
    {
        name: "Courses",
        link: "/courses"
    },
    {
        name: "About",
        link: "/about"
    },
    {
        name: "Policy",
        link: "/policy"
    },
    {   
        name: "FAQ",
        link: "/faq"
    }
];
type Props = {
  activeItem: number;
  isMobile: boolean;
  onNavClick?: () => void;
}

const NavItems: FC<Props> = ({ activeItem, isMobile, onNavClick }) => {
  const handleNavClick = () => {
    if (onNavClick) {
      onNavClick();
    }
  };
  return (
    <>
        <div className="hidden 800px:flex">
            {
                navItemsData && navItemsData.map((item, index) => (
                    <Link to={item.link} key={index} onClick={handleNavClick}>
                        <span className={`${
                            activeItem === index 
                                ? "dark:text-[#37a39a] text-[crimson]"
                                : "dark:text-white text-black"
                            } text-[18px] px-6 font-Poppins font-[400]`}
                        >
                            {item.name}
                        </span>
                    </Link>
                ))
            }
        </div>

        {
            isMobile && (
                <div className="800px:hidden mt-5">
                    {
                      navItemsData && navItemsData.map((item, index) => (
                        <Link to={item.link} key={index} onClick={handleNavClick}>
                          <span className={`${
                            activeItem === index 
                              ? "dark:text-[#37a39a] text-[crimson]"
                              : "dark:text-white text-black"
                              } block py-5 text-[18px] px-6 font-Poppins font-[400]`}
                          >
                            {item.name}
                          </span>
                        </Link>
                      ))
                    }
                </div>
            )
        }
    </>
  )
}
export default NavItems;
