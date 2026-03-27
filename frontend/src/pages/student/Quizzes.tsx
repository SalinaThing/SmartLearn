import React, { useState, useEffect } from 'react';
import StudentLayout from '@/layouts/StudentLayout';
import { useGetQuizzesByCourseQuery } from '@/redux/features/quizzes/quizApi';
import { useGetResultsQuery } from '@/redux/features/quizzes/resultApi';
import { useGetAllCoursesByUserQuery } from '@/redux/features/courses/coursesApi';
import { useUser } from '@/hooks/useUser';
import Loader from '@/components/Loader/Loader';
import { styles } from '@/styles/style';
import { Link } from 'react-router-dom';
import { PiExamFill, PiCheckCircleFill, PiXCircleFill, PiTrophyFill } from 'react-icons/pi';

const performanceBadge = (perf: string) => {
    const map: Record<string, string> = {
        Excellent:   'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        Good:        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        Average:     'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        'Needs Work':'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return map[perf] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
};

const QuizzesPage = () => {
    const { user } = useUser();
    const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesByUserQuery({});
    const [selectedCourse, setSelectedCourse] = useState('');

    // Filter courses the user is actually enrolled in
    const enrolledCourses = coursesData?.courses?.filter((course: any) =>
        user?.courses?.some((userCourse: any) => userCourse.courseId === course._id)
    ) || [];

    useEffect(() => {
        if (enrolledCourses.length > 0 && !selectedCourse) {
            setSelectedCourse(enrolledCourses[0]._id);
        }
    }, [enrolledCourses, selectedCourse]);

    const { data: quizzesData, isLoading: quizzesLoading } = useGetQuizzesByCourseQuery(selectedCourse, { skip: !selectedCourse });

    // Fetch results — pass courseId if a course is selected, otherwise fetch all user results
    const { data: resultsData, isLoading: resultsLoading } = useGetResultsQuery(selectedCourse || '');
    const results: any[] = resultsData?.results ?? [];

    // Build a set of quizIds already attempted
    const attendedQuizIds = new Set(results.map((r: any) => String(r.quizId)));

    return (
        <StudentLayout title="My Quizzes" description="Attend quizzes and track your performance" activeItem={14}>
            <div className="w-[95%] m-auto mt-10 space-y-12">

                {/* ─── Section: Available Quizzes ─── */}
                <div>
                    <h1 className={`${styles.title} !text-left`}>Available Quizzes</h1>

                    <div className="mb-8 mt-4">
                        <label className={styles.label}>Select Enrolled Course</label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className={`${styles.input} !w-full md:!w-[400px] mt-2`}
                        >
                            <option value="">Select a course</option>
                            {enrolledCourses.map((course: any) => (
                                <option key={course._id} value={course._id}>{course.name}</option>
                            ))}
                        </select>
                    </div>

                    {quizzesLoading || coursesLoading ? (
                        <Loader />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {quizzesData?.quizzes?.length > 0 ? (
                                quizzesData.quizzes.map((quiz: any) => {
                                    const isAttended = attendedQuizIds.has(String(quiz._id));
                                    return (
                                        <div key={quiz._id} className="bg-white dark:bg-[#111C43] p-6 rounded-xl shadow-md border-t-4 border-[#3ccbae] hover:shadow-lg transition-all relative">
                                            {isAttended && (
                                                <span className="absolute top-3 right-3 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                                                    Attended
                                                </span>
                                            )}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-[#3ccbae] rounded-lg">
                                                    <PiExamFill size={24} />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-1">{quiz.title}</h3>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                                Questions: {quiz.questions?.length || 0}
                                            </p>
                                            <Link
                                                to={`/quiz?courseId=${selectedCourse}&quizId=${quiz._id}`}
                                                className="block w-full text-center py-2 bg-[#3ccbae] text-white rounded-lg hover:bg-[#2bb298] transition-colors font-semibold"
                                            >
                                                {isAttended ? 'Retake Quiz' : 'Attend Quiz'}
                                            </Link>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full py-10 text-center bg-white dark:bg-[#111C43] rounded-xl shadow-md text-gray-500 dark:text-gray-400">
                                    {selectedCourse ? 'No quizzes found for this course.' : 'Please select a course to see quizzes.'}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ─── Section: Attended Quizzes & Results ─── */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <PiTrophyFill className="text-amber-500" />
                        Attended Quizzes &amp; Results
                        {results.length > 0 && (
                            <span className="ml-2 text-sm bg-[#3ccbae]/10 text-[#3ccbae] px-2.5 py-0.5 rounded-full font-semibold">
                                {results.length} attempt{results.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </h2>

                    <div className="bg-white dark:bg-[#111C43] rounded-xl shadow-md overflow-hidden">
                        {resultsLoading ? (
                            <div className="py-10 flex justify-center"><Loader /></div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-[#1a223f] border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quiz Title</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Correct / Wrong</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Performance</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {results.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                                    <PiExamFill className="mx-auto text-4xl mb-2 text-gray-300 dark:text-gray-600" />
                                                    {selectedCourse
                                                        ? "No results for this course yet. Complete a quiz above!"
                                                        : "Select a course to see your quiz results."}
                                                </td>
                                            </tr>
                                        ) : (
                                            results.map((result: any) => {
                                                const passed = (result.score ?? 0) >= 50;
                                                return (
                                                    <tr key={result._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                        <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-[180px] truncate">
                                                            {result.title || 'Quiz'}
                                                        </td>
                                                        <td className="px-5 py-4 text-sm font-bold text-gray-700 dark:text-gray-200">
                                                            {result.score ?? 0}%
                                                        </td>
                                                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                                                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{result.correct ?? 0}</span>
                                                            <span className="text-gray-400 mx-1">/</span>
                                                            <span className="text-red-500 font-medium">{result.wrong ?? 0}</span>
                                                        </td>
                                                        <td className="px-5 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${performanceBadge(result.performance)}`}>
                                                                {result.performance || 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                passed
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                            }`}>
                                                                {passed ? <PiCheckCircleFill /> : <PiXCircleFill />}
                                                                {passed ? 'Passed' : 'Failed'}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell whitespace-nowrap">
                                                            {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : '—'}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </StudentLayout>
    );
};

export default QuizzesPage;
