import React, { useEffect, useState } from 'react';
import {
    useDeleteAnnouncementMutation,
    useGetAnnouncementsByCourseQuery,
    useUpdateAnnouncementMutation
} from '@/redux/features/announcements/announcementApi';
import Loader from '../Loader/Loader';
import { styles } from '@/styles/style';
import toast from 'react-hot-toast';
import CreateAnnouncement from '@/components/Teacher/Announcements/CreateAnnouncement';

type Props = {
    courseId: string;
    user?: any;
    isManagementView?: boolean;
}

const StudentAnnouncements = ({ courseId, user, isManagementView }: Props) => {
    const { data, isLoading, refetch } = useGetAnnouncementsByCourseQuery(courseId);
    const [updateAnnouncement, { isLoading: updating, isSuccess: isUpdateSuccess, error: updateError }] = useUpdateAnnouncementMutation();
    const [deleteAnnouncement, { isLoading: deleting, isSuccess: isDeleteSuccess, error: deleteError }] = useDeleteAnnouncementMutation();

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

    const announcements = data?.announcements || [];

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

        const payload: any = {
            title: editTitle.trim(),
            content: editContent.trim(),
            courseId,
            scheduledFor: new Date(editScheduledFor).toISOString(),
        };
        if (editValidTill) payload.validTill = new Date(editValidTill).toISOString();

        await updateAnnouncement({ id, data: payload });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this announcement?")) return;
        await deleteAnnouncement(id);
    };

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

    const displayAnnouncements = announcements;

    return (
        <div className="w-full">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="space-y-6">
                    {isTeacher && !isManagementView && (
                        <div className="mb-8">
                            <CreateAnnouncement courseId={courseId} onSuccess={refetch} />
                        </div>
                    )}
                    {displayAnnouncements.length === 0 ? (
                        <div className="text-center py-10 bg-slate-500 bg-opacity-10 rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400 font-Poppins">No announcements yet.</p>
                        </div>
                    ) : (
                        displayAnnouncements.map((item: any) => {
                            const sched = item?.scheduledFor ? new Date(item.scheduledFor) : new Date(item.createdAt);
                            const expiry = item?.validTill ? new Date(item.validTill) : null;

                            return (
                                <div key={item._id} className="relative mb-6 p-6 bg-white dark:bg-[#111c43] rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md hover:border-[#39c1f3]/30 overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#39c1f3]"></div>
                                    {editingId === item._id ? (
                                        <div className="space-y-4">
                                            {/* (Editing form remains same) */}
                                            <div>
                                                <label className="text-[14px] font-medium text-gray-700 dark:text-gray-300 font-Poppins">Title</label>
                                                <input
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    className={`${styles.input} !mt-1 !text-[14px]`}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[14px] font-medium text-gray-700 dark:text-gray-300 font-Poppins">Content</label>
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className={`${styles.input} !h-auto !mt-1 py-2 !text-[14px]`}
                                                    rows={5}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[14px] font-medium text-gray-700 dark:text-gray-300 font-Poppins">Publish at</label>
                                                    <input
                                                        type="datetime-local"
                                                        value={editScheduledFor}
                                                        onChange={(e) => setEditScheduledFor(e.target.value)}
                                                        className={`${styles.input} !mt-1 !text-[14px]`}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[14px] font-medium text-gray-700 dark:text-gray-300 font-Poppins">Visible till</label>
                                                    <input
                                                        type="datetime-local"
                                                        value={editValidTill}
                                                        onChange={(e) => setEditValidTill(e.target.value)}
                                                        className={`${styles.input} !mt-1 !text-[14px]`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-3 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={cancelEditing}
                                                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium font-Poppins text-sm"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdate(item._id)}
                                                    disabled={updating}
                                                    className="px-6 py-2 bg-[#39c1f3] text-white rounded-lg font-medium shadow-sm active:scale-95 disabled:opacity-50 font-Poppins text-sm"
                                                >
                                                    {updating ? "Saving..." : "Save Changes"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-4">
                                                <h1 className="text-[18px] font-Poppins font-semibold text-gray-800 dark:text-white leading-tight">
                                                    {item.title}
                                                </h1>
                                                <div className="text-[11px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full whitespace-nowrap">
                                                    {sched.toLocaleDateString()}
                                                </div>
                                            </div>
                                            <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-line font-Poppins pr-2">
                                                {item.content}
                                            </p>
                                            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-gray-400 dark:text-gray-500 font-Poppins">
                                                    <span className="flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        Posted: {sched.toLocaleString()}
                                                    </span>
                                                    {expiry && (
                                                        <span className="flex items-center gap-1.5 text-yellow-600/80 dark:text-yellow-500/60">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            Valid till: {expiry.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                                {isTeacher && (
                                                    <div className="flex gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => startEditing(item)}
                                                            className="p-2.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                                                            title="Edit"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(item._id)}
                                                            disabled={deleting}
                                                            className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all disabled:opacity-50"
                                                            title="Delete"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentAnnouncements;
