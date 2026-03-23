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
            renderCell: (params: any) => (
                <span>{((params.row.correct / params.row.totalQuestions) * 100).toFixed(0)}%</span>
            )
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
        <div className="mt-[120px]">
            {isLoading ? (
                <Loader />
            ) : (
                <Box m="20px">
                    <Box
                        m="40px 0 0 0"
                        height="80vh"
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
