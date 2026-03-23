

import { useTheme } from '@/utils/ThemeProvider';
import React, { FC, useMemo, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Button, Modal } from '@mui/material';
import { AiOutlineDelete, AiOutlineMail } from 'react-icons/ai';
import Loader from '../../Loader/Loader';
import { format } from "timeago.js";
import { useDeleteUserMutation, useGetAllUsersQuery, useUpdateUserRoleMutation } from '@/redux/features/user/userApi';
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

const AllUsers: FC<Props> = ({isTeam}) => {

    const {theme} = useTheme();
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
  <div className="mt-[120px]">
    {
        isLoading ? (
            <Loader />
        ) : (
            <Box m="20px">
                <div className="w-full flex justify-end">
                    <div 
                        className={`${styles.button} !w-[220px] dark:bg-["#1c60e7"] !h-[35px] dark:border dark:border-["#ffffff6c"]`}
                        onClick={() => setActive(!active)}
                    >
                        Add New Member
                    </div>
                </div>

                <Box
                    m="40px 0 0 0"
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
                        borderBottom:
                        theme === "dark"
                            ? "1px solid #ffffff30!important"
                            : "1px solid #ccc!important",
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
                        backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                        borderBottom: "none",
                        color: theme === "dark" ? "#fff" : "#000",
                    },

                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
                    },

                    "& .MuiDataGrid-footerContainer": {
                        backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                        borderTop: "none",
                        color: theme === "dark" ? "#fff" : "#000",
                    },

                    "& .MuiCheckbox-root": {
                        color:
                        theme === "dark"
                            ? "#b7ebde !important"
                            : "#000 !important",
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

                {active && (
                    <div className="mt-6 p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900">
                        <h3 className={`${styles.title} mb-3`}>Update Team Member Role</h3>

                        <input
                            type="text"
                            placeholder="User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className={`${styles.input} mb-2`}
                        />

                        <select
                            className={`${styles.input} mb-2`}
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="teacher">Teacher</option>
                            <option value="student">Student</option>
                        </select>

                        <div className="flex gap-2">
                            <button
                                className={`${styles.button} !w-[120px] !h-[35px]`}
                                onClick={handleSubmit}
                            >
                                Save
                            </button>
                            <button
                                className={`${styles.button} !w-[120px] !h-[35px] bg-gray-500`}
                                onClick={() => setActive(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

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
