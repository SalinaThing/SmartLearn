import React, { FC } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useGetResultsQuery } from '@/redux/features/quizzes/resultApi';
import { Link } from 'react-router-dom';
import Loader from '../../Loader/Loader';
import { format } from "timeago.js";
import { useTheme } from '@/utils/ThemeProvider';
import { PiExamFill, PiArrowRightBold } from 'react-icons/pi';

const StudentQuizResults: FC = () => {
    const { theme } = useTheme();
    const { data, isLoading } = useGetResultsQuery('');

    const columns = [
        { field: 'title', headerName: 'Quiz Title', flex: 0.8 },
        { field: 'score', headerName: 'Score %', flex: 0.3,
            renderCell: (params: any) => {
                const percentage = params.row.totalQuestions ? Math.round((params.row.correct / params.row.totalQuestions) * 100) : 0;
                return (
                    <span className="font-bold text-[#39c1f3]">{percentage}%</span>
                )
            }
        },
        { field: 'correct_wrong', headerName: 'Correct / Wrong', flex: 0.4,
            renderCell: (params: any) => (
                <span>
                    <span className="text-green-500">{params.row.correct}</span>
                    <span className="mx-1 text-gray-400">/</span>
                    <span className="text-red-500">{params.row.wrong}</span>
                </span>
            )
        },
        { field: 'performance', headerName: 'Performance', flex: 0.4,
            renderCell: (params: any) => {
                const actualScore = params.row.totalQuestions ? Math.round((params.row.correct / params.row.totalQuestions) * 100) : 0;
                let perf = 'Needs Work';
                if (actualScore >= 85) perf = 'Excellent';
                else if (actualScore >= 70) perf = 'Good';
                else if (actualScore >= 50) perf = 'Average';
                
                const color = perf === 'Excellent' ? 'bg-green-500' : perf === 'Good' ? 'bg-blue-500' : 'bg-orange-500';
                return (
                    <span className={`${color} text-white px-3 py-1 rounded-full text-[10px] font-bold`}>
                        {perf}
                    </span>
                )
            }
        },
        { field: 'created_at', headerName: "Date", flex: 0.5 },
    ];

    const rows: any = [];
    data && data.results.forEach((item: any) => {
        rows.push({
            id: item._id,
            title: item.title || "Quiz",
            score: item.score,
            totalQuestions: item.totalQuestions || 0,
            correct: item.correct,
            wrong: item.wrong,
            created_at: format(item.updatedAt || item.createdAt),
        });
    });

    return (
        <div className="w-full mt-8">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <PiExamFill className="text-[#39c1f3]" />
                    Recent Quiz Results
                </h2>
                <Link
                    to="/student/quizzes"
                    className="text-sm text-[#39c1f3] hover:underline flex items-center gap-1 font-medium"
                >
                    Attend Quizzes <PiArrowRightBold size={14} />
                </Link>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <Box
                    height="40vh"
                    sx={{
                        "& .MuiDataGrid-root": { border: "none", outline: "none" },
                        "& .MuiDataGrid-row": {
                            color: theme === "dark" ? "#fff" : "#000",
                            borderBottom: theme === "dark" ? "1px solid #ffffff30!important" : "1px solid #ccc!important",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                            color: theme === "dark" ? "#fff" : "#000",
                        },
                        "& .MuiTablePagination-root": {
                            color: "#fff !important",
                        },
                        "& .MuiTablePagination-selectIcon": {
                            color: "#fff !important",
                        },
                        "& .MuiDataGrid-footerContainer": {
                            background: "linear-gradient(to right, #39c1f3, #2a9fd8) !important",
                            color: "#fff !important",
                            borderTop: "none",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: theme === "dark" ? "#111c43" : "#F2F0F0",
                        },
                    }}
                >
                    <DataGrid rows={rows} columns={columns} />
                </Box>
            )}
        </div>
    );
};

export default StudentQuizResults;
