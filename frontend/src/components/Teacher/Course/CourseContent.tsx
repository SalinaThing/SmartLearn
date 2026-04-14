

import { styles } from '@/styles/style';
import React, { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineDelete, AiOutlinePlusCircle } from 'react-icons/ai';
import { BsLink45Deg, BsPencil } from 'react-icons/bs';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useUploadPdfMutation, useUploadVideoMutation } from '@/redux/features/courses/coursesApi';

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any;
  setCourseContentData: (courseContentData: any) => void;
  handleSubmit: any;
}

const CourseContent: FC<Props> = ({
  active,
  setActive,
  courseContentData,
  setCourseContentData,
  handleSubmit: handleCourseSubmit
}) => {

  const [isCollapsed, setIsCollapsed] = useState(Array(courseContentData.length).fill(false));
  const [activeSection, setActiveSection] = useState(1);
  const [uploadVideo, { isLoading: videoUploading }] = useUploadVideoMutation();
  const [uploadPdf, { isLoading: pdfUploading }] = useUploadPdfMutation();

  useEffect(() => {
    setIsCollapsed((prev) => {
      const updated = [...prev];
      if (courseContentData.length > updated.length) {
        return [...updated, ...Array(courseContentData.length - updated.length).fill(false)];
      }
      return updated.slice(0, courseContentData.length);
    });
  }, [courseContentData.length]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
  }

  const handleCollapseToggle = (index: number) => {
    const updatedCollapsed = [...isCollapsed];
    updatedCollapsed[index] = !updatedCollapsed[index];
    setIsCollapsed(updatedCollapsed);
  }

  const handleRemoveLink = (index: number, linkIndex: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.splice(linkIndex, 1);
    setCourseContentData(updatedData);
  }

  const handleAddLink = (index: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.push({ title: "", url: "" });
    setCourseContentData(updatedData);
  }


  const newContentHandler = (item: any) => {
    if (item.title === "" || item.description === "" || (item.videoUrl === "" && item.pdfUrl === "")) {
      toast.error("Please fill title, description and at least one media (Video or PDF) first!!");
    } else {
      let newVideoSection = "";

      if (courseContentData.length > 0) {
        const lastVideoSection = courseContentData[courseContentData.length - 1].videoSection;

        //use the last videoSection if available, else use user input
        if (lastVideoSection) {
          newVideoSection = lastVideoSection;
        }
      }
      const newContent = {
        videoUrl: "",
        title: "",
        description: "",
        videoSection: newVideoSection,
      };

      setCourseContentData([...courseContentData, newContent])
    }
  }

  const addNewSection = () => {
    if (
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      (courseContentData[courseContentData.length - 1].videoUrl === "" &&
        courseContentData[courseContentData.length - 1].pdfUrl === "")
    ) {
      toast.error("Please fill all the fields first!!");
    } else {
      setActiveSection(activeSection + 1);
      const newContent = {
        videoUrl: "",
        title: "",
        description: "",
        videoSection: `Untitled Section ${activeSection}`,
      };
      setCourseContentData([...courseContentData, newContent]);
    }
  }
  const prevButton = () => {
    setActive(active - 1);
  }

  const handleOptions = async () => {
    if (
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      (courseContentData[courseContentData.length - 1].videoUrl === "" &&
        courseContentData[courseContentData.length - 1].pdfUrl === "")
    ) {
      toast.error("Section can't be empty!!")
    }
    else {
      await handleCourseSubmit();
      setActive(active + 1);
    }
  }

  const handleVideoUpload = async (e: any, index: number) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("video", file);
      try {
        const res: any = await uploadVideo(formData).unwrap();
        const updatedData = [...courseContentData];
        updatedData[index].videoUrl = res.url;
        setCourseContentData(updatedData);
        toast.success("Video uploaded successfully");
      } catch (err: any) {
        toast.error(err?.data?.message || "Video upload failed");
      }
    }
  };

  const handlePdfUpload = async (e: any, index: number) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("pdf", file);
      try {
        const res: any = await uploadPdf(formData).unwrap();
        const updatedData = [...courseContentData];
        updatedData[index].pdfUrl = res.url;
        if (!updatedData[index].pdfName) {
          updatedData[index].pdfName = res.originalName || file.name;
        }
        setCourseContentData(updatedData);
        toast.success("PDF uploaded successfully");
      } catch (err: any) {
        toast.error(err?.data?.message || "PDF upload failed");
      }
    }
  };
  return (
    <div className="w-[90%] m-auto mt-24 p-3">
      <form onSubmit={handleSubmit}>
        {courseContentData?.map((item: any, index: number) => {

          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;

          return (
            <React.Fragment key={`${index}-${item.videoSection}`}>
              <div
                className={`w-full bg-[#cdc8c817] p-4 ${showSectionInput ? "mt-10" : "mb-0"
                  }`}
              >
                {showSectionInput && (
                  <>
                    <div className="flex w-full items-center">
                      <input
                        type="text"
                        className={`text-[20px] ${item.videoSection === "Untitled Section"
                            ? "w-[170px]"
                            : "w-min"
                          } font-Poppins cursor-pointer dark:text-white text-black bg-transparent outline-none`}
                        value={item.videoSection}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].videoSection = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />

                      <BsPencil className="cursor-pointer dark:text-white text-black" />
                    </div>
                    <br />
                  </>

                )}
                <div className="flex w-full items-center justify-between my-0">
                  {isCollapsed[index] ? (
                    <>
                      {item.title ? (
                        <p className="font-Poppins dark:text-white text-black">
                          {index + 1}. {item.title}
                        </p>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <div></div>
                  )}

                  {/* arrow button for collapsed video content */}
                  <div className="flex items-center">
                    <AiOutlineDelete
                      className={`dark:text-white text-[20px] mr-2 text-black ${index > 0 ? "cursor-pointer" : "cursor-no-drop"
                        }`}
                      onClick={() => {
                        if (index > 0) {
                          const updatedData = [...courseContentData];
                          updatedData.splice(index, 1);
                          setCourseContentData(updatedData);
                        }
                      }}
                    />

                    <MdOutlineKeyboardArrowDown
                      fontSize="large"
                      className="dark:text-white text-black"
                      style={{
                        transform: isCollapsed[index]
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                      onClick={() => handleCollapseToggle(index)}
                    />
                  </div>
                </div>

                {!isCollapsed[index] && (
                  <>

                    {/* Video Title */}
                    <div className="my-3">
                      <label className={styles.label}>Video Title</label>
                      <input
                        type="text"
                        placeholder="Project Plan..."
                        className={`${styles.input}`}
                        value={item.title}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].title = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>

                    {/* Video URL Input */}
                    <div className="mb-3">
                      <label className={styles.label}>Video URL</label>
                      <input
                        type="text"
                        placeholder="Enter video URL (YouTube, Vimeo, Cloudinary, etc.)"
                        className={`${styles.input} mt-2`}
                        value={item.videoUrl}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].videoUrl = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>

                    {/* Video Length */}
                    <div className="mb-3">
                      <label className={styles.label}>Video Length (in minutes)</label>
                      <input
                        type="number"
                        placeholder="20"
                        className={`${styles.input}`}
                        value={item.videoLength}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].videoLength = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>

                    {/* PDF Upload */}
                    <div className="mb-4">
                      <label className={styles.label}>Course PDF (Optional)</label>
                      <div className="mt-2">
                        {item.pdfUrl ? (
                          <div className="flex items-center justify-between p-3 border dark:border-[#ffffff3b] border-[#00000021] rounded bg-blue-50 dark:bg-blue-900/10 transition-all animate-fade-in">
                            <div className="flex items-center overflow-hidden">
                              <span className="text-xl mr-2">📄</span>
                              <div className="flex flex-col overflow-hidden">
                                <span className="dark:text-white text-black truncate text-sm font-medium">
                                  {item.pdfName || "Uploaded PDF"}
                                </span>
                                <span className="text-xs text-gray-500 truncate">
                                  {item.pdfUrl.split('/').pop()}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedData = [...courseContentData];
                                updatedData[index].pdfUrl = "";
                                updatedData[index].pdfName = "";
                                setCourseContentData(updatedData);
                              }}
                              className="text-red-500 hover:text-red-700 text-sm font-semibold ml-4 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor={`pdf-upload-${index}`}
                              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer dark:border-gray-600 border-gray-300 dark:bg-gray-800 bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border-spacing-4 ${pdfUploading ? "opacity-50 pointer-events-none" : ""
                                }`}
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg
                                  className={`w-8 h-8 mb-4 ${pdfUploading ? "animate-bounce text-blue-500" : "text-gray-500 dark:text-gray-400"}`}
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 20 16"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                  />
                                </svg>
                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400 font-semibold text-center">
                                  {pdfUploading ? "Uploading PDF..." : "Click to upload lesson PDF"}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  PDF only (Optional)
                                </p>
                              </div>
                              <input
                                id={`pdf-upload-${index}`}
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => handlePdfUpload(e, index)}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* PDF Name */}
                    <div className="mb-4">
                      <label className={styles.label}>PDF Name (Display Purpose)</label>
                      <input
                        type="text"
                        placeholder="e.g., Week 1 Resources"
                        className={`${styles.input} mt-2`}
                        value={item.pdfName}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].pdfName = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>

                    {/* Video Description */}
                    <div className="mb-3">
                      <label className={styles.label}>Video Description</label>
                      <textarea
                        rows={8}
                        cols={30}
                        placeholder="//....."
                        className={`${styles.input} !h-min py-2`}
                        value={item.description}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].description = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                      <br />
                    </div>
                  </>
                )}
                <br />

                {/* add new content */}
                {
                  index === courseContentData.length - 1 && (
                    <div>
                      <p
                        className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                        onClick={(e: any) => newContentHandler(item)}
                      >
                        <AiOutlinePlusCircle className="mr-2" /> Add New Content
                      </p>
                    </div>
                  )
                }
              </div>
            </React.Fragment>
          )
        })}
        <br />

        <div
          className="flex items-center text-[20px] dark:text-white text-black cursor-pointer"
          onClick={(e: any) => addNewSection()}
        >
          <AiOutlinePlusCircle className="mr-2" /> Add new Section
        </div>
      </form>
      <br />

      <div className="w-full flex items-center justify-between">
        <div
          className="w-full 800px: w-[180px] flex items-center justify-center h-[40px] bg-[#39c1f3] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => prevButton()}
        >
          Prev
        </div>

        <div
          className="w-full 800px: w-[180px] flex items-center justify-center h-[40px] bg-[#39c1f3] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => handleOptions()}
        >
          Next
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
  )
}

export default CourseContent
