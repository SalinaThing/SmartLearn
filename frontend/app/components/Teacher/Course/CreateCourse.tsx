'use client'

import React, { useEffect, useState } from 'react'
import CourseInformation from './CourseInformation';
import CourseOptions from "./CourseOptions";
import CourseData from './CourseData';
import CourseContent from './CourseContent';
import CoursePreview from './CoursePreview';
import { useCreateCourseMutation } from '@/redux/features/courses/coursesApi';
import { toast } from 'react-hot-toast';
import { redirect } from 'next/navigation';

type Props = {}

const CreateCourse = (props: Props) => {

    const [createCourse, {isLoading, isSuccess, error}] = useCreateCourseMutation();

    useEffect(() => {
        if(isSuccess){
            toast.success("Course created successfully");
            redirect("/teacher/courses");
        }
        if(error){
            if("data" in error){
                const errorMessage = error as any;
                toast.error(errorMessage.data.message )
            }
        }

    }, [isSuccess, isLoading, error]);

    const [active, setActive] = useState(0);
    const [courseInfo, setCourseInfo] = useState({
        name: "", 
        description: "",
        categories:"",
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
            videoLength:"",
            links: [
                {
                    title:"",
                    url:"",
                },
            ],
            suggestion:"",
        },
    ]);

    const [courseData, setCourseData] = useState({});

    const prepareCoursePayload = () => {
        const formattedBenefits = benefits.map((benefit) => ({ title: benefit.title }));
        const formattedPrerequisites = prerequisites.map((prerequisite) => ({ title: prerequisite.title }));

        const formattedCourseContentData = courseContentData.map((courseContent) => ({
            videoUrl: courseContent.videoUrl,
            title: courseContent.title,
            description: courseContent.description,
            videoLength: courseContent.videoLength,
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

    console.log(courseData);

    const handleCourseCreate = async () => {
        const data = prepareCoursePayload();
        setCourseData(data);

        if (!data.name || !data.description || !data.categories || !data.price || !data.tags || !data.level || !data.demoUrl || !data.thumbnail) {
            toast.error('Please fill all required course fields before creating.');
            return;
        }

        if (!isLoading) {
            try {
                await createCourse(data).unwrap();
            } catch (apiError: any) {
                const message = apiError?.data?.message || apiError?.error || 'Course creation failed';
                toast.error(message);
            }
        }
    };

  return (
    <div className="w-full flex min-h-screen">

        {/* Course Information */}
        <div className="w-[80%]">
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
                    />
                )
            }


        </div>

        <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
            <CourseOptions 
                active={active}
                setActive={setActive} 
            />

        </div>
    </div>
  )
}

export default CreateCourse