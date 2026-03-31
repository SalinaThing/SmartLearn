import { useGetCoursesAnalyticsQuery } from '@/redux/features/analytics/analyticsApi';
import React from 'react'
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import Loader from '../../Loader/Loader';
import { styles } from '@/styles/style';

type Props = {
    isDashboard?: boolean;
}

const CourseAnalytics = ({ isDashboard }: Props) => {
    const { data, isLoading } = useGetCoursesAnalyticsQuery({});

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
                    <Loader />
                ) : (
                    <div className={`${isDashboard ? "h-[450px] overflow-visible pb-10" : "h-[70vh]"} w-full`}>
                        <div className={`${isDashboard ? "mt-0" : "mt-0"}`}>
                            <h1 className={`${styles.title} px-5 !text-start ${isDashboard && "!text-[24px]"}`}>
                                Courses Analytics
                            </h1>

                            <p className={`${styles.label} px-5`}>
                                Last 12 months analytics data{" "}
                            </p>
                        </div>

                        <div className="w-full h-full flex items-center justify-center">
                            <ResponsiveContainer width={isDashboard ? "100%" : "95%"} height={isDashboard ? "100%" : "80%"}>
                                <BarChart data={analyticsData} margin={{ top: 20, right: 30, left: 10, bottom: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDashboard ? "#ffffff10" : "#00000010"} />
                                    <XAxis dataKey="name" tick={{ fontSize: isDashboard ? 10 : 12 }} interval={0} height={60} />
                                    <YAxis domain={[minValue, "auto"]} tick={{ fontSize: isDashboard ? 10 : 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#111C43",
                                            border: "none",
                                            borderRadius: "8px",
                                            color: "#fff",
                                        }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                    <Bar dataKey="count" fill="#3faf82" radius={[4, 4, 0, 0]} />
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
