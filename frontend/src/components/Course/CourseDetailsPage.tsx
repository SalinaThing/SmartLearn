import { useGetCourseDetailsQuery } from '@/redux/features/courses/coursesApi';
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
    id:string;
}

const CourseDetailsPage = ({id}: Props) => {
    const [route, setRoute] = useState("Login");
    const [open, setOpen]= useState(false);
    const {data, isLoading} = useGetCourseDetailsQuery(id);
    useGetStripePublishkeyQuery({});

    const [createPaymentIntent, {data:paymentIntentData}]= useCreatePaymentIntentMutation();
    const [createOrder, { data: orderData, error: orderError }] = useCreateOrderMutation();
    const { data: userData } = useLoadUserQuery(undefined, { refetchOnMountOrArgChange: true });
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const processedPidxRef = useRef<string | null>(null);

    const [stripePromise, setStripePromise] = useState<any>(null);
    const [clientSecret, setClientSecret ]= useState('');

    useEffect(() => {
        if (data && data.course.price > 0){
            const amount = Math.round(data.course.price* 100);
            createPaymentIntent({ amount, courseId: data.course._id });
        }
    }, [data]);

    useEffect(() => {
        if(paymentIntentData){
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
            navigate(`/course-access/${data.course._id}`, { replace: true });
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
        { isLoading ? (
                <Loader/>
            ): (
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

                    <Footer/>
                </div>

            )
        }
    
    </>
  )
}

export default CourseDetailsPage
