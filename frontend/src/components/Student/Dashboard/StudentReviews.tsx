import React, { FC, useState } from 'react';
import { useGetReviewsByUserQuery, useEditReviewMutation } from '@/redux/features/courses/coursesApi';
import Loader from '../../Loader/Loader';
import { styles } from '@/styles/style';
import toast from 'react-hot-toast';
import { format } from 'timeago.js';
import { AiOutlineEdit, AiOutlineMessage, AiFillStar, AiOutlineStar } from 'react-icons/ai';

const StudentReviews: FC = () => {
    const { data, isLoading, refetch } = useGetReviewsByUserQuery(undefined, { refetchOnMountOrArgChange: true });
    const [editReview, { isSuccess, error }] = useEditReviewMutation();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(5);

    const reviews = data?.reviews || [];

    const handleEdit = (review: any) => {
        setEditingId(review._id);
        setEditContent(review.comment);
        setEditRating(review.rating);
    };

    const handleUpdate = async (review: any) => {
        if (!editContent.trim()) {
            toast.error("Review comment cannot be empty");
            return;
        }
        await editReview({
            rating: editRating,
            review: editContent,
            courseId: review.courseId,
            reviewId: review._id
        });
    };

    React.useEffect(() => {
        if (isSuccess) {
            toast.success("Review updated successfully");
            setEditingId(null);
            refetch();
        }
        if (error) {
            toast.error("Failed to update review");
        }
    }, [isSuccess, error]);

    if (isLoading) return <Loader />;

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                My Course Reviews
            </h2>
            {reviews.length === 0 ? (
                <div className="bg-white dark:bg-[#111C43] rounded-xl p-8 text-center shadow-md">
                    <p className="text-gray-500 dark:text-gray-400 font-Poppins">
                        You haven't given any reviews yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((item: any) => (
                        <div key={item._id} className="bg-white dark:bg-[#111C43] rounded-xl p-6 shadow-md border-l-4 border-yellow-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className="space-y-1">
                                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-[10px] font-bold rounded-full uppercase tracking-widest">
                                        {item.courseName || "Course"}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400">{item.createdAt ? format(item.createdAt) : "Just now"}</span>
                            </div>

                            {editingId === item._id ? (
                                <div className="space-y-4">
                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span 
                                                key={star} 
                                                onClick={() => setEditRating(star)}
                                                className="cursor-pointer"
                                            >
                                                {editRating >= star ? (
                                                    <AiFillStar size={24} color="#f6ba00" />
                                                ) : (
                                                    <AiOutlineStar size={24} color="#f6ba00" />
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className={`${styles.input} !h-auto py-2`}
                                        rows={3}
                                    />
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleUpdate(item)}
                                            className="px-4 py-1.5 bg-yellow-600 text-white rounded-lg text-sm font-semibold hover:bg-yellow-700 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                        <button 
                                            onClick={() => setEditingId(null)}
                                            className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star}>
                                                {item.rating >= star ? (
                                                    <AiFillStar size={20} color="#f6ba00" />
                                                ) : (
                                                    <AiOutlineStar size={20} color="#f6ba00" />
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-800 dark:text-gray-200 font-Poppins text-lg">
                                        {item.comment}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => handleEdit(item)}
                                            className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 text-sm font-medium transition-colors"
                                        >
                                            <AiOutlineEdit size={18} /> Edit Review
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Teacher Replies Section */}
                            {item.commentReplies && item.commentReplies.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <AiOutlineMessage /> Instructor Replies ({item.commentReplies.length})
                                    </h5>
                                    {item.commentReplies.map((reply: any, index: number) => (
                                        <div key={index} className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-r-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm dark:text-white text-black">{reply.user?.name || "Instructor"} (Instructor)</span>
                                                <span className="text-[10px] text-gray-400">{reply.createdAt ? format(reply.createdAt) : "Just now"}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{reply.comment || ""}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentReviews;
