import { useGetCoursesAnaltyicsQuery } from '@/redux/features/analytics/analyticsApi';
import React from 'react'
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Label,
    LabelList,
} from "recharts";
import Loader from '../../Loader/Loader';
import { styles } from '@/styles/style';

type Props = {}

const CourseAnalytics = (props: Props) => {
    const {data, isLoading} = useGetCoursesAnaltyicsQuery({});
    
    // const analyticsData=[
    //     {name: "Jun 2023", uv:3},
    //     {name: "July 2023", uv:2},
    //     {name: "Aug 2023", uv:5},
    //     {name: "Sep 2023", uv:1},
    //     {name: "Oct 2023", uv:6},
    //     {name: "Nov 2023", uv:5},
    //     {name: "Dec 2023", uv:7},
    // ]

    const analyticsData = data?.courses?.map((item: any) => ({
        name: item.monthYear,
        count: item.count,
    })) ?? [];

    const minValue = 0;


  return (
    <>
        {
            isLoading ? (
                <Loader/>
            ): (
                <div className="h-screen">
                    <div className="mt-[50px]">
                        <h1 className={`${styles.title} px-5 !text-start`}>
                        Courses Analytics
                        </h1>

                        <p className={`${styles.label} px-5`}>
                        Last 12 months analytics data{" "}
                        </p>
                    </div>

                    <div className="w-full h-[90%] flex items-center justify-center">
                        <ResponsiveContainer width="90%" height="50%">
                        <BarChart width={150} height={300} data={analyticsData}>
                            <XAxis dataKey="name">
                            <Label offset={0} position="insideBottom" />
                            </XAxis>

                            <YAxis domain={[minValue, "auto"]} />

                            <Bar dataKey="count" fill="#3faf82">
                            <LabelList dataKey="count" position="top" />
                            </Bar>
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
               
            )
        }
    </>
  )
}

export default CourseAnalytics
