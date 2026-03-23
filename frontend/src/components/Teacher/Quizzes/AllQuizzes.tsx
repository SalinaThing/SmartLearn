import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Modal } from '@mui/material';
import { AiOutlineDelete } from 'react-icons/ai';
import { FiEdit2 } from 'react-icons/fi';
import { useDeleteQuizMutation, useGetQuizzesByCourseQuery } from '@/redux/features/quizzes/quizApi';
import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import Loader from '../../Loader/Loader';
import { format } from "timeago.js";
import { styles } from '@/styles/style';
import toast from 'react-hot-toast';
import { useTheme } from '@/utils/ThemeProvider';

const AllQuizzes = () => {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const [quizId, setQuizId] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");

    const { data: coursesData } = useGetAllCoursesQuery({});
    const { isLoading, data, refetch, error } = useGetQuizzesByCourseQuery(selectedCourse, { skip: !selectedCourse });
    const [deleteQuiz, { isSuccess, error: errorDelete }] = useDeleteQuizMutation();

    useEffect(() => {
        if (coursesData && coursesData.courses.length > 0 && !selectedCourse) {
            setSelectedCourse(coursesData.courses[0]._id);
        }
    }, [coursesData]);

    useEffect(() => {
        if (isSuccess) {
            setOpen(false);
            refetch();
            toast.success("Quiz deleted successfully");
        }
        if (errorDelete) {
            toast.error("Failed to delete quiz");
        }
    }, [isSuccess, errorDelete]);

    const handleDelete = async () => {
        await deleteQuiz(quizId);
    };

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'title', headerName: 'Quiz Title', flex: 1 },
        { field: 'questions', headerName: 'Questions', flex: 0.3 },
        { field: 'created_at', headerName: "Created At", flex: 0.5 },
        {
            field: 'edit', headerName: "Edit", flex: 0.2,
            renderCell: (params: any) => (
                <FiEdit2 className="dark:text-white text-black cursor-pointer" size={20} />
            )
        },
        {
            field: 'delete', headerName: "Delete", flex: 0.2,
            renderCell: (params: any) => (
                <Button onClick={() => { setQuizId(params.row.id); setOpen(true); }}>
                    <AiOutlineDelete className="dark:text-white text-black" size={20} />
                </Button>
            )
        }
    ];

    const rows: any = [];
    data && data.quizzes.forEach((item: any) => {
        rows.push({
            id: item._id,
            title: item.title,
            questions: item.questions.length,
            created_at: format(item.createdAt),
        });
    });

    return (
        <div className="mt-[120px]">
            {isLoading ? (
                <Loader />
            ) : (
                <Box m="20px">
                    <div className="w-full flex justify-end mb-4">
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className={`${styles.input} !w-[250px]`}
                        >
                            {coursesData?.courses.map((course: any) => (
                                <option key={course._id} value={course._id}>{course.name}</option>
                            ))}
                        </select>
                    </div>
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
                            "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                        }}
                    >
                        <DataGrid checkboxSelection rows={rows} columns={columns} />
                    </Box>

                    {open && (
                        <Modal open={open} onClose={() => setOpen(!open)}>
                            <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-6 bg-white dark:bg-slate-900 rounded-lg">
                                <h1 className={styles.title}>Are you sure you want to delete this quiz?</h1>
                                <div className="flex w-full items-center justify-between mt-6">
                                    <div className={`${styles.button} !w-[120px] !h-[30px] bg-[#57c7a3]`} onClick={() => setOpen(!open)}>Cancel</div>
                                    <div className={`${styles.button} !w-[120px] !h-[30px] bg-[#d63f3f]`} onClick={handleDelete}>Delete</div>
                                </div>
                            </Box>
                        </Modal>
                    )}
                </Box>
            )}
        </div>
    );
};

export default AllQuizzes;
