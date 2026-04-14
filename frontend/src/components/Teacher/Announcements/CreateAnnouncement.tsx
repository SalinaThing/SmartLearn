import React, { useState, FC } from 'react';
import { useCreateAnnouncementMutation } from '@/redux/features/announcements/announcementApi';
import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import { styles } from '@/styles/style';
import toast from 'react-hot-toast';

type Props = {
    setRoute?: (route: string) => void;
    courseId?: string;
    onSuccess?: () => void;
}

const CreateAnnouncement: FC<Props> = ({ setRoute, courseId, onSuccess }) => {
    const { data: coursesData } = useGetAllCoursesQuery({});
    const [createAnnouncement, { isLoading, isSuccess, error }] = useCreateAnnouncementMutation();

    const [announcement, setAnnouncement] = useState({
        title: "",
        content: "",
        courseId: courseId || "",
        scheduledFor: (() => {
            const now = new Date();
            const pad = (n: number) => String(n).padStart(2, "0");
            return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
        })(),
        validTill: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalCourseId = courseId || announcement.courseId;
        console.log("FRONTEND: handleSubmit triggered", { ...announcement, courseId: finalCourseId });
        
        if (!announcement.title || !announcement.content || !finalCourseId) {
            toast.error("Please fill all fields");
            return;
        }
        if (announcement.validTill && new Date(announcement.validTill) < new Date(announcement.scheduledFor)) {
            toast.error("Visible till must be after publish date/time");
            return;
        }
        try {
            await createAnnouncement({ ...announcement, courseId: finalCourseId });
        } catch (err) {
             // Mutation error handled by RTK state (error/isSuccess)
        }
    };

    React.useEffect(() => {
        if (isSuccess) {
            toast.success("Announcement posted");
            const now = new Date();
            const pad = (n: number) => String(n).padStart(2, "0");
            const scheduledFor = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
            setAnnouncement({ 
                title: "", 
                content: "", 
                courseId: courseId || "", 
                scheduledFor, 
                validTill: "" 
            });
            if (onSuccess) onSuccess();
            if (setRoute) setRoute("All Announcements");
        }
        if (error) {
            const err = error as any;
            toast.error(err?.data?.message || "Failed to create announcement");
        }
    }, [isSuccess, error, courseId]);

    return (
        <div className="w-full bg-[#f8f9fa] dark:bg-[#111c43] p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-[18px] font-Poppins font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">
                Create announcement
            </h2>
            <form onSubmit={handleSubmit}>
                {!courseId && (
                    <div className="mb-5">
                        <label className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Select Course</label>
                        <select
                            value={announcement.courseId}
                            onChange={(e) => setAnnouncement({ ...announcement, courseId: e.target.value })}
                            className={`${styles.input} !mt-1 !text-[14px]`}
                        >
                            <option value="">Select a course</option>
                            {coursesData?.courses.map((course: any) => (
                                <option key={course._id} value={course._id}>{course.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                        <label className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Publish at</label>
                        <input
                            type="datetime-local"
                            value={announcement.scheduledFor}
                            onChange={(e) => setAnnouncement({ ...announcement, scheduledFor: e.target.value })}
                            className={`${styles.input} !mt-1 !text-[14px]`}
                        />
                    </div>
                    <div>
                        <label className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Visible till (optional)</label>
                        <input
                            type="datetime-local"
                            value={announcement.validTill}
                            onChange={(e) => setAnnouncement({ ...announcement, validTill: e.target.value })}
                            className={`${styles.input} !mt-1 !text-[14px]`}
                        />
                    </div>
                </div>

                <div className="mb-5">
                    <label className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input
                        type="text"
                        value={announcement.title}
                        onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                        placeholder="Class cancelled today"
                        className={`${styles.input} !mt-1 !text-[14px]`}
                    />
                </div>

                <div className="mb-5">
                    <label className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Content</label>
                    <textarea
                        value={announcement.content}
                        onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
                        placeholder="Write the announcement..."
                        className={`${styles.input} !h-auto !mt-1 !text-[14px] py-2`}
                        rows={6}
                    />
                </div>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-[#39c1f3] hover:bg-[#2a9fd8] text-white font-Poppins font-medium py-2 px-10 rounded-lg transition-all shadow-sm active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Posting..." : "Post"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAnnouncement;

