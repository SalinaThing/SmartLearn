import { styles } from '@/styles/style';
import CoursePlayer from '@/utils/CoursePlayer';
import React, { useState, useEffect } from 'react'
import { AiFillStar, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineStar } from 'react-icons/ai';
import Image from '@/utils/Image';
import toast from 'react-hot-toast';
import { useAddAnswerToQuestionMutation, useAddNewQuestionMutation, useAddReplyInReviewMutation, useAddReviewInCourseMutation, useGetCourseDetailsQuery } from '@/redux/features/courses/coursesApi';
import { format } from 'timeago.js';
import { BiMessage } from 'react-icons/bi';
import { VscVerifiedFilled } from 'react-icons/vsc';
import Ratings from '@/utils/Ratings';
import QuizListStudent from './QuizListStudent';
import FeedbackForm from './FeedbackForm';
import StudentAnnouncements from './StudentAnnouncements';

import { io } from "socket.io-client";

const ENDPOINT = import.meta.env.VITE_SOCKET_SERVER_URI || "";

const socketId = io(ENDPOINT, {
    transports: ["websocket"],
});

type Props = {
    data: any;
    id: string;
    activeVideo: number;
    setActiveVideo: (activeVideo: number) => void;
    user: any;
    refetch: any;
}

const CourseContentMedia = ({ data, user, id, activeVideo, setActiveVideo, refetch }: Props) => {

    const [activeBar, setActiveBar] = useState(0);
    const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(id, { refetchOnMountOrArgChange: true });
    const course = courseData?.course;

    const activeContent = data?.[activeVideo];
    const mediaUrl: string | undefined =
        activeContent?.videoUrl ||
        activeContent?.pdfUrl ||
        activeContent?.fileUrl ||
        activeContent?.resourceUrl;

    const isPdfContent =
        typeof mediaUrl === "string" && /\.pdf(\?|#|$)/i.test(mediaUrl.trim());

    useEffect(() => {
        setActiveBar(0);
    }, [activeVideo]);

    const [question, setQuestion] = useState("");
    const [addNewQuestion, { isLoading: questionCreationLoading, isSuccess, error }] = useAddNewQuestionMutation();
    const [addReplyInReview, { isSuccess: replySuccess, error: replyError, isLoading: replyCreationLoading }] = useAddReplyInReviewMutation();

    const isReviewExists = course?.reviews?.find(
        (item: any) => item.user?._id === user?._id
    );

    const [rating, setRating] = useState(1);
    const [review, setReview] = useState("");
    const [isReviewReply, setIsReviewReply] = useState(false);
    const [reply, setReply] = useState("");

    const [answer, setAnswer] = useState("");
    const [questionId, setQuestionId] = useState("");

    const [addAnswerToQuestion, { isSuccess: answerSuccess, error: answerError, isLoading: answerCreationLoading }] = useAddAnswerToQuestionMutation();

    const [addReviewInCourse, { isSuccess: reviewSuccess, error: reviewError, isLoading: reviewCreationLoading }] = useAddReviewInCourseMutation();
    const [reviewId, setReviewId] = useState("");

    const handleQuestionSubmit = () => {
        if (question.length === 0) {
            toast.error("Question can't be empty");
        } else {
            addNewQuestion({ question, courseId: id, contentId: data[activeVideo]._id })
        }
    }

    const handleAnswerSubmit = () => {
        if (answer.length === 0) {
            toast.error("Answer can't be empty");
        } else {
            addAnswerToQuestion({ answer, courseId: id, contentId: data[activeVideo]._id, questionId: questionId })
        }
    }

    const handleReviewSubmit = async () => {
        if (review.length === 0) {
            toast.error("Review can't be empty");
        }
        else {
            addReviewInCourse({ review, rating, courseId: id });
        }
    }

    const handleReviewReplySubmit = () => {
        if (!replyCreationLoading) {
            if (reply === "") {
                toast.error("Reply can't be empty");
            } else {
                addReplyInReview({ comment: reply, courseId: id, reviewId })
            }
        }
    }

    // Question success/error handling
    useEffect(() => {
        if (isSuccess) {
            setQuestion("");
            refetch();
            toast.success("Question added successfully");
            socketId.emit("notification", {
                title: "New Question Received",
                message: `You have a new question in ${data[activeVideo]?.title}`,
                userId: user?._id
            });
        }
        if (error && "data" in error) {
            const errorMessage = error as any;
            toast.error(errorMessage.data?.message || "Failed to add question");
        }
    }, [isSuccess, error]);

    // Answer success/error handling
    useEffect(() => {
        if (answerSuccess) {
            setAnswer("");
            refetch();
            toast.success("Answer added successfully");
            if (user?.role !== "teacher") {
                socketId.emit("notification", {
                    title: "New Reply Received",
                    message: `You have a new question reply in ${data[activeVideo]?.title}`,
                    userId: user?._id
                });
            }
        }
        if (answerError && "data" in answerError) {
            const errorMessage = answerError as any;
            toast.error(errorMessage.data?.message || "Failed to add answer");
        }
    }, [answerSuccess, answerError]);

    // Review success/error handling
    useEffect(() => {
        if (reviewSuccess) {
            setReview("");
            setRating(1);
            courseRefetch();
            toast.success("Review added successfully");
            socketId.emit("notification", {
                title: "New Review Received",
                message: `You have a new review on your course`,
                userId: user?._id
            });
        }
        if (reviewError && "data" in reviewError) {
            const errorMessage = reviewError as any;
            toast.error(errorMessage.data?.message || "Failed to add review");
        }
    }, [reviewSuccess, reviewError]);

    // Reply success/error handling
    useEffect(() => {
        if (replySuccess) {
            setReply("");
            setIsReviewReply(false);
            courseRefetch();
            toast.success("Reply added successfully");
        }
        if (replyError && "data" in replyError) {
            const errorMessage = replyError as any;
            toast.error(errorMessage.data?.message || "Failed to add reply");
        }
    }, [replySuccess, replyError]);

    return (
        <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
            {mediaUrl ? (
                isPdfContent ? (
                    <div className="w-full">
                        <div className="w-full rounded border border-[#ffffff1f] overflow-hidden bg-black/10">
                            <iframe
                                title={activeContent?.title || "PDF"}
                                src={mediaUrl}
                                className="w-full h-[70vh]"
                            />
                        </div>
                        <div className="mt-3 flex items-center justify-end">
                            <a
                                href={mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.button} text-white !w-[unset] !min-h-[40px] !py-[unset]`}
                            >
                                Open PDF
                            </a>
                        </div>
                    </div>
                ) : (
                    <CoursePlayer
                        title={activeContent?.title}
                        videoUrl={mediaUrl}
                    />
                )
            ) : (
                <div className="w-full rounded border border-[#ffffff1f] p-6 text-center dark:text-white text-black">
                    No media found for this lesson.
                </div>
            )}

            <div className="w-full flex items-center justify-between my-3">
                <button
                    className={`${styles.button} text-white !w-[unset] !min-h-[40px] !py-[unset] ${activeVideo === 0 && "!cursor-no-drop opacity-[.8]"
                        }`}
                    onClick={() =>
                        setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
                    }
                    disabled={activeVideo === 0}
                >
                    <AiOutlineArrowLeft className="mr-2" />
                    Prev Lesson
                </button>

                <button
                    className={`${styles.button} text-white !w-[unset] !min-h-[40px] !py-[unset] ${data.length - 1 === activeVideo && "!cursor-no-drop opacity-[.8]"
                        }`}
                    onClick={() =>
                        setActiveVideo(
                            data && data.length - 1 === activeVideo
                                ? activeVideo
                                : activeVideo + 1
                        )
                    }
                    disabled={data.length - 1 === activeVideo}
                >
                    Next Lesson
                    <AiOutlineArrowRight className="ml-2" />
                </button>
            </div>

            <h1 className="pt-2 text-[25px] font-[600] dark:text-white text-black">
                {data[activeVideo]?.title}
            </h1>
            <br />

            <div className="w-full p-4 flex items-center justify-between bg-slate-500 bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner">
                <div className="flex flex-wrap gap-4">
                    {["Overview", "Resources", "Q&A", "Reviews", "Quiz", "Feedback", "Announcements"].map((text, index) => (
                        <h5
                            key={index}
                            className={`800px:text-[20px] cursor-pointer transition-all duration-300 ${activeBar === index ? "text-red-500" : "dark:text-white text-black"
                                }`}
                            onClick={() => setActiveBar(index)}
                        >
                            {text}
                        </h5>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                {activeBar === 0 && (
                    <p className="text-[18px] whitespace-pre-line mb-3 dark:text-white text-black">
                        {activeContent?.description ||
                            activeContent?.overview ||
                            activeContent?.text ||
                            "No overview available for this lesson."}
                    </p>
                )}

                {activeBar === 1 && (
                    <div>
                        {/* PDF Resource */}
                        {data[activeVideo]?.pdfUrl && (
                            <div className="mb-5 flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <span className="text-3xl">📄</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[16px] font-semibold dark:text-white text-black truncate">
                                        {data[activeVideo]?.pdfName || 'Course PDF'}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">PDF Document</p>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={data[activeVideo].pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${styles.button} !w-[unset] !min-h-[36px] !py-[unset] px-4 text-white text-sm`}
                                    >
                                        View PDF
                                    </a>
                                    <a
                                        href={data[activeVideo].pdfUrl}
                                        download
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white rounded-lg text-sm transition-colors"
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>
                        )}


                        {!data[activeVideo]?.pdfUrl && (!data[activeVideo]?.links || data[activeVideo].links.length === 0) && (
                            <p className="text-center text-gray-500 py-8">No resources for this lesson.</p>
                        )}
                    </div>
                )}

                {activeBar === 2 && (
                    <>
                        <div className="flex w-full">
                            <Image
                                src={user?.avatar ? user.avatar.url : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
                                alt=" "
                                width={50}
                                height={50}
                                className="w-[50px] h-[50px] rounded-full object-cover"
                            />

                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                cols={40}
                                rows={5}
                                placeholder="Write your question..."
                                className="outline-none bg-transparent ml-3 border border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins dark:text-white text-black"
                            />
                        </div>

                        <div className='w-full flex justify-end'>
                            <button
                                className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-5 ${questionCreationLoading && "cursor-not-allowed opacity-50"}`}
                                onClick={questionCreationLoading ? () => { } : handleQuestionSubmit}
                                disabled={questionCreationLoading}
                            >
                                Submit
                            </button>
                        </div>
                        <br />
                        <br />

                        <div className='w-full h-[1px] bg-[#ffffff3b]'></div>

                        <div>
                            <CommentReply
                                data={data}
                                activeVideo={activeVideo}
                                answer={answer}
                                setAnswer={setAnswer}
                                handleAnswerSubmit={handleAnswerSubmit}
                                user={user}
                                setQuestionId={setQuestionId}
                                answerCreationLoading={answerCreationLoading}
                            />
                        </div>
                    </>
                )}

                {activeBar === 3 && (
                    <>
                        {!isReviewExists && (
                            <>
                                <div className="flex w-full">
                                    <Image
                                        src={user?.avatar ? user.avatar.url : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
                                        alt=" "
                                        width={50}
                                        height={50}
                                        className="w-[50px] h-[50px] rounded-full object-cover"
                                    />

                                    <div className="w-full">
                                        <h5 className="pl-3 text-[20px] font-[500] dark:text-white text-black">
                                            Give a Rating <span className="text-red-500">*</span>
                                        </h5>

                                        <div className="flex w-full ml-2 pb-3">
                                            {[1, 2, 3, 4, 5].map((i) =>
                                                rating >= i ? (
                                                    <AiFillStar
                                                        key={i}
                                                        className="mr-1 cursor-pointer"
                                                        color="rgb(246, 186, 0)"
                                                        size={25}
                                                        onClick={() => setRating(i)}
                                                    />
                                                ) : (
                                                    <AiOutlineStar
                                                        key={i}
                                                        className="mr-1 cursor-pointer"
                                                        color="rgb(246, 186, 0)"
                                                        size={25}
                                                        onClick={() => setRating(i)}
                                                    />
                                                )
                                            )}
                                        </div>

                                        <textarea
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            cols={40}
                                            rows={5}
                                            placeholder="Write your comment..."
                                            className="outline-none bg-transparent ml-3 border border-[#ffffff57] 800px:w-full p-2 rounded w-[95%] text-[18px] font-Poppins dark:text-white text-black"
                                        />
                                    </div>
                                </div>

                                <div className='w-full flex justify-end'>
                                    <button
                                        className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-5 800px:mr-0 mr-2 ${reviewCreationLoading && "cursor-not-allowed opacity-50"}`}
                                        onClick={reviewCreationLoading ? () => { } : handleReviewSubmit}
                                        disabled={reviewCreationLoading}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </>
                        )}
                        <br />

                        <div className="w-full h-[1px] bg-[#ffffff3b]" />
                        <div className="w-full">
                            {course?.reviews && course.reviews.length > 0 ? (
                                [...course.reviews].reverse().map((item: any, index: number) => (
                                    <div key={index} className="w-full my-5 dark:text-white text-black">
                                        <div className="w-full flex">
                                            <div>
                                                <Image
                                                    src={item.user?.avatar ? item.user.avatar.url : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
                                                    alt=" "
                                                    width={50}
                                                    height={50}
                                                    className="w-[50px] h-[50px] rounded-full object-cover"
                                                />
                                            </div>

                                            <div className="ml-2">
                                                <h1 className="text-[18px] font-semibold">{item?.user?.name}</h1>
                                                <Ratings rating={item.rating} />
                                                <p className="mt-1">{item.comment}</p>
                                                <small className="text-gray-500 dark:text-[#ffffff83]">
                                                    {format(item.createdAt)}
                                                </small>
                                            </div>
                                        </div>

                                        {user?.role === "teacher" && !isReviewReply && (
                                            <span
                                                className={`${styles.label} !ml-10 cursor-pointer inline-block mt-2`}
                                                onClick={() => {
                                                    setIsReviewReply(true);
                                                    setReviewId(item._id);
                                                }}
                                            >
                                                Add Reply
                                            </span>
                                        )}

                                        {isReviewReply && reviewId === item._id && (
                                            <div className="w-full relative mt-3">
                                                <input
                                                    type="text"
                                                    placeholder="Enter your reply..."
                                                    value={reply}
                                                    onChange={(e) => setReply(e.target.value)}
                                                    className="block 800px:ml-12 outline-none bg-transparent border-b border-[#000] dark:border-[#fff] p-[5px] w-[95%]"
                                                />

                                                <button
                                                    className="absolute right-0 bottom-1 text-[#2190ff]"
                                                    onClick={handleReviewReplySubmit}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        )}
                                        {item.commentReplies?.map((i: any, replyIndex: number) => (
                                            <div className="w-full flex 800px:ml-16 my-5" key={replyIndex}>
                                                <div className="w-[40px] h-[40px]">
                                                    <Image
                                                        src={
                                                            i.user?.avatar
                                                                ? i.user.avatar.url
                                                                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                                        }
                                                        width={40}
                                                        height={40}
                                                        alt=""
                                                        className="w-[40px] h-[40px] rounded-full object-cover"
                                                    />
                                                </div>

                                                <div className="pl-3">
                                                    <div className="flex items-center">
                                                        <h5 className="text-[16px] font-semibold">{i.user?.name}</h5>
                                                        {i.user?.role === "teacher" && (
                                                            <VscVerifiedFilled className="text-[#50c750] ml-2 text-[16px]" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm">{i.comment}</p>
                                                    <small className="text-gray-500 dark:text-[#ffffff83]">
                                                        {format(i.createdAt)}
                                                    </small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
                            )}
                        </div>
                    </>
                )}

                {activeBar === 4 && (
                    <QuizListStudent
                        courseId={id}
                        user={user}
                    />
                )}
                {activeBar === 5 && (
                    <FeedbackForm
                        courseId={id}
                        contentId={activeContent?._id}
                        contentTitle={activeContent?.title}
                    />
                )}

                {activeBar === 6 && (
                    <StudentAnnouncements
                        courseId={id}
                        user={user}
                    />
                )}
            </div>
        </div>
    )
}

const CommentReply = ({
    data,
    activeVideo,
    answer,
    setAnswer,
    handleAnswerSubmit,
    user,
    setQuestionId,
    answerCreationLoading,
}: any) => {
    return (
        <>
            <div className="w-full my-3">
                {data[activeVideo]?.questions && data[activeVideo].questions.length > 0 ? (
                    data[activeVideo].questions.map((item: any, index: any) => (
                        <CommentItem
                            key={index}
                            data={data}
                            activeVideo={activeVideo}
                            item={item}
                            answer={answer}
                            setAnswer={setAnswer}
                            setQuestionId={setQuestionId}
                            handleAnswerSubmit={handleAnswerSubmit}
                            answerCreationLoading={answerCreationLoading}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">No questions yet. Be the first to ask!</p>
                )}
            </div>
        </>
    )
}

const CommentItem = ({
    item,
    answer,
    setQuestionId,
    handleAnswerSubmit,
    setAnswer,
    answerCreationLoading,
}: any) => {

    const [replyActive, setReplyActive] = useState(false);

    return (
        <>
            <div className="my-4">
                <div className="flex mb-2">
                    <div>
                        <Image
                            src={item.user?.avatar ? item.user.avatar.url : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
                            alt=" "
                            width={50}
                            height={50}
                            className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                    </div>

                    <div className="pl-3 dark:text-white text-black">
                        <h1 className="text-[18px] font-semibold">{item?.user?.name}</h1>
                        <p className="mt-1">{item?.question}</p>
                        <small className="text-gray-500 dark:text-[#ffffff83]">{!item.createdAt ? "" : format(item?.createdAt)}</small>
                    </div>
                </div>

                <div className="w-full flex items-center">
                    <span
                        className="800px:pl-16 text-[#000000b8] dark:text-[#ffffff83] cursor-pointer mr-2 text-sm"
                        onClick={() => {
                            setReplyActive(!replyActive);
                            setQuestionId(item._id);
                        }}
                    >
                        {!replyActive ? (item.questionReplies?.length !== 0 ? "All Replies" : "Add Reply") : "Hide Replies"}
                    </span>

                    <BiMessage size={18} className="cursor-pointer dark:text-[#ffffff83] text-[#000000b8]" />
                    <span className="pl-1 text-sm text-[#000000b8] dark:text-[#ffffff83]">
                        {item.questionReplies?.length || 0}
                    </span>
                </div>

                {replyActive && (
                    <>
                        {item.questionReplies?.map((replyItem: any, index: number) => (
                            <div
                                key={index}
                                className="w-full flex 800px:ml-16 my-5 text-black dark:text-white"
                            >
                                <div>
                                    <Image
                                        src={
                                            replyItem.user?.avatar
                                                ? replyItem.user.avatar.url
                                                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                        }
                                        width={40}
                                        height={40}
                                        alt=""
                                        className="w-[40px] h-[40px] rounded-full object-cover"
                                    />
                                </div>

                                <div className="pl-3">
                                    <div className="flex items-center">
                                        <h5 className="text-[16px] font-semibold">{replyItem.user?.name}</h5>
                                        {replyItem.user?.role === "teacher" &&
                                            <VscVerifiedFilled className="text-[#50c750] ml-2 text-[16px]" />
                                        }
                                    </div>

                                    <p className="text-sm">{replyItem.answer}</p>

                                    <small className="text-gray-500 dark:text-[#ffffff83]">
                                        {format(replyItem.createdAt)}
                                    </small>
                                </div>
                            </div>
                        ))}

                        <div className="w-full flex relative dark:text-white text-black mt-3">
                            <input
                                type="text"
                                placeholder="Enter your answer..."
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                className={`block 800px:ml-12 outline-none bg-transparent border-b border-[#00000027] dark:border-[#fff] dark:text-white text-black p-[5px] w-[95%] ${answer === "" || answerCreationLoading ? "cursor-not-allowed opacity-50" : ""}`}
                            />

                            <button
                                type="submit"
                                className="absolute right-0 bottom-1 text-[#2190ff]"
                                onClick={handleAnswerSubmit}
                                disabled={answer === "" || answerCreationLoading}
                            >
                                Submit
                            </button>
                        </div>
                        <br />
                    </>
                )}
            </div>
        </>
    )
}

export default CourseContentMedia;