import { styles } from '@/styles/style';
import CoursePlayer from '@/utils/CoursePlayer';
import Ratings from '@/utils/Ratings';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import React, { useEffect, useState } from 'react'
import { IoCheckmarkDoneCircleOutline, IoCloseOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import CourseContentList from './CourseContentList';
import CheckOutForm from "../Payment/CheckOutForm";
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import Image from '@/utils/Image';
import { VscVerifiedFilled } from 'react-icons/vsc';

type Props = {
    data:any;
    clientSecret:string;
    stripePromise:any;
    setRoute:any;
    setOpen:any;
}

const CourseDetails = ({data, stripePromise, clientSecret, setRoute, setOpen:openAuthModal}: Props) => {
    const {data: userData} = useLoadUserQuery(undefined, {});
    // const user=userData?.user;
    const[user, setUser] = useState<any>();
    const [open, setOpen] = useState(false);

    const discountPercentage =
        ((data?.estimatedPrice - data.price) / data?.estimatedPrice) * 100;

    const discountPercentagePrice = discountPercentage.toFixed(0);

    const isPurchased =
        user && user?.courses?.find((item: any) =>  item._id === data._id);

    useEffect(() => {
        setUser(userData?.user)
    }, [userData])

    const handleOrder = (e: any) => {
        if(user){
            if (data.price > 0) {
                setOpen(true);
            }
        }else{
            setRoute("Login");
            openAuthModal(true);
        }
    };

    return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="w-[90%] 800px:w-[90%] mx-auto py-5">
            <div className="w-full flex flex-col-reverse 800px:flex-row gap-8">
                <div className="w-full 800px:w-[65%] 800px:pr-5">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h1 className="text-[28px] font-Poppins font-bold text-gray-900 dark:text-white mb-4">
                            {data.name}
                        </h1>

                        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <Ratings rating={data.ratings} />
                                <span className="text-gray-600 dark:text-gray-400 text-sm">
                                    ({data.reviews?.length} Reviews)
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 dark:text-gray-400">👥</span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {data.purchased} Students Enrolled
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-[22px] font-Poppins font-semibold text-gray-900 dark:text-white mb-4">
                                What you will learn from this course?
                            </h2>
                            <div className="space-y-3">
                                {data.benefits?.map((item:any, index:number) =>(
                                    <div className="flex items-start gap-2" key={index}>
                                        <div className="flex-shrink-0 mt-1">
                                            <IoCheckmarkDoneCircleOutline size={20} className="text-emerald-500 dark:text-emerald-400" />
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">{item.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-[22px] font-Poppins font-semibold text-gray-900 dark:text-white mb-4">
                                Prerequisites for this course
                            </h2>
                            <div className="space-y-3">
                                {data.prerequisites?.map((item:any, index:number) =>(
                                    <div className="flex items-start gap-2" key={index}>
                                        <div className="flex-shrink-0 mt-1">
                                            <IoCheckmarkDoneCircleOutline size={20} className="text-emerald-500 dark:text-emerald-400" />
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">{item.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-[22px] font-Poppins font-semibold text-gray-900 dark:text-white mb-4">
                                Course Overview
                            </h2>
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <CourseContentList
                                    data = {data?.courseData}
                                    isDemo={true}
                                />
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-[22px] font-Poppins font-semibold text-gray-900 dark:text-white mb-4">
                                Course Description
                            </h2>
                            <div className="prose prose-gray dark:prose-invert max-w-none">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {data.description}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <Ratings rating={data?.ratings} />
                                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {Number.isInteger(data?.ratings) ? data?.ratings.toFixed(1) : data?.ratings?.toFixed(2)} 
                                    Course Rating
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                    · {data?.reviews?.length} Reviews
                                </span>
                            </div>

                            {(
                                data?.reviews ? [...data.reviews].reverse() : []
                            ).map((item: any, index: number) => (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4" key={index}>
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0">
                                            <Image
                                                src={
                                                    item.user.avatar
                                                        ? item.user.avatar.url
                                                        : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                                }
                                                width={50}
                                                height={50}
                                                alt=""
                                                className="w-[50px] h-[50px] rounded-full object-cover"
                                            /> 
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h5 className="text-[16px] font-semibold text-gray-900 dark:text-white">
                                                    {item.user.name}
                                                </h5>
                                                <Ratings rating={item.rating} />
                                            </div>

                                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                                {item.comment}
                                            </p>

                                            <small className="text-gray-500 dark:text-gray-400">
                                                {format(item.createdAt)}
                                            </small>
                                        </div>
                                    </div>

                                    {/* Replies Section */}
                                    {item.commentReplies?.map((reply: any, replyIndex: number) => (
                                        <div className="ml-12 mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700" key={replyIndex}>
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0">
                                                    <Image
                                                        src={
                                                            reply.user.avatar
                                                                ? reply.user.avatar.url
                                                                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                                        }
                                                        width={40}
                                                        height={40}
                                                        alt=""
                                                        className="w-[40px] h-[40px] rounded-full object-cover"
                                                    />
                                                </div>
                                        
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h5 className="text-[15px] font-semibold text-gray-900 dark:text-white">
                                                            {reply.user.name}
                                                        </h5>
                                                        <VscVerifiedFilled className="text-emerald-500 text-[16px]" />
                                                    </div>
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
                                                        {reply.comment}
                                                    </p>
                                                    <small className="text-gray-500 dark:text-gray-400 text-xs">
                                                        {format(reply.createdAt)}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>   
                    </div>
                </div>
                
                {/* Sidebar */}
                <div className="w-full 800px:w-[35%]">
                    <div className="sticky top-[100px]">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                            <div className="relative">
                                <CoursePlayer
                                    videoUrl={data?.demoUrl}
                                    title={data?.title}
                                />
                            </div>

                            <div className="p-6">
                                <div className="flex items-baseline gap-3 mb-4">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {data.price === 0 ? "Free" : `Rs. ${data.price}`}
                                    </span>
                                    {data.estimatedPrice > data.price && (
                                        <>
                                            <span className="text-lg text-gray-500 line-through">
                                                Rs. {data.estimatedPrice}
                                            </span>
                                            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold rounded-full">
                                                {discountPercentagePrice}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                                
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                                        <span>💻</span>
                                        <span>Source code included</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                                        <span>🔓</span>
                                        <span>Full lifetime access</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                                        <span>📱</span>
                                        <span>Access on mobile and TV</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                                        <span>🎧</span>
                                        <span>Premium Support</span>
                                    </div>
                                </div>

                                {isPurchased ? (
                                    <Link
                                        className={`${styles.button} w-full text-center !bg-gradient-to-r !from-emerald-500 !to-green-600 hover:shadow-lg transition-all`}
                                        to={`/course-access/${data._id}`}
                                    >
                                        Enter to Course
                                    </Link>
                                ) : (
                                    <button
                                        className={`${styles.button} w-full !bg-gradient-to-r !from-[#crimson] !to-red-600 hover:shadow-lg transition-all`}
                                        onClick={handleOrder}
                                    >
                                        Buy Now - Rs. {data.price}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        </div>

        {/* Dialog after Buy Button click */}
        {open && data.price > 0 && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Complete Your Purchase
                        </h3>
                        <button
                            onClick={() => setOpen(false)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <IoCloseOutline size={24} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="p-6">
                        {stripePromise && clientSecret && (
                            <CheckOutForm
                                setOpen={setOpen}
                                data={data}
                                user={user}
                                stripePromise={stripePromise}
                                clientSecret={clientSecret}
                            />
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
    );
}

export default CourseDetails