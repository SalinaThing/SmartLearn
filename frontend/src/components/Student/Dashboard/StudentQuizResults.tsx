import React, { FC } from 'react';
import { useGetResultsQuery } from '@/redux/features/quizzes/resultApi';
import { Link } from 'react-router-dom';
import Loader from '../../Loader/Loader';
import { PiCheckCircleFill, PiXCircleFill, PiExamFill, PiArrowRightBold } from 'react-icons/pi';

const performanceBadge = (perf: string) => {
    const map: Record<string, string> = {
        Excellent:   'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        Good:        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        Average:     'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        'Needs Work':'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return map[perf] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
};

const StudentQuizResults: FC = () => {
    // Uses the student-scoped endpoint (GET /api/v1/get-results)
    const { data, isLoading } = useGetResultsQuery('');

    const results: any[] = data?.results ?? [];

    if (isLoading) return <Loader />;

    return (
        <div className="w-full mt-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <PiExamFill className="text-[#3ccbae]" />
                    Recent Quiz Results
                </h2>
                <Link
                    to="/student/quizzes"
                    className="text-sm text-[#3ccbae] hover:underline flex items-center gap-1 font-medium"
                >
                    Attend Quizzes <PiArrowRightBold size={14} />
                </Link>
            </div>

            <div className="bg-white dark:bg-[#111C43] rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-[#1a223f] border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quiz</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Correct / Wrong</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Performance</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {results.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        <PiExamFill className="mx-auto text-4xl mb-2 text-gray-300 dark:text-gray-600" />
                                        No quiz results yet. <Link to="/student/quizzes" className="text-[#3ccbae] hover:underline">Take a quiz!</Link>
                                    </td>
                                </tr>
                            ) : (
                                results.map((result: any) => {
                                    const passed = result.score >= 50;
                                    return (
                                        <tr key={result._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-[160px] truncate">
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
                                            <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell whitespace-nowrap">
                                                {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : '—'}
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
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentQuizResults;
