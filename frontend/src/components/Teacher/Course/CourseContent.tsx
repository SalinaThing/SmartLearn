

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
  courseContentData:any;
  setCourseContentData: (courseContentData: any) => void;
  handleSubmit: any;
}

const CourseContent : FC <Props> = ({
  active, 
  setActive, 
  courseContentData, 
  setCourseContentData, 
  handleSubmit:handleCourseSubmit
}) => {

  const [isCollapsed, setIsCollapsed] = useState(Array(courseContentData.length).fill(false));
  const [activeSection, setActiveSection] = useState(1);
  const [uploadPdf] = useUploadPdfMutation();
  const [uploadingPdfIndex, setUploadingPdfIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsCollapsed((prev) => {
      const updated = [...prev];
      if (courseContentData.length > updated.length) {
        return [...updated, ...Array(courseContentData.length - updated.length).fill(false)];
      }
      return updated.slice(0, courseContentData.length);
    });
  }, [courseContentData.length]);

  const handleSubmit = (e:any) => {
    e.preventDefault();
  }

  const handleCollapseToggle = (index:number) => {
        const updatedCollapsed = [...isCollapsed];
        updatedCollapsed[index] = !updatedCollapsed[index];
        setIsCollapsed(updatedCollapsed);
  }

  const handleRemoveLink = (index:number, linkIndex:number) => { 
        const updatedData = [ ...courseContentData];
        updatedData[index].links.splice(linkIndex,1);
        setCourseContentData(updatedData);
  }

  const handleAddLink = (index:number)  => {
        const updatedData = [ ...courseContentData];
        updatedData[index].links.push({title: "", url: ""});
        setCourseContentData(updatedData);
  }

  const handlePdfUpload = async (e: any, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }
    const formData = new FormData();
    formData.append('pdf', file);
    setUploadingPdfIndex(index);
    try {
      const result = await uploadPdf(formData).unwrap();
      const updatedData = [...courseContentData];
      updatedData[index].pdfUrl = result.url;
      updatedData[index].pdfName = result.originalName;
      setCourseContentData(updatedData);
      toast.success('PDF uploaded!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'PDF upload failed');
    } finally {
      setUploadingPdfIndex(null);
    }
  };

  const newContentHandler = (item:any) => {
    if(item.title ==="" || item.description ==="" || item.videoUrl === ""){
      toast.error("Please fill all the fields first!!");
    }else {
      let newVideoSection = "";

      if(courseContentData.length >0){
        const lastVideoSection = courseContentData[courseContentData.length - 1].videoSection;

        //use the last videoSection if available, else use user input
        if(lastVideoSection){
          newVideoSection =lastVideoSection;
        }
      }
      const newContent ={
        videoUrl: "",
        title:"",
        description: "",
        videoSection: newVideoSection,
      };

      setCourseContentData([...courseContentData, newContent])
    }
  }

  const addNewSection = () => {
    if(
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === "" 
    )
    {
      toast.error("Please fill all the fields first!!");
    } else{
        setActiveSection(activeSection+1);
        const newContent ={
          videoUrl: "",
          title:"",
          description: "",
          videoSection: `Untitled Section ${activeSection}`,
        };
      setCourseContentData([...courseContentData, newContent]);
      }
  }
   const prevButton = () => {
      setActive(active -1);
    }

  const handleOptions = async () => {
    if(
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === "" 
    )
    {
      toast.error("Section can't be empty!!")
    } 
    else {
      await handleCourseSubmit();
      setActive(active + 1);
    }
  }
  return (
    <div className="w-[80%] m-auto mt-24 p-3">
      <form onSubmit={handleSubmit}>
        {courseContentData?.map((item: any, index: number) => {

          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;

          return (
            <React.Fragment key={`${index}-${item.videoSection}`}> 
              <div
                className={`w-full bg-[#cdc8c817] p-4 ${
                  showSectionInput ? "mt-10" : "mb-0"
                }`}
              >
              {showSectionInput && (
                <>
                  <div className="flex w-full items-center">
                  <input 
                    type="text"
                    className={`text-[20px] ${
                      item.videoSection === "Untitled Section"
                        ? "w-[170px]"
                        :"w-min"
                    } font-Poppins cursor-pointer dark:text-white text-black bg-transparent outline-none`}
                     value={item.videoSection}
                     onChange={(e) =>{
                      const updatedData = [ ...courseContentData];
                      updatedData[index].videoSection = e.target.value;
                      setCourseContentData(updatedData);
                     }}
                  />

                     <BsPencil className="cursor-pointer dark:text-white text-black"/>
                  </div>
                  <br/>
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
                      className={`dark:text-white text-[20px] mr-2 text-black ${
                        index > 0 ? "cursor-pointer" : "cursor-no-drop"
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
                          onChange={(e) =>{
                            const updatedData = [ ...courseContentData];
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
                          onChange={(e) =>{
                            const updatedData = [ ...courseContentData];
                            updatedData[index].videoLength = e.target.value;
                            setCourseContentData(updatedData);
                          }}
                        />
                    </div>

                    {/* PDF Upload */}
                    <div className="mb-4">
                      <label className={styles.label}>Attach PDF Reference (Optional)</label>
                      <div className="mt-2">
                        {item.pdfUrl ? (
                          <div className="flex items-center gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-lg shadow-sm">
                            <span className="text-2xl drop-shadow-sm">📄</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-blue-700 dark:text-blue-400 font-semibold tracking-wide truncate">
                                {item.pdfName || 'PDF Document Attached'}
                              </p>
                              <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-300 hover:underline font-medium mt-0.5 inline-block">
                                Preview Document
                              </a>
                            </div>
                            <button
                              type="button"
                              className="px-4 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-md shadow-sm transition-all duration-200"
                              onClick={() => {
                                const updatedData = [...courseContentData];
                                updatedData[index].pdfUrl = '';
                                updatedData[index].pdfName = '';
                                setCourseContentData(updatedData);
                              }}
                            >
                              Remove PDF
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor={`pdf-upload-${index}`}
                            className={`flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed ${
                              uploadingPdfIndex === index
                                ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600/50 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/30'
                            } rounded-xl cursor-pointer transition-all duration-300 group`}
                          >
                            {uploadingPdfIndex === index ? (
                              <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                <span className="text-blue-500 dark:text-blue-400 font-medium tracking-wide">Uploading PDF...</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <span className="text-3xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">📄</span>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Click to attach a PDF document</span>
                                <span className="text-xs text-gray-400 dark:text-gray-500">Max size: 1GB</span>
                              </div>
                            )}
                          </label>
                        )}
                        <input
                          id={`pdf-upload-${index}`}
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => handlePdfUpload(e, index)}
                          disabled={uploadingPdfIndex === index}
                        />
                      </div>
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
                          onChange={(e) =>{
                            const updatedData = [ ...courseContentData];
                            updatedData[index].description = e.target.value;
                            setCourseContentData(updatedData);
                          }}
                        />
                        <br/>
                    </div>
                  </>
                )}
                <br/>
              
              {/* add new content */}
              {
                index === courseContentData.length-1 && (
                  <div>
                    <p 
                      className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                      onClick={(e:any) => newContentHandler(item)}
                    > 
                      <AiOutlinePlusCircle className="mr-2"/> Add New Content
                    </p>
                  </div>
                )
              }
              </div>
            </React.Fragment>
          )
        })} 
        <br/>

        <div 
          className="flex items-center text-[20px] dark:text-white text-black cursor-pointer"
          onClick={(e:any) => addNewSection()}
        > 
          <AiOutlinePlusCircle className="mr-2"/> Add new Section
        </div>
      </form>
      <br/>

      <div className="w-full flex items-center justify-between">
        <div 
            className="w-full 800px: w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
            onClick={() => prevButton()}
        >
          Prev
        </div>

        <div 
            className="w-full 800px: w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
            onClick={() => handleOptions()}
        >
          Next
        </div>
      </div>
      <br/>
      <br/>
      <br/>
    </div>
  )
}

export default CourseContent
