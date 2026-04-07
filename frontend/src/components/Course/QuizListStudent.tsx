import React, { useState, useEffect, useRef } from 'react';
import { useGetQuizzesByCourseQuery } from '@/redux/features/quizzes/quizApi';
import { useCreateResultMutation, useGetResultsQuery } from '@/redux/features/quizzes/resultApi';
import Loader from '../Loader/Loader';
import { styles } from '@/styles/style';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

const QuizListStudent = ({ courseId, user }: { courseId: string; user: any }) => {
    const { data, isLoading } = useGetQuizzesByCourseQuery(courseId, { refetchOnMountOrArgChange: true });
    const { data: resultsData, refetch: refetchResults } = useGetResultsQuery(courseId);
    const [createResult] = useCreateResultMutation();
    const [searchParams] = useSearchParams();
    const urlQuizId = searchParams.get("quizId");
    const autoStarted = useRef(false);

    const [activeQuiz, setActiveQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleStartQuiz = (quiz: any) => {
        setActiveQuiz(quiz);
        setAnswers(new Array(quiz.questions.length).fill(""));
        setIsSubmitted(false);
        setScore(0);
    };

    useEffect(() => {
        if (data && urlQuizId && !activeQuiz && !autoStarted.current) {
            const quiz = data.quizzes.find((q: any) => q._id === urlQuizId);
            if (quiz) {
                autoStarted.current = true;
                handleStartQuiz(quiz);
            }
        }
    }, [data, urlQuizId, activeQuiz]);

    const handleAnswerChange = (index: number, value: string) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    const handleSubmit = async () => {
        if (answers.includes("")) {
            toast.error("Please answer all questions");
            return;
        }

        let correctCount = 0;
        activeQuiz.questions.forEach((q: any, index: number) => {
            if (q.correctAnswer === answers[index]) {
                correctCount++;
            }
        });
        const finalScore = (correctCount / activeQuiz.questions.length) * 100;
        setScore(finalScore);
        setIsSubmitted(true);

        try {
            await createResult({
                courseId,
                quizId: activeQuiz._id,
                title: activeQuiz.title,
                totalQuestions: activeQuiz.questions.length,
                correct: correctCount,
            }).unwrap();
            toast.success("Result saved successfully!");
            refetchResults();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to save quiz result");
            console.error("Result submission error:", err);
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="w-full p-4">
            {!activeQuiz ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4 dark:text-white text-black">Available Quizzes</h2>
                    {data?.quizzes.length === 0 ? (
                        <p className="dark:text-white text-black">No quizzes available for this course yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data?.quizzes.map((quiz: any) => (
                                <div key={quiz._id} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-semibold dark:text-white text-black">{quiz.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">{quiz.description}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-sm dark:text-gray-500">{quiz.questions.length} Questions</span>
                                        {(() => {
                                            const result = resultsData?.results?.find((r: any) => r.quizId === quiz._id);
                                            if (result) {
                                                const scorePercent = Math.round((result.correct / result.totalQuestions) * 100);
                                                const isGood = scorePercent >= 70;
                                                return (
                                                    <div className={`px-4 py-2 rounded-lg text-center ${isGood ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700' : 'bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700'}`}>
                                                        <p className={`text-lg font-bold ${isGood ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                                            {scorePercent}%
                                                        </p>
                                                        <p className="text-xs dark:text-gray-400 text-gray-600">
                                                            {result.correct}/{result.totalQuestions} correct
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <button
                                                    onClick={() => handleStartQuiz(quiz)}
                                                    className={`${styles.button} !w-[120px] !h-[35px] !text-[12px]`}
                                                >
                                                    {user?.role === "admin" ? "View Questions" : "Start Quiz"}
                                                </button>
                                            );
                                        })()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="max-w-3xl m-auto">
                    <button onClick={() => setActiveQuiz(null)} className="text-blue-500 mb-4 flex items-center">
                        &larr; Back to Quizzes
                    </button>
                    <h2 className="text-2xl font-bold mb-6 dark:text-white text-black">{activeQuiz.title}</h2>
                    {!isSubmitted ? (
                        <div>
                            {activeQuiz.questions.map((q: any, qIndex: number) => (
                                <div key={qIndex} className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-lg font-medium dark:text-white text-black mb-4">
                                        {qIndex + 1}. {q.question}
                                    </p>
                                    <div className="space-y-3">
                                        {q.options.map((option: string, oIndex: number) => (
                                            <label key={oIndex} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                                                <input
                                                    type="radio"
                                                    name={`question-${qIndex}`}
                                                    value={option}
                                                    checked={answers[qIndex] === option}
                                                    onChange={user?.role === "admin" ? () => {} : () => handleAnswerChange(qIndex, option)}
                                                    disabled={user?.role === "admin"}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="dark:text-white text-black">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {user?.role !== "admin" && (
                                <div className="flex justify-center mt-10 mb-10">
                                    <button onClick={handleSubmit} className={`${styles.button} !w-[200px]`}>
                                        Submit Quiz
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center p-10 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-blue-500">
                            <h3 className="text-3xl font-bold dark:text-white text-black mb-4">Quiz Completed!</h3>
                            <p className="text-xl dark:text-white text-black mb-6">
                                Your Score: <span className="text-blue-500 text-4xl">{Math.round(score)}%</span>
                            </p>
                            <div className="mb-8 dark:text-gray-300 text-gray-700">
                                You got {Math.round((score / 100) * activeQuiz.questions.length)} out of {activeQuiz.questions.length} questions correct.
                            </div>
                            <button onClick={() => setActiveQuiz(null)} className={`${styles.button} !w-[200px]`}>
                                Back to Quizzes
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuizListStudent;
