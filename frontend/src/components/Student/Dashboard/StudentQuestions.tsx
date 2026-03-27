import React, { FC, useState } from 'react';
import { useGetQuestionsByUserQuery, useEditQuestionMutation } from '@/redux/features/courses/coursesApi';
import Loader from '../../Loader/Loader';
import { styles } from '@/styles/style';
import toast from 'react-hot-toast';
import { format } from 'timeago.js';
import { AiOutlineEdit, AiOutlineMessage } from 'react-icons/ai';

const StudentQuestions: FC = () => {
    const { data, isLoading, refetch } = useGetQuestionsByUserQuery(undefined, { refetchOnMountOrArgChange: true });
    const [editQuestion, { isSuccess, error }] = useEditQuestionMutation();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    const questions = data?.questions || [];

    const handleEdit = (question: any) => {
        setEditingId(question._id);
        setEditContent(question.question);
    };

    const handleUpdate = async (question: any) => {
        if (!editContent.trim()) {
            toast.error("Question cannot be empty");
            return;
        }
        await editQuestion({
            question: editContent,
            courseId: question.courseId,
            contentId: question.contentId,
            questionId: question._id
        });
    };

    React.useEffect(() => {
        if (isSuccess) {
            toast.success("Question updated successfully");
            setEditingId(null);
            refetch();
        }
        if (error) {
            toast.error("Failed to update question");
        }
    }, [isSuccess, error]);

    if (isLoading) return <Loader />;

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                My Questions & FAQ
            </h2>
            {questions.length === 0 ? (
                <div className="bg-white dark:bg-[#111C43] rounded-xl p-8 text-center shadow-md">
                    <p className="text-gray-500 dark:text-gray-400 font-Poppins">
                        You haven't asked any questions yet. Questions you ask in courses will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {questions.map((item: any) => (
                        <div key={item._id} className="bg-white dark:bg-[#111C43] rounded-xl p-6 shadow-md border-l-4 border-blue-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className="space-y-1">
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-widest">
                                        {item.courseName}
                                    </span>
                                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                        Lesson: {item.contentTitle}
                                    </h4>
                                </div>
                                <span className="text-xs text-gray-400">{format(item.createdAt)}</span>
                            </div>

                            {editingId === item._id ? (
                                <div className="space-y-4">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className={`${styles.input} !h-auto py-2`}
                                        rows={3}
                                    />
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleUpdate(item)}
                                            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
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
                                    <p className="text-gray-800 dark:text-gray-200 font-Poppins text-lg">
                                        {item.question}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => handleEdit(item)}
                                            className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
                                        >
                                            <AiOutlineEdit size={18} /> Edit Question
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Replies Section */}
                            {item.questionReplies?.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <AiOutlineMessage /> Replies ({item.questionReplies.length})
                                    </h5>
                                    {item.questionReplies.map((reply: any, index: number) => (
                                        <div key={index} className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm dark:text-white text-black">{reply.user?.name}</span>
                                                <span className="text-[10px] text-gray-400">{format(reply.createdAt)}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{reply.answer}</p>
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

export default StudentQuestions;
