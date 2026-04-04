

import { useTheme } from '@/utils/ThemeProvider';
import React, { FC, useMemo, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Button, Modal } from '@mui/material';
import { AiOutlineDelete, AiOutlineMail } from 'react-icons/ai';
import Loader from '../../Loader/Loader';
import { format } from "timeago.js";
import { useDeleteUserMutation, useGetAllUsersQuery, useUpdateUserRoleMutation } from '@/redux/features/user/userApi';
import { useUser } from '@/hooks/useUser';
import { styles } from '@/styles/style';
import { toast } from 'react-hot-toast';

type Props = {
    isTeam?: boolean;
}

type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
    courses: Array<unknown>;
    createdAt: string;
};

type UserRow = {
    id: string;
    name: string;
    email: string;
    role: string;
    courses: number;
    created_at: string;
};

const AllUsers: FC<Props> = ({ isTeam }) => {

    const { user } = useUser();
    const isAdmin = user?.role?.toLowerCase() === "admin";
    const { theme } = useTheme();
    const [active, setActive] = useState(false);
    const [role, setRole] = useState("teacher");
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState("");

    const [updateUserRole] = useUpdateUserRoleMutation();

    const { isLoading, data, refetch } = useGetAllUsersQuery({}, {
        refetchOnMountOrArgChange: true,
    });

    const [deleteUser] = useDeleteUserMutation();


    const columns: GridColDef<UserRow>[] = [
        { field: 'id', headerName: 'ID', flex: 0.3 },
        { field: 'name', headerName: 'User Name', flex: 0.5 },
        { field: 'email', headerName: 'Email', flex: 0.5 },
        { field: 'role', headerName: 'Role', flex: 0.5 },
        { field: 'courses', headerName: 'Purchased Courses', flex: 0.5 },
        { field: 'created_at', headerName: "Joined At", flex: 0.5 },

        {
            field: 'action-delete',
            headerName: "Delete",
            flex: 0.2,
            sortable: false,
            renderCell: (params: GridRenderCellParams<UserRow>) => (
                <Button
                    onClick={() => {
                        setUserId(params.row.id);
                        setOpen(true);
                    }}
                >
                    <AiOutlineDelete
                        className="dark:text-white text-black"
                        size={20}
                    />
                </Button>
            ),
        },

        {
            field: 'action-email',
            headerName: "Email",
            flex: 0.2,
            sortable: false,
            renderCell: (params: GridRenderCellParams<UserRow>) => (
                <a href={`mailto:${params.row.email}`}>
                    <AiOutlineMail
                        className="dark:text-white text-black"
                        size={20}
                    />
                </a>
            ),
        },
    ];

    const rows = useMemo<UserRow[]>(() => {
        if (!data || !Array.isArray(data.users)) {
            return [];
        }

        const filteredUsers = isTeam
            ? data.users.filter((user: User) => user.role === "teacher")
            : data.users;

        return filteredUsers.map((user: User) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            courses: Array.isArray(user.courses) ? user.courses.length : 0,
            created_at: format(user.createdAt),
        }));
    }, [data, isTeam]);
    const handleSubmit = async () => {
        if (!userId) {
            toast.error("Please select or enter a user ID to update");
            return;
        }

        try {
            await updateUserRole({ id: userId, role }).unwrap();
            toast.success("User role updated successfully");
            setActive(false);
            await refetch();
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "data" in error) {
                const e = error as { data?: { message?: string } };
                toast.error(e.data?.message || "Failed to update user role");
            } else {
                toast.error("Failed to update user role");
            }
        }
    };

    const handleDelete = async () => {
        if (!userId) {
            toast.error("No user selected to delete");
            return;
        }
        try {
            await deleteUser(userId).unwrap();
            toast.success("Delete user successfully!");
            setOpen(false);
            await refetch();
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "data" in error) {
                const e = error as { data?: { message?: string } };
                toast.error(e.data?.message || "Failed to delete user");
            } else {
                toast.error("Failed to delete user");
            }
        }
    };


    return (
        <div className="w-full">
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <Box m="0">
                        <div className="w-full flex justify-between items-center mb-6">
                            <h1 className="text-[25px] font-Poppins font-bold">
                                <span className="text-black dark:text-white">All</span>
                                <span className="text-[#3ccbae] ml-2">Users</span>
                            </h1>
                            <div
                                className={`${styles.button} !w-[220px] dark:bg-["#1c60e7"] !h-[35px] dark:border dark:border-["#ffffff6c"]`}
                                onClick={() => setActive(!active)}
                            >
                                Add New Member
                            </div>
                        </div>

                        <Box
                            m="15px 0 0 0"
                            height="80vh"
                            sx={{
                                "& .MuiDataGrid-root": {
                                    border: "none",
                                    outline: "none",
                                },

                                "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                                    color: theme === "dark" ? "#fff" : "#000",
                                },

                                "& .MuiDataGrid-sortIcon": {
                                    color: theme === "dark" ? "#fff" : "#000",
                                },

                                "& .MuiDataGrid-row": {
                                    color: theme === "dark" ? "#fff" : "#000",
                                    borderBottom: theme === "dark"
                                        ? "1px solid #ffffff30!important"
                                        : "1px solid #ccc!important",
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

                                "& .MuiTablePagination-root": {
                                    color: theme === "dark" ? "#fff" : "#000",
                                },

                                "& .MuiDataGrid-cell": {
                                    borderBottom: "none",
                                },

                                "& .name-column--cell": {
                                    color: theme === "dark" ? "#fff" : "#000",
                                },

                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: theme === "dark" ? "#1F2A40 !important" : "#F3F4F6 !important",
                                    borderBottom: "1px solid #ffffff30",
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiDataGrid-topContainer, & .MuiDataGrid-filler, & .MuiDataGrid-columnHeader": {
                                    backgroundColor: theme === "dark" ? "#1F2A40 !important" : "#F3F4F6 !important",
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiDataGrid-columnHeaderTitle": {
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },

                                "& .MuiDataGrid-virtualScroller": {
                                    backgroundColor: theme === "dark" ? "#1F2A40 !important" : "#ffffff !important",
                                },

                                "& .MuiDataGrid-footerContainer": {
                                    backgroundColor: theme === "dark" ? "#1F2A40 !important" : "#A4A9FC !important",
                                    borderTop: "1px solid #ffffff30",
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },

                                "& .MuiCheckbox-root": {
                                    color:
                                        theme === "dark"
                                            ? "#b7ebde !important"
                                            : "#3ccbae !important",
                                },

                                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                    color: `#fff !important`,
                                },
                            }}
                        >
                            <DataGrid
                                checkboxSelection
                                rows={rows}
                                columns={columns}
                            />
                        </Box>

                        <Modal
                            open={active}
                            onClose={() => setActive(false)}
                            aria-labelledby="add-member-modal-title"
                        >
                            <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white dark:bg-slate-900 rounded-xl p-6 shadow-2xl outline-none border border-gray-200 dark:border-gray-700">
                                <h3 id="add-member-modal-title" className={`${styles.title} mb-4 text-left`}>Update Team Member Role</h3>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User ID</label>
                                    <input
                                        type="text"
                                        placeholder="Enter User ID..."
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        className={`${styles.input}`}
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Role Access (Dashboard & Sidebar)</label>
                                    <select
                                        className={`${styles.input}`}
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="student">Student (Standard Access)</option>
                                        <option value="teacher">Teacher (Teacher Dashboard)</option>
                                        <option value="admin">Admin (Full Dashboard)</option>
                                    </select>
                                </div>

                                <div className="flex w-full justify-end gap-3 mt-4">
                                    <button
                                        className={`${styles.button} !w-[120px] !h-[35px] bg-gray-500`}
                                        onClick={() => setActive(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={`${styles.button} !w-[120px] !h-[35px]`}
                                        onClick={handleSubmit}
                                    >
                                        Save Role
                                    </button>
                                </div>
                            </Box>
                        </Modal>

                        {open && (
                            <Modal
                                open={open}
                                onClose={() => setOpen(!open)}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">

                                    <h1 className={`${styles.title}`}>
                                        Are you sure you want to delete this user?
                                    </h1>

                                    <div className="flex w-full items-center justify-between mb-6 mt-6">

                                        <div
                                            className={`${styles.button} !w-[120px] !h-[30px] bg-[#57c7a3]`}
                                            onClick={() => setOpen(!open)}
                                        >
                                            Cancel
                                        </div>

                                        <div
                                            className={`${styles.button} !w-[120px] !h-[30px] bg-[#d63f3f]`}
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </div>

                                    </div>

                                </Box>
                            </Modal>
                        )}
                    </Box>
                )
            }
        </div>
    );
}

export default AllUsers
