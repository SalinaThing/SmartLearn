import React, { useState } from 'react';
import { useCreateQuizMutation } from '@/redux/features/quizzes/quizApi';
import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import { styles } from '@/styles/style';
import toast from 'react-hot-toast';
import { AiOutlineDelete, AiOutlinePlusCircle } from 'react-icons/ai';

const CreateQuiz = ({ setRoute }: { setRoute?: (route: string) => void }) => {
    const { data: coursesData } = useGetAllCoursesQuery({});
    const [createQuiz, { isLoading, isSuccess, error }] = useCreateQuizMutation();

    const [quizInfo, setQuizInfo] = useState({
        courseId: "",
        title: "",
        description: "",
        questions: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }],
    });

    const handleQuestionChange = (index: number, value: string) => {
        const updatedQuestions = [...quizInfo.questions];
        updatedQuestions[index].question = value;
        setQuizInfo({ ...quizInfo, questions: updatedQuestions });
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const updatedQuestions = [...quizInfo.questions];
        updatedQuestions[qIndex].options[oIndex] = value;
        setQuizInfo({ ...quizInfo, questions: updatedQuestions });
    };

    const handleCorrectAnswerChange = (index: number, value: string) => {
        const updatedQuestions = [...quizInfo.questions];
        updatedQuestions[index].correctAnswer = value;
        setQuizInfo({ ...quizInfo, questions: updatedQuestions });
    };

    const addQuestion = () => {
        setQuizInfo({
            ...quizInfo,
            questions: [...quizInfo.questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }],
        });
    };

    const removeQuestion = (index: number) => {
        const updatedQuestions = [...quizInfo.questions];
        updatedQuestions.splice(index, 1);
        setQuizInfo({ ...quizInfo, questions: updatedQuestions });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!quizInfo.courseId || !quizInfo.title || quizInfo.questions.length === 0) {
            toast.error("Please fill all fields");
            return;
        }
        await createQuiz(quizInfo);
    };

    React.useEffect(() => {
        if (isSuccess) {
            toast.success("Quiz created successfully");
            setQuizInfo({
                courseId: "",
                title: "",
                description: "",
                questions: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }],
            });
            if(setRoute) setRoute("All Quizzes");
        }
        if (error) {
            toast.error("Failed to create quiz");
        }
    }, [isSuccess, error]);

    return (
        <div className="w-[90%] m-auto mt-24">
            <h1 className={styles.title}>Create New Quiz</h1>
            <form onSubmit={handleSubmit} className="mt-8">
                <div className="mb-5">
                    <label className={styles.label}>Select Course</label>
                    <select
                        value={quizInfo.courseId}
                        onChange={(e) => setQuizInfo({ ...quizInfo, courseId: e.target.value })}
                        className={styles.input}
                    >
                        <option value="">Select a course</option>
                        {coursesData?.courses.map((course: any) => (
                            <option key={course._id} value={course._id}>{course.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-5">
                    <label className={styles.label}>Quiz Title</label>
                    <input
                        type="text"
                        value={quizInfo.title}
                        onChange={(e) => setQuizInfo({ ...quizInfo, title: e.target.value })}
                        placeholder="Mastering React Quiz"
                        className={styles.input}
                    />
                </div>
                <div className="mb-5">
                    <label className={styles.label}>Description</label>
                    <textarea
                        value={quizInfo.description}
                        onChange={(e) => setQuizInfo({ ...quizInfo, description: e.target.value })}
                        placeholder="Brief description of the quiz"
                        className={`${styles.input} !h-auto py-2`}
                        rows={3}
                    />
                </div>

                <div className="mt-10">
                    <h2 className="text-xl font-bold dark:text-white">Questions</h2>
                    {quizInfo.questions.map((q, qIndex) => (
                        <div key={qIndex} className="mt-6 p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <label className={styles.label}>Question {qIndex + 1}</label>
                                <AiOutlineDelete
                                    className="text-red-500 cursor-pointer"
                                    size={25}
                                    onClick={() => removeQuestion(qIndex)}
                                />
                            </div>
                            <input
                                type="text"
                                value={q.question}
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                placeholder="What is React?"
                                className={styles.input}
                            />
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                {q.options.map((o, oIndex) => (
                                    <div key={oIndex}>
                                        <label className={styles.label}>Option {oIndex + 1}</label>
                                        <input
                                            type="text"
                                            value={o}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            placeholder={`Option ${oIndex + 1}`}
                                            className={styles.input}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <label className={styles.label}>Correct Answer</label>
                                <select
                                    value={q.correctAnswer}
                                    onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                                    className={styles.input}
                                >
                                    <option value="">Select correct option</option>
                                    {q.options.map((option, idx) => (
                                        <option key={idx} value={option}>{option || `Option ${idx + 1}`}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-center mt-6">
                        <AiOutlinePlusCircle
                            className="text-green-500 cursor-pointer"
                            size={40}
                            onClick={addQuestion}
                        />
                    </div>
                </div>

                <div className="mt-10 mb-20 text-center">
                    <button type="submit" className={`${styles.button} !w-[200px] inline-block`} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Quiz"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuiz;
