"use client"
import { useGetOrdersAnaltyicsQuery } from '@/redux/features/analytics/analyticsApi';
import React from 'react'
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    LineChart,
    CartesianGrid,
    Tooltip,
    Legend,
    Line,
} from "recharts";
import Loader from '../../Loader/Loader';
import { styles } from '@/styles/style';

// const analyticsData =[
//   {
//     name:"Page A",
//     count: 4000,
//   },
//   {
//     name:"Page B",
//     count: 3000,
//   },
//   {
//     name:"Page C",
//     count: 1000,
//   },
//   {
//     name:"Page D",
//     count: 4000,
//   },
//   {
//     name:"Page E",
//     count: 400,
//   },
//   {
//     name:"Page F",
//     count: 1100,
//   },
// ]

type Props = {
  isDashboard?:boolean;
}

const OrderAnalytics = ({isDashboard}: Props) => {
  const {isLoading, data} = useGetOrdersAnaltyicsQuery({});

  const analyticsData = data?.orders?.map((item: any) => ({
    name: item.monthYear,
    count: item.count,
  })) ?? [];

  return (
    <>
      { 
        isLoading ? 
        (
          <Loader/>
        ): (
          <div className={isDashboard ? "h-[30vh]" : "h-screen"}>
            <div
              className={
                isDashboard ? "mt-[0px] pl-[40px] mb-2" : "mt-[50px]"
              }
            >
              <h1
                className={`${styles.title} ${
                  isDashboard && "!text-[20px]"
                } px-5 !text-start`}
              >
                Orders Analytics
              </h1>

              {!isDashboard && (
                <p className={`${styles.label} px-5`}>
                  Last 12 months analytics data{" "}
                </p>
              )}
            </div>

            <div
              className={`w-full ${
                isDashboard ? "h-[90%]" : "h-full"
              } flex items-center justify-center`}
            >
              <ResponsiveContainer
                width={isDashboard ? "100%" : "90%"}
                height={isDashboard ? "100%" : "50%"}
              >
                <LineChart
                  width={500}
                  height={300}
                  data={analyticsData}
                  margin={{
                    top:5,
                    right:30,
                    left:20,
                    bottom:5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                    {
                      !isDashboard && <Legend/>
                    }
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#82ca9d"
                    fill="#4d62d9"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      }
    
    </>
  )
}

export default OrderAnalytics
