import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Modal } from '@mui/material';
import { AiOutlineDelete } from 'react-icons/ai';
import { useDeleteAnnouncementMutation, useGetAnnouncementsByCourseQuery } from '@/redux/features/announcements/announcementApi';
import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import Loader from '../../Loader/Loader';
import { format } from "timeago.js";
import { styles } from '@/styles/style';
import toast from 'react-hot-toast';
import { useTheme } from '@/utils/ThemeProvider';

const AllAnnouncements = () => {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const [announcementId, setAnnouncementId] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");

    const { data: coursesData } = useGetAllCoursesQuery({});
    const { isLoading, data, refetch } = useGetAnnouncementsByCourseQuery(selectedCourse, { skip: !selectedCourse });
    const [deleteAnnouncement, { isSuccess, error: errorDelete }] = useDeleteAnnouncementMutation();

    useEffect(() => {
        if (coursesData && coursesData.courses.length > 0 && !selectedCourse) {
            setSelectedCourse(coursesData.courses[0]._id);
        }
    }, [coursesData]);

    useEffect(() => {
        if (isSuccess) {
            setOpen(false);
            refetch();
            toast.success("Announcement deleted successfully");
        }
        if (errorDelete) {
            toast.error("Failed to delete announcement");
        }
    }, [isSuccess, errorDelete]);

    const handleDelete = async () => {
        await deleteAnnouncement(announcementId);
    };

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'content', headerName: 'Content', flex: 1.5 },
        { field: 'created_at', headerName: "Created At", flex: 0.5 },
        {
            field: 'delete', headerName: "Delete", flex: 0.2,
            renderCell: (params: any) => (
                <Button onClick={() => { setAnnouncementId(params.row.id); setOpen(true); }}>
                    <AiOutlineDelete className="dark:text-white text-black" size={20} />
                </Button>
            )
        }
    ];

    const rows: any = [];
    data && data.announcements.forEach((item: any) => {
        rows.push({
            id: item._id,
            title: item.title,
            content: item.content,
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
                            <option value="">Select Course</option>
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
                        }}
                    >
                        <DataGrid checkboxSelection rows={rows} columns={columns} />
                    </Box>

                    {open && (
                        <Modal open={open} onClose={() => setOpen(!open)}>
                            <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-6 bg-white dark:bg-slate-900 rounded-lg">
                                <h1 className={styles.title}>Are you sure you want to delete this announcement?</h1>
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

export default AllAnnouncements;
