import React, { useState } from 'react';
import { useSubmitFeedbackMutation } from '@/redux/features/feedback/feedbackApi';
import { useGetAllCoursesByUserQuery } from '@/redux/features/courses/coursesApi';
import { useUser } from '@/hooks/useUser';
import { styles } from '@/styles/style';
import toast from 'react-hot-toast';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const FeedbackForm = ({ courseId: initialCourseId }: { courseId?: string }) => {
    const { user } = useUser();
    const { data: coursesData } = useGetAllCoursesByUserQuery({});
    const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId || "");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitFeedback, { isLoading, isSuccess, error }] = useSubmitFeedbackMutation();

    // Filter to only enrolled courses
    const enrolledCourses = coursesData?.courses?.filter((c: any) => 
        user?.courses?.some((uc: any) => uc.courseId === c._id)
    ) || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalCourseId = initialCourseId || selectedCourseId;
        if (!finalCourseId) {
            toast.error("Please select a course to provide feedback for");
            return;
        }
        if (!comment) {
            toast.error("Please provide a comment");
            return;
        }
        await submitFeedback({ courseId: finalCourseId, rating, comment });
    };

    React.useEffect(() => {
        if (isSuccess) {
            toast.success("Feedback submitted successfully. Thank you!");
            setComment("");
            setRating(5);
            if(!initialCourseId) setSelectedCourseId("");
        }
        if (error) {
            toast.error("Failed to submit feedback");
        }
    }, [isSuccess, error, initialCourseId]);

    return (
        <div className="p-4 max-w-2xl m-auto">
            <h2 className="text-2xl font-bold mb-6 dark:text-white text-black">Share Your Feedback</h2>
            <form onSubmit={handleSubmit}>
                {!initialCourseId && enrolledCourses.length > 0 && (
                    <div className="mb-6">
                        <label className={styles.label}>Select Course</label>
                        <select 
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className={`${styles.input} mt-2`}
                        >
                            <option value="">Choose a course...</option>
                            {enrolledCourses.map((c: any) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {initialCourseId && (
                     <div className="mb-6 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <p className="text-blue-600 dark:text-blue-400 font-bold text-sm uppercase">
                            Providing Feedback for: {coursesData?.courses?.find((c: any) => c._id === initialCourseId)?.name || "This Course"}
                        </p>
                     </div>
                )}

                <div className="mb-6">
                    <label className={styles.label}>Rate your experience</label>
                    <div className="flex items-center mt-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} onClick={() => setRating(i)} className="cursor-pointer mr-2">
                                {rating >= i ? (
                                    <AiFillStar color="rgb(246, 186, 0)" size={35} />
                                ) : (
                                    <AiOutlineStar color="rgb(246, 186, 0)" size={35} />
                                )}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="mb-6">
                    <label className={styles.label}>Your Comment</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What do you think about this course?"
                        className={`${styles.input} !h-auto py-2`}
                        rows={5}
                    />
                </div>
                <div className="text-center">
                    <button type="submit" className={`${styles.button} !w-[200px]`} disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit Feedback"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FeedbackForm;
