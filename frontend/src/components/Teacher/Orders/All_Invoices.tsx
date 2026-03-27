import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from '@/utils/ThemeProvider';
import React, { useEffect, useState } from 'react'
import Loader from '../../Loader/Loader';
import { Box } from '@mui/material';
import { format } from "timeago.js";
import { useGetAllOrdersQuery } from '@/redux/features/orders/orderApi';
import { AiOutlineMail, AiOutlineUser, AiOutlineShoppingCart, AiOutlineDollarCircle } from 'react-icons/ai';
import { FaRegClock } from 'react-icons/fa';
import { useSendDirectEmailMutation } from '@/redux/features/user/userApi';
import toast from 'react-hot-toast';

type Props = {
  isDashboard?: boolean;
}

const All_Invoices = ({ isDashboard }: Props) => {
  const { theme, setTheme } = useTheme();
  const { isLoading, data } = useGetAllOrdersQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});

  const [orderData, setOrderData] = useState<any>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendDirectEmail, { isLoading: isSending }] = useSendDirectEmailMutation();

  useEffect(() => {
    if (data) {
      const temp = data.orders.map((item: any) => {
        const user = usersData?.users.find(
          (user: any) => user._id === item.userId
        );

        const course = coursesData?.courses.find(
          (course: any) => course._id === item.courseId
        );

        return {
          ...item,
          userName: user?.name || 'Unknown User',
          userEmail: user?.email || 'No Email',
          title: course?.name || 'Course Not Found',
          price: course?.price ? "Rs." + course?.price : "Rs. 0",
        };
      })
      setOrderData(temp);
    }
  }, [data, usersData, coursesData]);

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }
    try {
      await sendDirectEmail({
        email: selectedOrder.userEmail,
        subject: emailSubject,
        message: emailMessage,
      }).unwrap();
      toast.success('Email sent successfully!');
      setShowEmailForm(false);
      setEmailSubject('');
      setEmailMessage('');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to send email');
    }
  };

  // Define columns with better styling
  const columns: any = [
    { 
      field: "id", 
      headerName: "Order ID", 
      flex: 0.4,
      minWidth: 100,
      renderCell: (params: any) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs">{params.value?.slice(-8)}</span>
        </div>
      )
    },
    { 
      field: "userName", 
      headerName: "Customer", 
      flex: isDashboard ? 0.7 : 0.5,
      minWidth: 150,
      renderCell: (params: any) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{params.value}</span>
        </div>
      )
    },

    ...(isDashboard
      ? []
      : [
          { 
            field: "userEmail", 
            headerName: "Email", 
            flex: 1,
            minWidth: 200,
            renderCell: (params: any) => (
              <div className="flex items-center gap-2">
                <a 
                  href={`mailto:${params.value}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {params.value}
                </a>
              </div>
            )
          },
          { 
            field: "title", 
            headerName: "Course", 
            flex: 1,
            minWidth: 200,
            renderCell: (params: any) => (
              <div className="flex items-center gap-2">
                <span className="truncate max-w-[200px]">{params.value}</span>
              </div>
            )
          },
        ]),

    { 
      field: "price", 
      headerName: "Amount", 
      flex: 0.4,
      minWidth: 100,
      renderCell: (params: any) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-green-600 dark:text-green-400">{params.value}</span>
        </div>
      )
    },

    ...(isDashboard
      ? [
          { 
            field: "created_at", 
            headerName: "Date", 
            flex: 0.5,
            minWidth: 120,
            renderCell: (params: any) => (
              <div className="flex items-center gap-2">
                <span className="text-sm">{params.value}</span>
              </div>
            )
          },
        ]
      : [
          {
            field: "actions",
            headerName: "Actions",
            flex: 0.3,
            minWidth: 130,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => setSelectedOrder(params.row)}
                  className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  View Details
                </button>
              );
            },
          },
        ]),
  ];

  // Prepare rows data
  const rows: any = [];

  orderData &&
    orderData.forEach((item: any) => {
      rows.push({
        id: item._id,
        userName: item.userName,
        userEmail: item.userEmail,
        title: item.title,
        price: item.price,
        created_at: format(item.createdAt),
      })
    })

  return (
    <>
      <div className="w-full">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : (
          <Box m={isDashboard ? "0" : "40px"}>
            <Box
              m={isDashboard ? "0" : "40px 0 0 0"}
              height={isDashboard ? "auto" : "85vh"}
              minHeight={isDashboard ? "400px" : "auto"}
              overflow={"auto"}
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                  outline: "none",
                  borderRadius: "12px",
                  boxShadow: theme === "dark" ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)",
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
                    : "1px solid #e0e0e0!important",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: theme === "dark"
                      ? "rgba(255, 255, 255, 0.05)!important"
                      : "rgba(0, 0, 0, 0.02)!important",
                  },
                },
                "& .MuiTablePagination-root": {
                  color: theme === "dark" ? "#fff" : "#000",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none!important",
                  padding: "12px 16px",
                },
                "& .MuiDataGrid-columnHeader": {
                  padding: "12px 16px",
                },
                "& .name-column--cell": {
                  color: theme === "dark" ? "#fff" : "#000",
                  fontWeight: 500,
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                  borderBottom: "none",
                  color: theme === "dark" ? "#fff" : "#000",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  borderRadius: "12px 12px 0 0",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
                },
                "& .MuiDataGrid-footerContainer": {
                  color: theme === "dark" ? "#fff" : "#000",
                  borderTop: "none",
                  backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                  borderRadius: "0 0 12px 12px",
                },
                "& .MuiCheckbox-root": {
                  color: theme === "dark"
                    ? "#b7ebde !important"
                    : "#000 !important",
                },
                "& .MuiDataGrid-toolbarContainer": {
                  padding: "12px 16px",
                  backgroundColor: theme === "dark" ? "#2D3A4E" : "#E8EAF6",
                  borderRadius: "12px 12px 0 0",
                  "& .MuiButton-text": {
                    color: "#fff !important",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: theme === "dark"
                        ? "rgba(255,255,255,0.1) !important"
                        : "rgba(255,255,255,0.2) !important",
                    },
                  },
                },
              }}
            >
              <DataGrid
                checkboxSelection={!isDashboard}
                rows={rows}
                columns={columns}
                slots={isDashboard ? {} : { toolbar: GridToolbar }}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: isDashboard ? 5 : 10 },
                  },
                  sorting: {
                    sortModel: [{ field: 'created_at', sort: 'desc' }],
                  },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                disableRowSelectionOnClick
                autoHeight={isDashboard}
                density="comfortable"
                onRowClick={(params) => !isDashboard && setSelectedOrder(params.row)}
              />
            </Box>
          </Box>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && !isDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#111C43] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-white hover:text-gray-200 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-white/80 mt-1">Order ID: {selectedOrder.id?.slice(-12)}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="border-b dark:border-gray-700 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <AiOutlineUser className="text-blue-500" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="text-base font-medium text-gray-800 dark:text-white">{selectedOrder.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <a href={`mailto:${selectedOrder.userEmail}`} className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline">
                      {selectedOrder.userEmail}
                    </a>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="border-b dark:border-gray-700 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <AiOutlineShoppingCart className="text-green-500" />
                  Order Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Course</p>
                    <p className="text-base font-medium text-gray-800 dark:text-white">{selectedOrder.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedOrder.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Purchase Date</p>
                    <p className="text-base text-gray-800 dark:text-white">{selectedOrder.created_at}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons / Email Form */}
              {!showEmailForm ? (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowEmailForm(true);
                      setEmailSubject(`Regarding your order: ${selectedOrder.title}`);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <AiOutlineMail size={18} />
                    Send Email
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="pt-4 space-y-3">
                  <h4 className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <AiOutlineMail className="text-blue-500" />
                    Compose Email to {selectedOrder.userName}
                  </h4>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email subject..."
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Message</label>
                    <textarea
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Write your message here..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSendEmail}
                      disabled={isSending}
                      className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      {isSending ? 'Sending...' : 'Send Email'}
                    </button>
                    <button
                      onClick={() => {
                        setShowEmailForm(false);
                        setEmailSubject('');
                        setEmailMessage('');
                      }}
                      className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default All_Invoices