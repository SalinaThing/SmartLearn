'use client'

import React, { FC, useEffect, useState } from 'react'
import CourseInformation from './CourseInformation';
import CourseOptions from "./CourseOptions";
import CourseData from './CourseData';
import CourseContent from './CourseContent';
import CoursePreview from './CoursePreview';
import { useEditCourseMutation, useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type Props = {
    id: string;
}

const EditCourse:FC <Props> = ({id}) => {
    const navigate = useNavigate();
    // console.log(id); All coppied from CreateCOurse 
    const [editCourse, {isSuccess, error}] = useEditCourseMutation(); 

    const { data, refetch} = useGetAllCoursesQuery(
        {}, 
        { refetchOnMountOrArgChange: true,}
    );

    const editCourseData = data && data.courses.find((i:any) => i._id === id);

    useEffect(() => {
        if(isSuccess){
            toast.success("Course updated successfully");
            navigate("/teacher/allcourses");
        }
        if(error){
            if("data" in error){
                const errorMessage = error as any;
                toast.error(errorMessage.data.message )
            }
        }

    }, [isSuccess, error]);

    const [active, setActive] = useState(0);
    const [courseInfo, setCourseInfo] = useState({
        name: "", 
        description: "",
        categories: "",
        price:"",
        estimatedPrice: "",
        tags: "",
        level:"",
        demoUrl:"",
        thumbnail:"",
    });

    const [benefits, setBenefits] =useState([{title:""}]);
    const [prerequisites, setPrerequisites] = useState([{title:""}]);
    const [courseContentData, setCourseContentData] = useState([
        {
            videoUrl: "",
            title:"",
            description:"",
            videoSection:"Untitled Section",
            links: [
                {
                    title:"",
                    url:"",
                },
            ],
            suggestion:"",
        },
    ]);

    useEffect(() => {
        if(editCourseData){
            setCourseInfo({
                name: editCourseData.name,
                description: editCourseData.description,
                categories: editCourseData.categories,
                price: editCourseData.price,
                estimatedPrice: editCourseData?.estimatedPrice,
                tags: editCourseData.tags,
                level: editCourseData.level,
                demoUrl: editCourseData.demoUrl,
                thumbnail: editCourseData?.thumbnail?.url,
            });
                setBenefits(editCourseData.benefits);
                setPrerequisites(editCourseData.prerequisites);
                setCourseContentData(editCourseData.courseData);
            }
        }, [editCourseData]);

    const [courseData, setCourseData] = useState({});

    const prepareCoursePayload = () => {
        const formattedBenefits = benefits.map((benefit) => ({ title: benefit.title }));
        const formattedPrerequisites = prerequisites.map((prerequisite) => ({ title: prerequisite.title }));

        const formattedCourseContentData = courseContentData.map((courseContent) => ({
            videoUrl: courseContent.videoUrl,
            title: courseContent.title,
            description: courseContent.description,
            videoSection: courseContent.videoSection,
            links: courseContent.links.map((link) => ({
                title: link.title,
                url: link.url,
            })),
            suggestion: courseContent.suggestion,
        }));

        return {
            name: courseInfo.name,
            description: courseInfo.description,
            categories: courseInfo.categories,
            price: Number(courseInfo.price),
            estimatedPrice: Number(courseInfo.estimatedPrice),
            tags: courseInfo.tags,
            level: courseInfo.level,
            demoUrl: courseInfo.demoUrl,
            thumbnail: courseInfo.thumbnail,
            benefits: formattedBenefits,
            prerequisites: formattedPrerequisites,
            courseData: formattedCourseContentData,
            totalVideos: formattedCourseContentData.length,
        };
    };

    const handleSubmit = async () => {
        const data = prepareCoursePayload();
        setCourseData(data);
        return data;
    };

    useEffect(() => {
        if(active === 3) {
            setCourseData(prepareCoursePayload());
        }
    }, [courseInfo, benefits, prerequisites, courseContentData, active]);

    const handleCourseCreate = async () => {
        const data = prepareCoursePayload();
        setCourseData(data);
        try {
            await editCourse({ id: editCourseData?._id, data }).unwrap();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update course content.");
        }
    };

  return (
    <div className="w-full flex min-h-screen">

        {/* Course Information */}
        <div className="w-full 1100px:w-[80%] 1100px:pr-[22%]">
            {
                active === 0 &&(
                    <CourseInformation
                        courseInfo={courseInfo}
                        setCourseInfo={setCourseInfo}
                        active={active}
                        setActive={setActive}
                    />
                )
            }

            {/* Benefits and Pre-requisites */}
            {
                active === 1 &&(
                    <CourseData
                        benefits={benefits}
                        setBenefits={setBenefits}
                        prerequisites= {prerequisites}
                        setPrerequisites= {setPrerequisites}
                        active={active}
                        setActive={setActive}
                    />
                )
            }

            {/* Course content */}
            {
                active === 2 &&(
                    <CourseContent
                        active={active}
                        setActive={setActive}
                        courseContentData={courseContentData}
                        setCourseContentData={setCourseContentData}
                        handleSubmit={handleSubmit}
                     />
                )
            }

            {/* Course Preview */}
            {
                active === 3 &&(
                    <CoursePreview
                        active={active}
                        setActive={setActive}
                        courseData={courseData}
                        handleCourseCreate={handleCourseCreate}
                        isEdit={true}
                    />
                )
            }


        </div>

        <div className="hidden 1100px:block w-[20%] fixed top-[100px] right-0 h-[calc(100vh-100px)] z-[10] pr-6">
            <CourseOptions 
                active={active}
                setActive={setActive} 
            />

        </div>
    </div>
  )
}

export default EditCourse
