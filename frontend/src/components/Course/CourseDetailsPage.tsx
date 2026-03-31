import { useGetCourseDetailsQuery, useLogCourseViewMutation } from '@/redux/features/courses/coursesApi';
import React, { useEffect, useState, useRef } from 'react'
import Loader from '../Loader/Loader';
import Heading from '@/utils/Heading';
import Header from './../Header';
import Footer from '../Footer';
import CourseDetails from './CourseDetails';
import { useCreatePaymentIntentMutation, useGetStripePublishkeyQuery, useCreateOrderMutation } from '@/redux/features/orders/orderApi';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";

const ENDPOINT = import.meta.env.VITE_SOCKET_SERVER_URI || "";

const socketId = io(ENDPOINT, {
    transports: ["websocket"],
});

type Props = {
    id: string;
}

const CourseDetailsPage = ({ id }: Props) => {
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useGetCourseDetailsQuery(id);
    useGetStripePublishkeyQuery({});

    const [createPaymentIntent, { data: paymentIntentData }] = useCreatePaymentIntentMutation();
    const [createOrder, { data: orderData, error: orderError }] = useCreateOrderMutation();
    const { data: userData } = useLoadUserQuery(undefined, { refetchOnMountOrArgChange: true });
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const processedPidxRef = useRef<string | null>(null);

    const [stripePromise, setStripePromise] = useState<any>(null);
    const [clientSecret, setClientSecret] = useState('');
    const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false);
    
    const [logCourseView] = useLogCourseViewMutation();

    useEffect(() => {
        if (data?.course && userData?.user) {
            logCourseView({ courseId: id });
        }
    }, [data, userData, id]);

    useEffect(() => {
        if (data && data.course.price > 0) {
            const amount = Math.round(data.course.price * 100);
            createPaymentIntent({ amount, courseId: data.course._id });
        }
    }, [data]);

    useEffect(() => {
        if (paymentIntentData) {
            setClientSecret(paymentIntentData?.client_secret);
            if (paymentIntentData?.payment_url) {
                setStripePromise(paymentIntentData.payment_url);
            }
        }
    }, [paymentIntentData]);

    useEffect(() => {
        const pidx = searchParams.get('pidx');
        if (!pidx || !data?.course?._id) return;
        if (processedPidxRef.current === pidx) return;
        processedPidxRef.current = pidx;
        createOrder({ courseId: data.course._id, payment_info: { pidx } });
    }, [searchParams, data, createOrder]);

    useEffect(() => {
        if (orderData && data?.course?._id) {
            const u = userData?.user;
            socketId.emit("notification", {
                title: "New Order",
                message: `You have a new order from ${data.course.name}`,
                userId: u?._id,
            });
            setIsPaymentSuccessOpen(true);
            setTimeout(() => {
                navigate(`/course-access/${data.course._id}`, { replace: true });
            }, 4000);
        }
    }, [orderData, data, userData, navigate]);

    useEffect(() => {
        if (orderError && "data" in orderError) {
            const err = orderError as any;
            toast.error(err.data?.message || "Order failed");
        }
    }, [orderError]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <Heading
                        title={data.course.name + "-SmartLearn"}
                        description={
                            "SmartLearn is the elearning platform"
                        }
                        keywords={data?.course?.tags}
                    />

                    <Header
                        route={route}
                        setRoute={setRoute}
                        open={open}
                        setOpen={setOpen}
                        activeItem={1}
                    />

                    {
                        data && (
                            <CourseDetails
                                data={data.course}
                                stripePromise={stripePromise}
                                clientSecret={clientSecret}
                                setOpen={setOpen}
                                setRoute={setRoute}
                            />
                        )
                    }

                    <Footer />

                    {isPaymentSuccessOpen && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300">
                            <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-2xl flex flex-col items-center justify-center w-[90%] md:w-[500px]">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">Payment Successful!</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-center mb-6 text-lg">Thank you for enrolling. You now have full access to this course.</p>
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite]"></div>
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_200ms]"></div>
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_400ms]"></div>
                                </div>
                                <p className="mt-4 text-sm text-gray-400 dark:text-gray-500 font-medium">Redirecting to course access...</p>
                            </div>
                        </div>
                    )}
                </div>

            )
            }

        </>
    )
}

export default CourseDetailsPage
