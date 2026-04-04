import { styles } from '@/styles/style';
import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { use, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineDelete } from 'react-icons/ai';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { IoMdAddCircleOutline } from 'react-icons/io';
import Loader from '../../Loader/Loader';

type Props = {}

type FAQItem = {
    _id?: string;
    id?: string;
    question: string;
    answer: string;
    active?: boolean;
};

const getItemId = (item: FAQItem) => item._id || item.id || "";

const normalizeFaqs = (faqs: FAQItem[]) =>
    faqs.map((item) => ({
        question: item.question?.trim() ?? "",
        answer: item.answer?.trim() ?? "",
    }));

const EditFAQ = (props: Props) => {
    const { data, isLoading } = useGetHeroDataQuery(
        "FAQ",
        { refetchOnMountOrArgChange: true }
    );

    const [questions, setQuestions] = useState<FAQItem[]>([]);
    const [editLayout, { isSuccess, error }] = useEditLayoutMutation();

    useEffect(() => {
        if (data?.layout?.faqs) {
            setQuestions(
                data.layout.faqs.map((item: FAQItem) => ({
                    ...item,
                    active: false,
                }))
            );
        }
        if (isSuccess) {
            toast.success("FAQ updated successfully!!")
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData?.data?.message);
            } else {
                toast.error("Unable to update FAQ");
            }
        }
    }, [data, error, isSuccess]);

    const toggleQuestion = (id: string) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) =>
            (getItemId(q) === id
                ? { ...q, active: !q.active }
                : q
            )
            )
        );
    };

    const handleQuestionChange = (id: string, value: string) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) =>
            (getItemId(q) === id
                ? { ...q, question: value }
                : q
            )
            )
        );
    };

    const handleAnswerChange = (id: string, value: string) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) =>
            (getItemId(q) === id
                ? { ...q, answer: value }
                : q
            )
            )
        );
    };

    const newFaqHandler = () => {
        setQuestions([
            ...questions,
            {
                id: `new-${Date.now()}-${Math.random()}`,
                question: "",
                answer: "",
                active: true,
            }
        ]);
    };

    const areQuestionsUnchanged = (
        originalQuestions: FAQItem[],
        newQuestions: FAQItem[]
    ) => {
        const origNormalized = normalizeFaqs(originalQuestions);
        const newNormalized = normalizeFaqs(newQuestions);

        if (origNormalized.length !== newNormalized.length) return false;

        return JSON.stringify(origNormalized) === JSON.stringify(newNormalized);
    };

    const isAnyQuestionEmpty = (questions: FAQItem[]) => {
        return questions.some((q) =>
            !q.question?.trim() || !q.answer?.trim()
        );
    };

    const handleEdit = async () => {
        if (!data?.layout?.faqs) {
            toast.error("Unable to load existing FAQ data.");
            return;
        }

        if (areQuestionsUnchanged(data.layout.faqs, questions)) {
            toast.error("No changes detected.");
            return;
        }

        if (isAnyQuestionEmpty(questions)) {
            toast.error("Please fill out all FAQ question and answer fields.");
            return;
        }

        try {
            await editLayout({
                type: "FAQ",
                faqs: normalizeFaqs(questions),
            }).unwrap();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to save FAQ updates.");
        }
    }

    const hasChanges = Boolean(
        data?.layout?.faqs && !areQuestionsUnchanged(data.layout.faqs, questions)
    );

    const isSaveDisabled = !hasChanges || isAnyQuestionEmpty(questions);


    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <div className="w-full max-w-4xl mx-auto">
                        <h1 className="text-2xl font-bold font-Poppins mb-8 text-black dark:text-white">
                            Manage <span className="text-[#3ccbae]">FAQ</span>
                        </h1>
                        <div className="mt-4">
                            <dl className="space-y-8">
                                {questions.map((q: FAQItem) => {
                                    const itemId = getItemId(q);
                                    return (
                                        <div
                                            key={itemId}
                                            className={`${itemId !== getItemId(questions[0]) && "border-t"
                                                } border-gray-200 pt-6`}
                                        >
                                            <dt className="text-lg">
                                                <button
                                                    className="flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none"
                                                    onClick={() => toggleQuestion(itemId)}
                                                >
                                                    <input
                                                        className={`${styles.input} border-none`}
                                                        value={q.question}
                                                        onChange={(e: any) =>
                                                            handleQuestionChange(itemId, e.target.value)
                                                        }
                                                        placeholder="Add your question..."
                                                    />

                                                    <span className="ml-6 flex-shrink-0">
                                                        {q.active ? (
                                                            <HiMinus className="h-6 w-6" />
                                                        ) : (
                                                            <HiPlus className="h-6 w-6" />
                                                        )}
                                                    </span>
                                                </button>
                                            </dt>
                                            {q.active && (
                                                <dd className="mt-2 pr-12">
                                                    <input
                                                        className={`${styles.input} border-none`}
                                                        value={q.answer}
                                                        onChange={(e: any) =>
                                                            handleAnswerChange(itemId, e.target.value)
                                                        }
                                                        placeholder="Add your answer..."
                                                    />

                                                    <span className="ml-6 flex-shrink-0">
                                                        <AiOutlineDelete
                                                            className="dark:text-white text-black text-[18px] cursor-pointer"
                                                            onClick={() => {
                                                                setQuestions((prevQuestions) =>
                                                                    prevQuestions.filter((item) => getItemId(item) !== itemId)
                                                                );
                                                            }}
                                                        />
                                                    </span>
                                                </dd>
                                            )}
                                        </div>
                                    )
                                })}
                            </dl>

                            <br />
                            <br />

                            <IoMdAddCircleOutline
                                className="dark:text-white text-black text-[25px] cursor-pointer"
                                onClick={newFaqHandler}
                            />
                        </div>

                        <div className="flex justify-end mt-8">
                            <button
                                type="button"
                                disabled={isSaveDisabled}
                                onClick={handleEdit}
                                className={`${styles.button} !w-[120px] !min-h-[40px] !h-[40px] rounded transition-all duration-200 ${isSaveDisabled
                                        ? "opacity-50 cursor-not-allowed bg-gray-400"
                                        : "cursor-pointer bg-[#42d383] hover:bg-[#34b768]"
                                    }`}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )
            }

        </>
    );
}

export default EditFAQ
