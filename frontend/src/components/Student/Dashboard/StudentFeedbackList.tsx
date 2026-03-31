import React, { FC, useState, useEffect } from 'react';
import { useGetStudentFeedbackQuery, useUpdateFeedbackMutation, useDeleteFeedbackMutation } from '@/redux/features/feedback/feedbackApi';
import Loader from '../../Loader/Loader';
import { styles } from '@/styles/style';
import toast from 'react-hot-toast';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const StudentFeedbackList: FC = () => {
    const { data, isLoading, refetch } = useGetStudentFeedbackQuery({});
    const [updateFeedback, { isSuccess, error }] = useUpdateFeedbackMutation();
    const [deleteFeedback, { isSuccess: deleteSuccess, error: deleteError }] = useDeleteFeedbackMutation();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const feedbacks = data?.feedback || [];

    useEffect(() => {
        if (isSuccess) {
            toast.success("Feedback updated successfully");
            setEditingId(null);
            refetch();
        }
        if (error) {
            const err = error as any;
            toast.error(err?.data?.message || "Failed to update feedback");
        }
    }, [isSuccess, error, refetch]);

    useEffect(() => {
        if (deleteSuccess) {
            toast.success("Feedback deleted successfully");
            refetch();
        }
        if (deleteError) {
            const err = deleteError as any;
            toast.error(err?.data?.message || "Failed to delete feedback");
        }
    }, [deleteSuccess, deleteError, refetch]);

    const handleEdit = (item: any) => {
        setEditingId(item._id);
        setRating(item.rating);
        setComment(item.comment);
    };

    const handleUpdate = async () => {
        if (!rating || !comment.trim()) {
            toast.error("Please provide both rating and comment");
            return;
        }
        await updateFeedback({ id: editingId, rating, comment });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this feedback?")) {
            await deleteFeedback(id);
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="w-full mt-8">
            <h1 className="text-[25px] font-Poppins font-bold mb-6">
                <span className="text-black dark:text-white">My</span>
                <span className="text-[#3ccbae] ml-2">Feedback</span>
            </h1>
            <div className="space-y-4">
                {feedbacks.length === 0 ? (
                    <div className="bg-white dark:bg-[#111C43] rounded-xl p-8 text-center shadow-md text-gray-500 dark:text-gray-400">
                        You haven't given any feedback yet.
                    </div>
                ) : (
                    feedbacks.map((item: any) => (
                        <div key={item._id} className="bg-white dark:bg-[#111C43] rounded-xl p-5 shadow-md border-l-4 border-[#3ccbae]">
                            {editingId === item._id ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg uppercase">
                                            {item.courseId?.name || "Deleted Course"}
                                        </div>
                                        <span className="text-xs text-gray-400">Editing Mode</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star} onClick={() => setRating(star)} className="cursor-pointer">
                                                {star <= rating ? (
                                                    <AiFillStar className="text-yellow-400 text-2xl" />
                                                ) : (
                                                    <AiOutlineStar className="text-gray-400 text-2xl" />
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className={`${styles.input} !h-auto py-2`}
                                        rows={3}
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={handleUpdate} className="px-4 py-1.5 bg-[#3ccbae] text-white rounded text-sm">Save</button>
                                        <button onClick={() => setEditingId(null)} className="px-4 py-1.5 bg-gray-500 text-white rounded text-sm">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-white">
                                                Course: {item.courseId?.name || "Deleted Course"}
                                            </h3>
                                            <div className="flex text-yellow-400 mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    i < item.rating ? <AiFillStar key={i} /> : <AiOutlineStar key={i} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-3 items-center">
                                            <button onClick={() => handleEdit(item)} className="text-blue-500 text-sm hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(item._id)} className="text-red-500 text-sm hover:underline">Delete</button>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2 italic">
                                        "{item.comment}"
                                    </p>
                                    <span className="text-xs text-gray-400 mt-3 block">
                                        Given on: {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentFeedbackList;
