import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Modal } from '@mui/material';
import { AiOutlineDelete } from 'react-icons/ai';
import { FiEdit2 } from 'react-icons/fi';
import { useDeleteQuizMutation, useGetQuizzesByCourseQuery } from '@/redux/features/quizzes/quizApi';
import { useGetAllResultsQuery } from '@/redux/features/quizzes/resultApi';
import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import Loader from '../../Loader/Loader';
import { format } from "timeago.js";
import { styles } from '@/styles/style';
import toast from 'react-hot-toast';
import { useTheme } from '@/utils/ThemeProvider';

type Props = {
    setRoute: (route: string) => void;
    setQuizData: (data: any) => void;
}

const AllQuizzes = ({ setRoute, setQuizData }: Props) => {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const [quizId, setQuizId] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");

    const { data: coursesData } = useGetAllCoursesQuery({});
    const { isLoading, data, refetch, error } = useGetQuizzesByCourseQuery(selectedCourse, { skip: !selectedCourse });
    const [deleteQuiz, { isSuccess, error: errorDelete }] = useDeleteQuizMutation();
    const { data: allResultsData } = useGetAllResultsQuery({});
    const [resultsModalOpen, setResultsModalOpen] = useState(false);
    const [viewingQuizId, setViewingQuizId] = useState("");

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
                <FiEdit2
                    className="dark:text-white text-black cursor-pointer"
                    size={20}
                    onClick={() => {
                        setQuizData(params.row.item);
                        setRoute("Edit Quiz");
                    }}
                />
            )
        },
        {
            field: 'results', headerName: "Results", flex: 0.2,
            renderCell: (params: any) => (
                <Button onClick={() => { setViewingQuizId(params.row.id); setResultsModalOpen(true); }}>
                    <FiEdit2 className="dark:text-white text-black cursor-pointer" size={20} />
                </Button>
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
            item: item,
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
                                backgroundColor: theme === "dark" ? "#1F2A40 !important" : "#F3F4F6 !important",
                                color: theme === "dark" ? "#fff !important" : "#000 !important",
                                borderBottom: "1px solid #ffffff30",
                            },
                            "& .MuiDataGrid-topContainer, & .MuiDataGrid-filler, & .MuiDataGrid-columnHeader": {
                                backgroundColor: theme === "dark" ? "#1F2A40 !important" : "#F3F4F6 !important",
                                color: theme === "dark" ? "#fff !important" : "#000 !important",
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                color: theme === "dark" ? "#fff !important" : "#000 !important",
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: theme === "dark" ? "#1F2A40 !important" : "#f5f5f5 !important",
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: theme === "dark" ? "#1F2A40 !important" : "#F3F4F6 !important",
                                color: theme === "dark" ? "#fff !important" : "#000 !important",
                                borderTop: "1px solid #ffffff30",
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

                    {resultsModalOpen && (
                        <Modal open={resultsModalOpen} onClose={() => setResultsModalOpen(false)}>
                            <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] p-6 bg-white dark:bg-slate-900 rounded-lg max-h-[80vh] overflow-y-auto">
                                <h1 className={styles.title}>Quiz Results</h1>
                                <div className="mt-4 flex flex-col gap-3">
                                    {(allResultsData?.results || [])
                                        .filter((r: any) => r.quizId === viewingQuizId)
                                        .map((result: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg">
                                                <div>
                                                    <p className="dark:text-white font-medium">{result.user?.name || "Unknown Student"}</p>
                                                    <p className="text-xs text-gray-500">{result.user?.email || "N/A"}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`font-bold ${Math.round(result.score) >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {Math.round(result.score)}%
                                                    </span>
                                                    <span className="text-xs text-gray-500">{result.correct} / {result.totalQuestions} correct</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    {(allResultsData?.results || []).filter((r: any) => r.quizId === viewingQuizId).length === 0 && (
                                        <p className="text-center mt-6 dark:text-gray-400 text-gray-600">No students have taken this quiz yet.</p>
                                    )}
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button className={`${styles.button} !w-[120px]`} onClick={() => setResultsModalOpen(false)}>Close</button>
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
