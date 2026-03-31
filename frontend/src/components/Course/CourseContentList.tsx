import React, { FC, useState } from 'react'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { MdOutlineOndemandVideo, MdCheckCircle } from 'react-icons/md'

type Props = {
    data: any;
    activeVideo?: number;
    setActiveVideo?: any;
    isDemo?: boolean;
    completedLessons?: string[];
}

const CourseContentList: FC<Props> = (props) => {
    const [visibleSections, setVisibleSections] = useState<Set<string>>(
        new Set<string>()
    );

    const videoSections: string[] = [
        ...new Set<string>(props.data?.map((item: any) => item.videoSection))
    ];

    let totalCount: number = 0; //to keep track of cumultive video count

    const toggleSection = (section: string) => {
        const newVisibleSections = new Set(visibleSections);
        if (newVisibleSections.has(section)) {
            newVisibleSections.delete(section);
        } else {
            newVisibleSections.add(section);
        }
        setVisibleSections(newVisibleSections);
    };

    return (
        <div className={`mt-[15px] w-full ${!props.isDemo && 'ml-[-30px] min-h-screen sticky top-24'}`}>
            {videoSections.map((section: string, sectionIndex: number) => {
                const isSectionVisible = visibleSections.has(section);
                const sectionVideos: any[] = props.data.filter((item: any) => item.videoSection === section);

                const sectionVideoCount: number = sectionVideos.length;
                const sectionVideoLength: number = sectionVideos.reduce(
                    (totalLength: number, item: any) => totalLength + item.videoLength,
                    0
                );
                const sectionStartIndex: number = totalCount;
                totalCount += sectionVideoCount;
                const sectionVideoHours: number = sectionVideoLength / 60;

                return (
                    <div className={`${!props.isDemo && 'border-b border-[#0000001c] dark:border-[#ffffff8e] pb-2'}`} key={section}>
                        <div className="w-full flex">
                            <div className="w-full flex justify-between items-center bg-gray-50 dark:bg-slate-800 p-3 rounded-md shadow-sm mb-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
                                onClick={() => toggleSection(section)}
                            >
                                <h2 className="text-[18px] text-black dark:text-white font-Poppins font-semibold">{section}</h2>
                                <button className="mr-4 cursor-pointer text-black dark:text-white">
                                    {isSectionVisible ? (
                                        <BsChevronUp size={20} />
                                    ) : (
                                        <BsChevronDown size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <h5 className="text-black dark:text-white pb-2 pl-2">
                            {sectionVideoCount} Lessons .{" "}
                            {sectionVideoLength < 60
                                ? sectionVideoLength
                                : sectionVideoHours.toFixed(2)}{" "}
                            {sectionVideoLength > 60 ? "hours" : "minutes"}
                        </h5>

                        {isSectionVisible && (
                            <div className="w-full pl-2">
                                {sectionVideos.map((item: any, index: number) => {
                                    const videoIndex: number = sectionStartIndex + index;
                                    const contentLength: number = item.videoLength / 60;
                                    const isCompleted = props.completedLessons?.includes(item._id);

                                    return (
                                        <div
                                            className={`w-full flex flex-col p-3 rounded-md mb-2 cursor-pointer transition-all ${
                                                videoIndex === props.activeVideo 
                                                ? "bg-blue-50/50 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-900 shadow-sm"
                                                : "hover:bg-gray-50 dark:hover:bg-slate-800"
                                            }`}
                                            key={item._id}
                                            onClick={() => props.isDemo ? null : props?.setActiveVideo(videoIndex)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 flex-shrink-0 relative">
                                                    {isCompleted && !props.isDemo && (
                                                        <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full">
                                                            <MdCheckCircle className="text-green-500" size={14} />
                                                        </div>
                                                    )}
                                                    <MdOutlineOndemandVideo
                                                        size={25}
                                                        className="dark:text-white text-black cursor-pointer"
                                                        color={videoIndex === props.activeVideo ? "#2563eb" : (isCompleted && !props.isDemo ? "#22c55e" : "#1cdada")}
                                                    />
                                                </div>
                                                <div className="flex-1 w-full overflow-hidden">
                                                    <h1 className={`text-[16px] leading-[1.4] font-Poppins ${
                                                        videoIndex === props.activeVideo 
                                                        ? "font-semibold text-blue-600 dark:text-blue-400" 
                                                        : (isCompleted && !props.isDemo ? "text-gray-600 dark:text-gray-300 font-medium" : "text-black dark:text-white")
                                                    }`}>
                                                        {item.title}
                                                    </h1>
                                                    
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                            {item.videoLength > 60
                                                                ? `${contentLength.toFixed(2)} hours`
                                                                : `${item.videoLength} minutes`}
                                                        </span>
                                                        {isCompleted && !props.isDemo && (
                                                            <span className="text-[11px] font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 rounded-sm">
                                                                Completed
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default CourseContentList
