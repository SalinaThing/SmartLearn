import React, { useState } from 'react';
import { useSubmitFeedbackMutation } from '@/redux/features/feedback/feedbackApi';
import { styles } from '@/styles/style';
import toast from 'react-hot-toast';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const FeedbackForm = ({ courseId }: { courseId?: string }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitFeedback, { isLoading, isSuccess, error }] = useSubmitFeedbackMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment) {
            toast.error("Please provide a comment");
            return;
        }
        await submitFeedback({ courseId, rating, comment });
    };

    React.useEffect(() => {
        if (isSuccess) {
            toast.success("Feedback submitted successfully. Thank you!");
            setComment("");
            setRating(5);
        }
        if (error) {
            toast.error("Failed to submit feedback");
        }
    }, [isSuccess, error]);

    return (
        <div className="p-4 max-w-2xl m-auto">
            <h2 className="text-2xl font-bold mb-6 dark:text-white text-black">Share Your Feedback</h2>
            <form onSubmit={handleSubmit}>
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
