import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useGetAllResultsQuery } from '@/redux/features/quizzes/resultApi';
import Loader from '../../Loader/Loader';
import { format } from "timeago.js";
import { useTheme } from '@/utils/ThemeProvider';

const AllResultsTeacher = () => {
    const { theme } = useTheme();
    const { isLoading, data } = useGetAllResultsQuery({});

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.3 },
        { field: 'userName', headerName: 'Student Name', flex: 0.5 },
        { field: 'title', headerName: 'Quiz Title', flex: 0.8 },
        { field: 'totalQuestions', headerName: 'Total Qs', flex: 0.3 },
        { field: 'correct', headerName: 'Correct', flex: 0.3 },
        { field: 'wrong', headerName: 'Wrong', flex: 0.3 },
        { field: 'score', headerName: 'Score %', flex: 0.3, 
            renderCell: (params: any) => {
                const percentage = params.row.totalQuestions ? Math.round((params.row.correct / params.row.totalQuestions) * 100) : 0;
                return (
                    <span className={`font-semibold ${percentage >= 50 ? "text-green-500" : "text-red-500"}`}>
                        {percentage}%
                    </span>
                );
            }
        },
        { field: 'created_at', headerName: "Date", flex: 0.5 },
    ];

    const rows: any = [];
    data && data.results.forEach((item: any) => {
        rows.push({
            id: item._id,
            userName: item.user?.name || "N/A",
            title: item.title,
            totalQuestions: item.totalQuestions,
            correct: item.correct,
            wrong: item.wrong,
            created_at: format(item.createdAt),
        });
    });

    return (
        <div className="mt-2 text-black dark:text-white">
            {isLoading ? (
                <Loader />
            ) : (
                <Box m="20px">
                    <Box
                        m="10px 0 0 0"
                        height="80vh"
                        sx={{
                            "& .MuiDataGrid-root": { border: "none", outline: "none" },
                            "& .MuiDataGrid-row": {
                                color: theme === "dark" ? "#fff" : "#000",
                                borderBottom: theme === "dark" ? "1px solid #ffffff30!important" : "1px solid #ccc!important",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    backgroundColor: theme === "dark"
                                        ? "rgba(255, 255, 255, 0.05)!important"
                                        : "rgba(0, 0, 0, 0.02)!important",
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },
                                "&.Mui-selected": {
                                    backgroundColor: theme === "dark"
                                        ? "rgba(255, 255, 255, 0.1) !important"
                                        : "rgba(0, 0, 0, 0.08) !important",
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },
                                "&.Mui-selected:hover": {
                                    backgroundColor: theme === "dark"
                                        ? "rgba(255, 255, 255, 0.15) !important"
                                        : "rgba(0, 0, 0, 0.12) !important",
                                },
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                background: "linear-gradient(to right, #39c1f3, #2a9fd8) !important",
                                color: "#fff !important",
                                borderBottom: "none",
                            },
                            "& .MuiDataGrid-topContainer, & .MuiDataGrid-filler, & .MuiDataGrid-columnHeader": {
                                background: "transparent !important", // let the columnHeaders background show through
                                color: "#fff !important",
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                color: "#fff !important",
                                fontWeight: "600",
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: theme === "dark" ? "#111C43 !important" : "#f5f5f5 !important",
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: theme === "dark" ? "#1F2A40 !important" : "#F3F4F6 !important",
                                color: theme === "dark" ? "#fff !important" : "#000 !important",
                                borderTop: "1px solid #ffffff30",
                            },
                            // Checkboxes
                            "& .MuiCheckbox-root": {
                                color: theme === "dark" ? "#39c1f3 !important" : "#39c1f3 !important",
                            },
                            "& .MuiCheckbox-root.Mui-checked": {
                                color: "#39c1f3 !important",
                            },
                            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                color: "#39c1f3 !important",
                            },
                        }}
                    >
                        <DataGrid checkboxSelection rows={rows} columns={columns} />
                    </Box>
                </Box>
            )}
        </div>
    );
};

export default AllResultsTeacher;
