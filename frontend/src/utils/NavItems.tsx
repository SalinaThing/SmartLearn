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
    name: "Quiz",
    link: "/quiz"
  },
 
  {
    name: "About Us",
    link: "/about"
  },
];
type Props = {
  activeItem: number;
  isMobile: boolean;
  onNavClick?: () => void;
}

import { useUser } from '@/hooks/useUser';

const NavItems: FC<Props> = ({ activeItem, isMobile, onNavClick }) => {
  const { isAuthenticated } = useUser();
  
  const handleNavClick = () => {
    if (onNavClick) {
      onNavClick();
    }
  };

  // Filter nav items based on authentication
  const filteredNavItems = navItemsData.filter(item => {
    if (item.name === "Quiz" && !isAuthenticated) {
      return false;
    }
    return true;
  });

  return (
    <>
      <div className="hidden 800px:flex">
        {
          filteredNavItems.map((item, index) => (
            <Link to={item.link} key={index} onClick={handleNavClick}>
              <span className={`${activeItem === index
                  ? "dark:text-[#39c1f3] text-[crimson]"
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
              filteredNavItems.map((item, index) => (
                <Link to={item.link} key={index} onClick={handleNavClick}>
                  <span className={`${activeItem === index
                      ? "dark:text-[#39c1f3] text-[crimson]"
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
