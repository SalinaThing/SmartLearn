'use client'

import React, { useEffect, useState } from 'react'
import CourseInformation from './CourseInformation';
import CourseOptions from "./CourseOptions";
import CourseData from './CourseData';
import CourseContent from './CourseContent';
import CoursePreview from './CoursePreview';
import { useCreateCourseMutation } from '@/redux/features/courses/coursesApi';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type Props = {}

const CreateCourse = (props: Props) => {

    const navigate = useNavigate();
    const [createCourse, { isLoading, isSuccess, error }] = useCreateCourseMutation();

    useEffect(() => {
        if (isSuccess) {
            toast.success("Course created successfully");
            navigate("/teacher/allcourses");
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message)
            }
        }

    }, [isSuccess, isLoading, error]);

    const [active, setActive] = useState(0);
    const [courseInfo, setCourseInfo] = useState({
        name: "",
        description: "",
        categories: "",
        price: "",
        estimatedPrice: "",
        tags: "",
        level: "",
        demoUrl: "",
        thumbnail: "",
        isPremium: true,
    });

    const [benefits, setBenefits] = useState([{ title: "" }]);
    const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
    const [courseContentData, setCourseContentData] = useState([
        {
            videoUrl: "",
            title: "",
            description: "",
            videoSection: "Untitled Section",
            videoLength: "",
            pdfUrl: "",
            pdfName: "",
            suggestion: "",
        },
    ]);

    const [courseData, setCourseData] = useState({});

    const prepareCoursePayload = () => {
        const formattedBenefits = benefits
            .filter(b => b.title.trim() !== "")
            .map((benefit) => ({ title: benefit.title }));

        const formattedPrerequisites = prerequisites
            .filter(p => p.title.trim() !== "")
            .map((prerequisite) => ({ title: prerequisite.title }));

        const formattedCourseContentData = courseContentData.map((courseContent) => ({
            videoUrl: courseContent.videoUrl,
            title: courseContent.title,
            description: courseContent.description,
            videoLength: courseContent.videoLength ? Number(courseContent.videoLength) : 0,
            videoSection: courseContent.videoSection,
            pdfUrl: courseContent.pdfUrl || "",
            pdfName: courseContent.pdfName || "",
            links: (courseContent as any).links?.map((link: any) => ({
                title: link.title,
                url: link.url,
            })) || [],
            suggestion: (courseContent as any).suggestion || "",
        }));

        return {
            name: courseInfo.name,
            description: courseInfo.description,
            categories: courseInfo.categories,
            price: courseInfo.isPremium === false ? 0 : (courseInfo.price === "" ? 0 : Number(courseInfo.price)),
            estimatedPrice: courseInfo.estimatedPrice === "" ? 0 : Number(courseInfo.estimatedPrice),
            tags: courseInfo.tags,
            level: courseInfo.level,
            demoUrl: courseInfo.demoUrl,
            thumbnail: courseInfo.thumbnail,
            isPremium: courseInfo.isPremium,
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

        const isEmpty = (val: any) => val === undefined || val === null || val === "";

        let missingFields = [];
        if (isEmpty(data.name)) missingFields.push("Course Name");
        if (isEmpty(data.description)) missingFields.push("Description");
        if (isEmpty(data.categories)) missingFields.push("Category");
        if (data.price === undefined || data.price === null) missingFields.push("Price");
        if (isEmpty(data.tags)) missingFields.push("Tags");
        if (isEmpty(data.level)) missingFields.push("Course Level");
        if (isEmpty(data.demoUrl)) missingFields.push("Demo URL");

        if (missingFields.length > 0) {
            toast.error(`Please fill missing fields: ${missingFields.join(", ")}`);
            return;
        }

        try {
            await createCourse(data).unwrap();
        } catch (apiError: any) {
            const message = apiError?.data?.message || apiError?.error || 'Course creation failed';
            toast.error(message);
        }
    };

    return (
        <div className="w-full flex min-h-screen">

            {/* Course Information */}
            <div className="w-full 1100px:w-[80%] 1100px:pr-[10%]">
                {
                    active === 0 && (
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
                    active === 1 && (
                        <CourseData
                            benefits={benefits}
                            setBenefits={setBenefits}
                            prerequisites={prerequisites}
                            setPrerequisites={setPrerequisites}
                            active={active}
                            setActive={setActive}
                        />
                    )
                }

                {/* Course content */}
                {
                    active === 2 && (
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
                    active === 3 && (
                        <CoursePreview
                            active={active}
                            setActive={setActive}
                            courseData={courseData}
                            handleCourseCreate={handleCourseCreate}
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

export default CreateCourse
