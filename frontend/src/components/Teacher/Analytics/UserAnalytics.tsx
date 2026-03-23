"use client"
import { useGetUsersAnaltyicsQuery } from '@/redux/features/analytics/analyticsApi';
import React from 'react'
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    AreaChart,
    Area,
    Tooltip,
} from "recharts";
import Loader from '../../Loader/Loader';
import { styles } from '@/styles/style';

type Props = {
    isDashboard?:boolean;
}

const UserAnalytics = ({isDashboard}: Props) => {

    const {data, isLoading} = useGetUsersAnaltyicsQuery({});


    // const analyticsData=[
    //     {name:"Jan 2023", count:440},
    //     {name:"Feb 2023", count:440},
    //     {name:"March 2023", count:440},
    //     {name:"Apr 2023", count:440},
    //     {name:"May 2023", count:440},
    //     {name: "Jun 2023", count:300},
    //     {name: "July 2023", count:240},
    //     {name: "Aug 2023", count:560},
    //     {name: "Sep 2023", count:150},
    //     {name: "Oct 2023", count:685},
    //     {name: "Nov 2023", count:520},
    //     {name: "Dec 2023", count:700},
    // ]

   const analyticsData = data?.users?.last12Months?.map((item: any) => ({
        name: item.month,
        count: item.count,
    })) ?? [];

  return (
    <>
        {
            isLoading ? 
            (
                <Loader/>
            ): (
                    <div className={`${isDashboard ? "mt-[50px]" : "mt-[50px]"} dark:bg-[#111C43] shadow-sm pb-5 rounded-sm`}>
                        <div className={`${isDashboard ? "ml-8 mb-5" : ""}`}>
                            <h1 className={`${styles.title} ${isDashboard && "!text-[20px]"} px-5 !text-start`}>
                                Users Analytics
                            </h1>

                            {!isDashboard && (
                            <p className={`${styles.label} px-5`}>
                                Last 12 months analytics data{" "}
                            </p>
                            )}
                        </div>

                        <div className={`w-full ${isDashboard ? "h-[30vh]" : "h-screen"} flex items-center justify-center`}>
                            <ResponsiveContainer width={isDashboard ? "100%" : "90%"} height={isDashboard ? "50%" : "100%"}>
                                <AreaChart
                                    data={analyticsData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#4d62d9"
                                        fill="#4d62d9"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )
        }
    
    </>
  )
}

export default UserAnalytics
