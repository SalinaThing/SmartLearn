import React, { useEffect, useState } from 'react';
import {
    useCreateAnnouncementMutation,
    useDeleteAnnouncementMutation,
    useGetAnnouncementsByCourseQuery,
    useUpdateAnnouncementMutation
} from '@/redux/features/announcements/announcementApi';
import Loader from '../Loader/Loader';
import { styles } from '@/styles/style';
import toast from 'react-hot-toast';

type Props = {
    courseId: string;
    user?: any;
}

const StudentAnnouncements = ({ courseId, user }: Props) => {
    const { data, isLoading, refetch } = useGetAnnouncementsByCourseQuery(courseId);
    const [createAnnouncement, { isLoading: creating, isSuccess, error }] = useCreateAnnouncementMutation();
    const [updateAnnouncement, { isLoading: updating, isSuccess: isUpdateSuccess, error: updateError }] = useUpdateAnnouncementMutation();
    const [deleteAnnouncement, { isLoading: deleting, isSuccess: isDeleteSuccess, error: deleteError }] = useDeleteAnnouncementMutation();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [scheduledFor, setScheduledFor] = useState(() => {
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    });
    const [validTill, setValidTill] = useState("");

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editScheduledFor, setEditScheduledFor] = useState("");
    const [editValidTill, setEditValidTill] = useState("");

    const isTeacher = user?.role === "teacher";
    const toDatetimeLocal = (value?: string) => {
        if (!value) return "";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    const now = new Date();
    const announcements = data?.announcements || [];
    const visibleToStudents = announcements.filter((item: any) => {
        const start = item?.scheduledFor ? new Date(item.scheduledFor) : new Date(item.createdAt);
        const end = item?.validTill ? new Date(item.validTill) : null;
        const isStarted = !Number.isNaN(start.getTime()) ? start <= now : true;
        const notExpired = end ? end >= now : true;
        return isStarted && notExpired;
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isTeacher) return;

        if (!title.trim() || !content.trim()) {
            toast.error("Title and content are required");
            return;
        }
        if (validTill && new Date(validTill) < new Date(scheduledFor)) {
            toast.error("Visible till must be after publish date/time");
            return;
        }

        await createAnnouncement({
            title: title.trim(),
            content: content.trim(),
            courseId,
            scheduledFor: new Date(scheduledFor).toISOString(),
            validTill: validTill ? new Date(validTill).toISOString() : null,
        });
    };

    const startEditing = (item: any) => {
        setEditingId(item._id);
        setEditTitle(item.title || "");
        setEditContent(item.content || "");
        setEditScheduledFor(toDatetimeLocal(item.scheduledFor || item.createdAt));
        setEditValidTill(toDatetimeLocal(item.validTill));
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditTitle("");
        setEditContent("");
        setEditScheduledFor("");
        setEditValidTill("");
    };

    const handleUpdate = async (id: string) => {
        if (!editTitle.trim() || !editContent.trim()) {
            toast.error("Title and content are required");
            return;
        }
        if (!editScheduledFor) {
            toast.error("Publish date/time is required");
            return;
        }
        if (editValidTill && new Date(editValidTill) < new Date(editScheduledFor)) {
            toast.error("Visible till must be after publish date/time");
            return;
        }

        await updateAnnouncement({
            id,
            data: {
                title: editTitle.trim(),
                content: editContent.trim(),
                courseId,
                scheduledFor: new Date(editScheduledFor).toISOString(),
                validTill: editValidTill ? new Date(editValidTill).toISOString() : null,
            },
        });
    };

    const handleDelete = async (id: string) => {
        await deleteAnnouncement(id);
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Announcement posted");
            setTitle("");
            setContent("");
            setValidTill("");
            refetch();
        }

        if (error) {
            const err = error as any;
            toast.error(err?.data?.message || "Failed to post announcement");
        }
    }, [isSuccess, error, refetch]);

    useEffect(() => {
        if (isUpdateSuccess) {
            toast.success("Announcement updated");
            cancelEditing();
            refetch();
        }
        if (updateError) {
            const err = updateError as any;
            toast.error(err?.data?.message || "Failed to update announcement");
        }
    }, [isUpdateSuccess, updateError, refetch]);

    useEffect(() => {
        if (isDeleteSuccess) {
            toast.success("Announcement deleted");
            refetch();
        }
        if (deleteError) {
            const err = deleteError as any;
            toast.error(err?.data?.message || "Failed to delete announcement");
        }
    }, [isDeleteSuccess, deleteError, refetch]);

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
                                        <label className={styles.label}>Publish at</label>
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
                                    <label className={styles.label}>Visible till (optional)</label>
                                    <input
                                        type="datetime-local"
                                        value={validTill}
                                        onChange={(e) => setValidTill(e.target.value)}
                                        className={styles.input}
                                    />
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

                    {(isTeacher ? announcements : visibleToStudents).length === 0 ? (
                        <p className="text-black dark:text-white text-center mt-10">No announcements yet.</p>
                    ) : (
                        (isTeacher ? announcements : visibleToStudents).map((item: any) => (
                            <div key={item._id} className="mb-6 p-4 bg-slate-500 bg-opacity-10 rounded-lg">
                                {editingId === item._id ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className={styles.label}>Title</label>
                                            <input
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className={styles.input}
                                            />
                                        </div>
                                        <div>
                                            <label className={styles.label}>Content</label>
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className={`${styles.input} !h-auto py-2`}
                                                rows={5}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 1100px:grid-cols-2 gap-4">
                                            <div>
                                                <label className={styles.label}>Publish at</label>
                                                <input
                                                    type="datetime-local"
                                                    value={editScheduledFor}
                                                    onChange={(e) => setEditScheduledFor(e.target.value)}
                                                    className={styles.input}
                                                />
                                            </div>
                                            <div>
                                                <label className={styles.label}>Visible till</label>
                                                <input
                                                    type="datetime-local"
                                                    value={editValidTill}
                                                    onChange={(e) => setEditValidTill(e.target.value)}
                                                    className={styles.input}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={cancelEditing}
                                                className={`${styles.button} !w-[unset] !min-h-[40px] !py-[unset] bg-gray-500`}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleUpdate(item._id)}
                                                disabled={updating}
                                                className={`${styles.button} !w-[unset] !min-h-[40px] !py-[unset] ${updating ? "cursor-not-allowed opacity-60" : ""}`}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-[20px] font-Poppins font-[500] text-black dark:text-white">
                                            {item.title}
                                        </h1>
                                        <p className="text-[16px] text-[#000000b8] dark:text-[#ffffffb8] mt-2 whitespace-pre-line">
                                            {item.content}
                                        </p>
                                        <div className="mt-2 text-sm text-[#00000083] dark:text-[#ffffff83]">
                                            <p>Published: {new Date(item?.scheduledFor || item?.createdAt).toLocaleString()}</p>
                                            <p>Visible till: {item?.validTill ? new Date(item.validTill).toLocaleString() : "No expiry"}</p>
                                        </div>
                                        {isTeacher && (
                                            <div className="flex justify-end gap-3 mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => startEditing(item)}
                                                    className={`${styles.button} !w-[unset] !min-h-[40px] !py-[unset] bg-[#37a39a]`}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(item._id)}
                                                    disabled={deleting}
                                                    className={`${styles.button} !w-[unset] !min-h-[40px] !py-[unset] bg-[#d63f3f] ${deleting ? "cursor-not-allowed opacity-60" : ""}`}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentAnnouncements;
