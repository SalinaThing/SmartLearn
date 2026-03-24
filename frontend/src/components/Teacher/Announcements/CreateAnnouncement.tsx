import React, { useState, FC } from 'react';
import { useCreateAnnouncementMutation } from '@/redux/features/announcements/announcementApi';
import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import { styles } from '@/styles/style';
import toast from 'react-hot-toast';

type Props = {
    setRoute?: (route: string) => void;
}

const CreateAnnouncement: FC<Props> = ({ setRoute }) => {
    const { data: coursesData } = useGetAllCoursesQuery({});
    const [createAnnouncement, { isLoading, isSuccess, error }] = useCreateAnnouncementMutation();

    const [announcement, setAnnouncement] = useState({
        title: "",
        content: "",
        courseId: "",
        scheduledFor: (() => {
            const now = new Date();
            const pad = (n: number) => String(n).padStart(2, "0");
            return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
        })(),
        validTill: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!announcement.title || !announcement.content || !announcement.courseId) {
            toast.error("Please fill all fields");
            return;
        }
        if (announcement.validTill && new Date(announcement.validTill) < new Date(announcement.scheduledFor)) {
            toast.error("Visible till must be after publish date/time");
            return;
        }
        await createAnnouncement(announcement);
    };

    React.useEffect(() => {
        if (isSuccess) {
            toast.success("Announcement created successfully");
            const now = new Date();
            const pad = (n: number) => String(n).padStart(2, "0");
            const scheduledFor = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
            setAnnouncement({ title: "", content: "", courseId: "", scheduledFor, validTill: "" });
            if (setRoute) setRoute("All Announcements");
        }
        if (error) {
            const err = error as any;
            toast.error(err?.data?.message || "Failed to create announcement");
        }
    }, [isSuccess, error]);

    return (
        <div className="w-[90%] m-auto mt-24">
            <h1 className={styles.title}>Create New Announcement</h1>
            <form onSubmit={handleSubmit} className="mt-8">
                <div className="mb-5">
                    <label className={styles.label}>Select Course</label>
                    <select
                        value={announcement.courseId}
                        onChange={(e) => setAnnouncement({ ...announcement, courseId: e.target.value })}
                        className={styles.input}
                    >
                        <option value="">Select a course</option>
                        {coursesData?.courses.map((course: any) => (
                            <option key={course._id} value={course._id}>{course.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-5">
                    <label className={styles.label}>Date & time</label>
                    <input
                        type="datetime-local"
                        value={announcement.scheduledFor}
                        onChange={(e) => setAnnouncement({ ...announcement, scheduledFor: e.target.value })}
                        className={styles.input}
                    />
                </div>
                <div className="mb-5">
                    <label className={styles.label}>Visible till (optional)</label>
                    <input
                        type="datetime-local"
                        value={announcement.validTill}
                        onChange={(e) => setAnnouncement({ ...announcement, validTill: e.target.value })}
                        className={styles.input}
                    />
                </div>
                <div className="mb-5">
                    <label className={styles.label}>Announcement Title</label>
                    <input
                        type="text"
                        value={announcement.title}
                        onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                        placeholder="Important: Quiz rescheduled"
                        className={styles.input}
                    />
                </div>
                <div className="mb-5">
                    <label className={styles.label}>Content</label>
                    <textarea
                        value={announcement.content}
                        onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
                        placeholder="Write your announcement here..."
                        className={`${styles.input} !h-auto py-2`}
                        rows={10}
                    />
                </div>
                <div className="mt-10 mb-20 text-center">
                    <button type="submit" className={`${styles.button} !w-[200px] inline-block`} disabled={isLoading}>
                        {isLoading ? "Post Announcement..." : "Post Announcement"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAnnouncement;
