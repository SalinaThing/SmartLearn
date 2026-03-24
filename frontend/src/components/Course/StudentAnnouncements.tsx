import React, { useEffect, useState } from 'react';
import { useCreateAnnouncementMutation, useGetAnnouncementsByCourseQuery } from '@/redux/features/announcements/announcementApi';
import Loader from '../Loader/Loader';
import { format } from 'timeago.js';
import { styles } from '@/styles/style';
import toast from 'react-hot-toast';

type Props = {
    courseId: string;
    user?: any;
}

const StudentAnnouncements = ({ courseId, user }: Props) => {
    const { data, isLoading, refetch } = useGetAnnouncementsByCourseQuery(courseId);
    const [createAnnouncement, { isLoading: creating, isSuccess, error }] = useCreateAnnouncementMutation();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [scheduledFor, setScheduledFor] = useState(() => {
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    });

    const isTeacher = user?.role === "teacher";

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isTeacher) return;

        if (!title.trim() || !content.trim()) {
            toast.error("Title and content are required");
            return;
        }

        await createAnnouncement({
            title: title.trim(),
            content: content.trim(),
            courseId,
            scheduledFor: new Date(scheduledFor).toISOString(),
        });
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Announcement posted");
            setTitle("");
            setContent("");
            refetch();
        }

        if (error) {
            toast.error("Failed to post announcement");
        }
    }, [isSuccess, error, refetch]);

    return (
        <div className="w-full">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full p-4">
                    {isTeacher && (
                        <div className="mb-8 p-4 bg-slate-500 bg-opacity-10 rounded-lg">
                            <h2 className="text-[18px] font-[600] dark:text-white text-black mb-4">
                                Create announcement
                            </h2>

                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-1 1100px:grid-cols-2 gap-4">
                                    <div>
                                        <label className={styles.label}>Date & time</label>
                                        <input
                                            type="datetime-local"
                                            value={scheduledFor}
                                            onChange={(e) => setScheduledFor(e.target.value)}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className="hidden 1100px:block" />
                                </div>

                                <div>
                                    <label className={styles.label}>Title</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className={styles.input}
                                        placeholder="Class cancelled today"
                                    />
                                </div>

                                <div>
                                    <label className={styles.label}>Content</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className={`${styles.input} !h-auto py-2`}
                                        rows={6}
                                        placeholder="Write the announcement..."
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className={`${styles.button} text-white !w-[unset] !min-h-[40px] !py-[unset] ${
                                            creating ? "cursor-not-allowed opacity-60" : ""
                                        }`}
                                        disabled={creating}
                                    >
                                        {creating ? "Posting..." : "Post"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {data?.announcements.length === 0 ? (
                        <p className="text-black dark:text-white text-center mt-10">No announcements yet.</p>
                    ) : (
                        data?.announcements.map((item: any) => (
                            <div key={item._id} className="mb-6 p-4 bg-slate-500 bg-opacity-10 rounded-lg">
                                <h1 className="text-[20px] font-Poppins font-[500] text-black dark:text-white">
                                    {item.title}
                                </h1>
                                <p className="text-[16px] text-[#000000b8] dark:text-[#ffffffb8] mt-2 whitespace-pre-line">
                                    {item.content}
                                </p>
                                <div className="text-right mt-2">
                                    <small className="text-[#00000083] dark:text-[#ffffff83]">
                                        {item?.scheduledFor
                                            ? new Date(item.scheduledFor).toLocaleString()
                                            : format(item.createdAt)}
                                    </small>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentAnnouncements;
