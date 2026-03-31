import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useGetAllFeedbackQuery } from '@/redux/features/feedback/feedbackApi';
import Loader from '../../Loader/Loader';
import { format } from "timeago.js";
import { useTheme } from '@/utils/ThemeProvider';

const AllFeedback = () => {
    const { theme } = useTheme();
    const { isLoading, data } = useGetAllFeedbackQuery({});

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.3 },
        { field: 'lectureTitle', headerName: 'Lecture Title', flex: 1.0 },
        { field: 'courseName', headerName: 'Course Name', flex: 0.8 },
        { field: 'rating', headerName: 'Rating', flex: 0.3 },
        { field: 'comment', headerName: 'Comment', flex: 1.5 },
        { field: 'created_at', headerName: "Date", flex: 0.5 },
    ];

    const rows: any = [];
    data && data.feedback.forEach((item: any) => {
        rows.push({
            id: item._id,
            lectureTitle: item.contentTitle || "General",
            courseName: item.courseId?.name || "General",
            rating: item.rating,
            comment: item.comment,
            created_at: format(item.createdAt),
        });
    });

    return (
        <div className="mt-[120px]">
            {isLoading ? (
                <Loader />
            ) : (
                <Box m="20px">
                    <h1 className="text-[25px] font-Poppins font-bold mb-6">
                        <span className="text-black dark:text-white">Current</span>
                        <span className="text-[#3ccbae] ml-2">Feedback</span>
                    </h1>
                    <Box
                        height="80vh"
                        sx={{
                            "& .MuiDataGrid-root": { border: "none", outline: "none" },
                            "& .MuiDataGrid-row": {
                                color: theme === "dark" ? "#fff !important" : "#000 !important",
                                borderBottom: theme === "dark" ? "1px solid #ffffff30!important" : "1px solid #ccc!important",
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: theme === "dark" ? "#2D3A4E !important" : "#A4A9FC !important",
                                color: theme === "dark" ? "#fff !important" : "#000 !important",
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: theme === "dark" ? "#1F2A40 !important" : "#ffffff !important",
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: theme === "dark" ? "#2D3A4E !important" : "#A4A9FC !important",
                                color: theme === "dark" ? "#fff !important" : "#000 !important",
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

export default AllFeedback;
