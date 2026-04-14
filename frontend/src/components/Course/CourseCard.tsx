import Ratings from '@/utils/Ratings';
import { Link } from 'react-router-dom';
import React, { FC } from 'react'
import { AiOutlineUnorderedList } from 'react-icons/ai';
import Image from '@/utils/Image';

import { useUser } from '@/hooks/useUser';

type Props = {
    item: any;
    isProfile?: boolean;
}

const CourseCard: FC<Props> = ({ item, isProfile }) => {
    const { user } = useUser();
    
    // Check if user is enrolled in this course
    const isActuallyEnrolled = user?.courses?.some((c: any) => c.courseId === item?._id) || user?.role === "teacher" || user?.role === "admin";
    const isEnrolled = isActuallyEnrolled;
    const targetPath = (isProfile || isEnrolled) ? `/course-access/${item?._id}` : `/course/${item?._id}`;

    return (
        <Link to={targetPath}>
            <div className="w-full min-h-[35vh] dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-slate-700 rounded-lg p-3 shadow-sm dark:shadow-inner hover-glow duration-300">
                <Image
                    src={item?.thumbnail?.url || "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
                    width={400}
                    height={300}
                    style={{ objectFit: "cover" }}
                    className="rounded w-full h-[180px] object-cover"
                    alt={item?.name || "Course thumbnail"}
                />
                <br />

                <h1 className="font-Poppins text-[16px] font-semibold text-black dark:text-[#fff] line-clamp-2 min-h-[50px]">
                    {item?.name || "Untitled Course"}
                </h1>

 { ((isEnrolled || isProfile) && user?.role !== "teacher" && user?.role !== "admin") ? (
                    <div className="w-full flex items-center justify-between pt-3">
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-[#39c1f3] text-white text-[12px] font-bold rounded-full uppercase tracking-wider">
                                {item.price === 0 && !isActuallyEnrolled ? "Start Free Course" : "Enrolled"}
                             </div>
                        </div>
                        <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-lg text-blue-600 dark:text-blue-400 text-[13px] font-semibold">
                            {item.price === 0 && !isActuallyEnrolled ? "Access Now" : "Study Now"} &rarr;
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-full flex items-center justify-between pt-2">
                            <Ratings rating={item?.ratings || 0} />
                            <h5
                                className={`text-black dark:text-[#fff] text-sm ${isProfile && "hidden 800px:inline"
                                    }`}
                            >
                                {item?.purchased || 0} Students
                            </h5>
                        </div>

                        <div className="w-full flex items-center justify-between pt-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-black dark:text-[#fff] font-bold text-lg">
                                    {item?.price === 0 ? "Free" : `Rs. ${item?.price || 0}`}
                                </h3>

                                {item?.estimatedPrice && item?.estimatedPrice > 0 && (
                                    <h5 className="text-[14px] line-through opacity-60 text-black dark:text-[#fff]">
                                        Rs. {item?.estimatedPrice}
                                    </h5>
                                )}
                            </div>

                            <div className="flex items-center">
                                <AiOutlineUnorderedList size={20} className="text-black dark:text-[#fff]" />
                                <h5 className="pl-2 text-black dark:text-[#fff] text-sm">
                                    {item?.courseData?.length || 0} {item?.courseData?.length === 1 ? "Lecture" : "Lectures"}
                                </h5>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Link>
    )
}

export default CourseCard