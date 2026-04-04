import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { useEffect, useState } from 'react'
import Loader from '../../Loader/Loader';
import { styles } from '@/styles/style';
import { AiOutlineDelete } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { IoMdAddCircleOutline } from 'react-icons/io';

type Props = {}

const EditCategory = (props: Props) => {
    const { data, isLoading, refetch } = useGetHeroDataQuery(
        "Categories",
        { refetchOnMountOrArgChange: true }
    );
    const [editLayout, { isSuccess, error }] = useEditLayoutMutation();
    const [categories, setCategories] = useState<any>([]);

    useEffect(() => {
        if (data) {
            setCategories(data.layout.categories);
        }
        if (isSuccess) {
            refetch();
            toast.success("Categories updated successfully!!")
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData?.data?.message);
            }
        }
    }, [data, isSuccess, error])

    const handleCategoriesAdd = (id: string, value: string) => {
        setCategories((prevCategory: any) =>
            prevCategory.map((i: any) =>
            (i._id === id
                ? { ...i, title: value }
                : i
            )
            )
        );

    }

    const newCategoriesHandler = () => {
        if (categories[categories.length - 1].title === "") {
            toast.error("Category title cannot be empty");
        } else {
            setCategories((prevCategory: any) => [...prevCategory, { title: "" }]);
        }
    }

    //Function to check if the Categories arrays are unchanged
    const areCategoriesUnchanged = (
        originalCategories: any[],
        newCategories: any[]
    ) => {
        return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
    };

    const isAnyCategoryTitleEmpty = (categories: any[]) => {
        return categories.some((q) => q.title === "");
    };
    const editCategoriesHandler = async () => {
        if (!areCategoriesUnchanged(data.layout.categories, categories) &&
            !isAnyCategoryTitleEmpty(categories)
        ) {
            await editLayout({
                type: "Categories",
                categories,
            })
        }
    }
    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <div className="w-full">
                        <h1 className="text-2xl font-bold font-Poppins mb-8 text-black dark:text-white">
                            Manage <span className="text-[#3ccbae]">Categories</span>
                        </h1>

                        {/* 2-column responsive grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {categories &&
                                categories.map((item: any, index: number) => {
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 bg-white dark:bg-[#1F2A40] border border-gray-200 dark:border-[#ffffff20] rounded-xl px-4 py-3 shadow-sm"
                                        >
                                            <input
                                                className="flex-1 bg-transparent outline-none text-[16px] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                                value={item.title}
                                                onChange={(e) =>
                                                    handleCategoriesAdd(item._id, e.target.value)
                                                }
                                                placeholder="Enter category title..."
                                            />
                                            <AiOutlineDelete
                                                className="dark:text-white text-black text-[18px] cursor-pointer flex-shrink-0 hover:text-red-500 transition-colors"
                                                onClick={() =>
                                                    setCategories((prevCategory: any) =>
                                                        prevCategory.filter((i: any) => i._id !== item._id)
                                                    )
                                                }
                                            />
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Add new category */}
                        <div className="w-full flex justify-center mt-6">
                            <IoMdAddCircleOutline
                                className="dark:text-white text-black text-[28px] cursor-pointer hover:text-[#3ccbae] transition-colors"
                                onClick={newCategoriesHandler}
                            />
                        </div>

                        {/* Save button */}
                        <div className="flex justify-end mt-6">
                            <div
                                className={`${styles.button} !w-[120px] !min-h-[40px] !h-[40px] dark:text-white text-black !rounded transition-all duration-200
                                    ${areCategoriesUnchanged(data.layout.categories, categories) ||
                                    isAnyCategoryTitleEmpty(categories)
                                        ? "!cursor-not-allowed opacity-50 bg-gray-400"
                                        : "!cursor-pointer !bg-[#42d383] hover:!bg-[#34b768]"
                                    }`}
                                onClick={
                                    areCategoriesUnchanged(data.layout.categories, categories) ||
                                        isAnyCategoryTitleEmpty(categories)
                                        ? () => null
                                        : editCategoriesHandler
                                }
                            >
                                Save
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default EditCategory
