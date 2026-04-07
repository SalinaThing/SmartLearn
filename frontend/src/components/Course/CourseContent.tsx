import { useGetCourseContentsQuery, useUpdateCourseProgressMutation } from '@/redux/features/courses/coursesApi';
import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import Heading from '@/utils/Heading';
import CourseContentMedia from './CourseContentMedia';
import Header from '../Header';
import CourseContentList from './CourseContentList';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useNavigate } from 'react-router-dom';

type Props = {
    id: string;
}

const CourseContent = ({ id }: Props) => {
    const { data: userData } = useLoadUserQuery(undefined, {});
    const { data, isLoading, error, refetch } = useGetCourseContentsQuery(id);
    const [updateCourseProgress] = useUpdateCourseProgressMutation();
    const navigate = useNavigate();
    const [activeVideo, setActiveVideo] = useState(0);
    
    useEffect(() => {
        if (error) {
            navigate("/");
        }
    }, [error, navigate]);
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");

    const [completedLessons, setCompletedLessons] = useState<string[]>([]);

    useEffect(() => {
        if (userData?.user?.courses && id) {
            const courseProgress = userData.user.courses.find((c: any) => c.courseId === id);
            if (courseProgress?.completedLessons) {
                setCompletedLessons(courseProgress.completedLessons);
            }
        }
    }, [userData, id]);

    useEffect(() => {
        if (data && data.content && data.content[activeVideo]) {
            const currentContentId = data.content[activeVideo]._id;
            
            if (currentContentId && !completedLessons.includes(currentContentId)) {
                // Update local state smoothly
                setCompletedLessons(prev => [...prev, currentContentId]);
                
                // Fire off the API to update database
                updateCourseProgress({
                    courseId: id,
                    contentId: currentContentId
                }).catch((err) => console.log("Failed to update progress", err));
            }
        }
    }, [activeVideo, data, id, updateCourseProgress, completedLessons]);

    // Calculate progress percentage
    const totalLessons = data?.content?.length || 0;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
    const isCompleted = progressPercentage === 100;

    const downloadCertificate = () => {
        const studentName = userData?.user?.name || "Student Name";
        const courseName = "SmartLearn Online Course"; // Fallback name
        const date = new Date().toLocaleDateString();

        const certificateHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; background-color: #f3f4f6; margin: 0; padding: 20px; }
                    .cert-container { background: white; max-width: 800px; margin: 0 auto; padding: 50px; border: 10px solid #1e40af; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: relative; overflow: hidden; }
                    .header { font-size: 48px; color: #1e40af; font-weight: bold; margin-bottom: 20px; letter-spacing: 2px; }
                    .subheader { font-size: 24px; color: #4b5563; margin-bottom: 40px; }
                    .student-name { font-size: 40px; color: #111827; font-weight: bold; margin: 20px 0; border-bottom: 2px solid #e5e7eb; display: inline-block; padding-bottom: 10px; min-width: 300px; }
                    .course-text { font-size: 20px; color: #6b7280; margin: 30px 0 10px; }
                    .course-name { font-size: 28px; color: #2563eb; font-weight: bold; margin-bottom: 50px; }
                    .footer { display: flex; justify-content: space-between; margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
                    .date, .signature { text-align: center; }
                    .date div, .signature div { border-top: 1px solid #9ca3af; padding-top: 5px; margin-top: 30px; font-size: 16px; color: #4b5563; }
                    .logo-placeholder { font-size: 24px; font-weight: bold; color: #1e40af; margin-bottom: 30px; display: flex; align-items: center; justify-content: center; gap: 10px; }
                    .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(30, 64, 175, 0.03); white-space: nowrap; pointer-events: none; }
                </style>
            </head>
            <body>
                <div class="cert-container">
                    <div class="watermark">SMARTLEARN</div>
                    <div class="logo-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                        </svg>
                        SmartLearn
                    </div>
                    <div class="header">CERTIFICATE</div>
                    <div class="subheader">OF COMPLETION</div>
                    <div style="font-size: 18px; color: #6b7280;">This is to proudly certify that</div>
                    <div class="student-name">${studentName}</div>
                    <div class="course-text">has successfully completed the online course</div>
                    <div class="course-name">${courseName}</div>
                    <div class="footer">
                        <div class="date">
                            <strong>${date}</strong>
                            <div>Date of Completion</div>
                        </div>
                        <div class="signature">
                            <div style="font-family: 'Brush Script MT', cursive; font-size: 28px; border: none; margin-top: -10px; padding: 0;">SmartLearn Admin</div>
                            <div>Authorized Signature</div>
                        </div>
                    </div>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;

        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(certificateHtml);
            newWindow.document.close();
        }
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Header activeItem={1} open={open} setOpen={setOpen} route={route} setRoute={setRoute} />
                    <div className="w-full grid 800px:grid-cols-10">
                        <Heading
                            title={data?.content?.[activeVideo]?.title}
                            description="anything"
                            keywords={data?.content?.[activeVideo]?.tags || ""}
                        />
                        <div className="col-span-7">
                            {/* Course Progress Header Section - ONLY for Students */}
                            {userData?.user?.role === "student" && (
                                <div className="w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
                                    <div className="flex-1 w-full max-w-md">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Progress</span>
                                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{progressPercentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                                        </div>
                                    </div>
                                    {isCompleted && (
                                        <button
                                            onClick={downloadCertificate}
                                            className="ml-4 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-Poppins font-medium transition-colors shadow-sm animate-[pulse_2s_infinite]"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.984 3.984 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L5.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.984 3.984 0 014 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L8 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
                                            </svg>
                                            Certificate
                                        </button>
                                    )}
                                </div>
                            )}
                            
                            <CourseContentMedia
                                data={data?.content}
                                id={id}
                                activeVideo={activeVideo}
                                setActiveVideo={setActiveVideo}
                                user={userData?.user}
                                refetch={refetch}
                            />
                        </div>

                        <div className="hidden 800px:block 800px:col-span-3">
                            <CourseContentList
                                setActiveVideo={setActiveVideo}
                                data={data?.content}
                                activeVideo={activeVideo}
                                completedLessons={completedLessons}
                            />

                        </div>

                    </div>
                </>

            )}

        </>
    )

}

export default CourseContent
