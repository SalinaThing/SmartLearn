"use client"
import React, { FC, useEffect, useState } from 'react'
import SideBarProfile from './SideBarProfile';
import { useLogoutUserQuery } from '@/redux/features/auth/authApi';
import { signOut } from '@/auth/oauth';
import ProfileInfo from "./ProfileInfo"
import ChangePassword from "./ChangePassword"
import { useGetAllCoursesByUserQuery } from '@/redux/features/courses/coursesApi';
import CourseCard from '../Course/CourseCard';
import AllQuizzesStudent from '../Quiz/AllQuizzesStudent';
import { Link } from 'react-router-dom';

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
  const { data: allCoursesData, isLoading: coursesLoading } = useGetAllCoursesByUserQuery({});

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

  const enrolledCourseIds = (user?.courses || [])
    .map((c: any) => c?.courseId || c)
    .filter(Boolean);

  const enrolledCourses = (allCoursesData?.courses || []).filter((course: any) =>
    enrolledCourseIds.includes(course?._id)
  );

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
            <h2 className="text-[24px] font-[600] mb-4">Enrolled Courses</h2>
            {coursesLoading ? (
              <p>Loading...</p>
            ) : enrolledCourses.length === 0 ? (
              <div>
                <p>You have not enrolled in any course yet.</p>
                <Link to="/courses" className="text-blue-500 underline mt-2 inline-block">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 800px:grid-cols-2 1100px:grid-cols-3 gap-4">
                {enrolledCourses.map((course: any) => (
                  <CourseCard key={course._id} item={course} isProfile={true} />
                ))}
              </div>
            )}
          </div>
        )}

        {active === 4 && (
          <div className="text-black dark:text-white">
            <AllQuizzesStudent embedded />
          </div>
        )}
      </div>
    </div>
  )
}
export default Profile;
