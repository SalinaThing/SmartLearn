

import { styles } from '@/styles/style';
import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { FC, useEffect, useState } from 'react'

type Props = {
    courseInfo: any;
    setCourseInfo: (courseInfo: any) => void;
    active: number;
    setActive: (active: number) => void;
}

const CourseInformation: FC<Props> = ({ courseInfo, setCourseInfo, active, setActive }) => {
    const [dragging, setDragging] = useState(false);

    const { data } = useGetHeroDataQuery("Categories", {});
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (data) {
            setCategories(data.layout.categories);
        }

    }, [data])

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setActive(active + 1);
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e: any) => {
                if (reader.readyState === 2) {
                    setCourseInfo({ ...courseInfo, thumbnail: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setDragging(true);
    }

    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setDragging(false);
    }

    const handleDrop = (e: any) => {
        e.preventDefault();
        setDragging(false);

        const file = e.dataTransfer.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setCourseInfo({ ...courseInfo, thumbnail: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className="w-[90%] m-auto mt-24">
            <form onSubmit={handleSubmit} className={styles.label}>
                <div>
                    <label htmlFor=""> Course Name</label>

                    <input
                        type="name"
                        name=""
                        required
                        value={courseInfo.name}
                        onChange={(e: any) =>
                            setCourseInfo({ ...courseInfo, name: e.target.value })
                        }
                        id="name"
                        placeholder="MERN stack SmartLearn platform with next 13"
                        className={styles.input}
                    />
                </div>

                <br />

                <div className="mb-5">
                    <label className={`${styles.label}`}>Course Description</label>
                    <textarea name="" id="" cols={30} rows={8}
                        placeholder="Write stg amazing...."
                        className={`${styles.input} !h-min !py-2`}
                        value={courseInfo.description}
                        onChange={(e: any) =>
                            setCourseInfo({ ...courseInfo, description: e.target.value })
                        }
                    ></textarea>
                </div>
                <br />

                <div className="w-full flex justify-between">
                    <div className="w-[45%]">
                        <label className={`${styles.label}`}>
                            Course Price
                        </label>
                        <input
                            type="number"
                            name=""
                            required
                            value={courseInfo.price}
                            onChange={(e: any) =>
                                setCourseInfo({ ...courseInfo, price: e.target.value })
                            }
                            id="price"
                            placeholder="29"
                            className={`${styles.input}`}
                        />
                    </div>

                    <div className="w-[50%]">
                        <label className={`${styles.label} w-[50%]`}>
                            Estimated Price (Optional)
                        </label>
                        <input
                            type="number"
                            name=""
                            value={courseInfo.estimatedPrice}
                            onChange={(e: any) =>
                                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
                            }
                            id="price"
                            placeholder="79"
                            className={`${styles.input}`}
                        />
                    </div>
                </div>
                <br />

                <div className="w-full flex justify-between">
                    <div className="w-[45%]">
                        <label className={`${styles.label}`} htmlFor="email">
                            Course Tags
                        </label>
                        <input
                            type="text"
                            name=""
                            required
                            value={courseInfo.tags}
                            onChange={(e: any) =>
                                setCourseInfo({ ...courseInfo, tags: e.target.value })
                            }
                            id="tags"
                            placeholder="Mern, next 13, socket io, tailwind, css"
                            className={`${styles.input}`}
                        />
                    </div>

                    <div className="w-[50%]">
                        <label className={`${styles.label}`}>
                            Course Categories
                        </label>
                        <select
                            name=""
                            id=""
                            className={`${styles.input}`}
                            value={courseInfo.categories}
                            onChange={(e: any) =>
                                setCourseInfo({ ...courseInfo, categories: e.target.value })
                            }
                        >
                            <option value="">Select Category</option>
                            {categories.map((item: any) => (
                                <option value={item.title} key={item._id}>
                                    {item.title}
                                </option>
                            ))}

                        </select>
                    </div>
                </div>

                <br />

                <div className="w-full flex justify-between">
                    <div className="w-[45%]">
                        <label className={`${styles.label}`}>
                            Course Level
                        </label>
                        <select
                            required
                            value={courseInfo.level}
                            onChange={(e: any) =>
                                setCourseInfo({ ...courseInfo, level: e.target.value })
                            }
                            className={`${styles.input}`}
                        >
                            <option value="">Select Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="w-[50%]">
                        <label className={`${styles.label}`}>
                            Demo Url
                        </label>
                        <input
                            type="text"
                            name=""
                            required
                            value={courseInfo.demoUrl}
                            onChange={(e: any) =>
                                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
                            }
                            id="demoUrl"
                            placeholder="eer745"
                            className={`${styles.input}`}
                        />
                    </div>
                </div>
                <br />
                <div className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex-1">
                        <label className={`${styles.label} !text-lg font-bold`}>
                            Is this a Premium Course?
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                             Uncheck this to make the course <span className="font-bold text-green-600 dark:text-green-400">Free</span> for all students.
                        </p>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isPremium"
                            checked={courseInfo.isPremium}
                            onChange={(e: any) =>
                                setCourseInfo({ ...courseInfo, isPremium: e.target.checked })
                            }
                            className="w-6 h-6 cursor-pointer accent-[#39c1f3] rounded"
                        />
                        <label htmlFor="isPremium" className={`${styles.label} ml-2 cursor-pointer`}>
                            {courseInfo.isPremium ? "Premium" : "Free"}
                        </label>
                    </div>
                </div>
                <br />
                <div className="w-full">
                    <input
                        type="file"
                        accept="image/*"
                        id="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <label htmlFor="file"
                        className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${dragging ? "bg-blue-500" : "bg-transparent"
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {
                            courseInfo.thumbnail ? (
                                <img
                                    src={courseInfo.thumbnail}
                                    alt=""
                                    className="max-h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-black dark:text-white">
                                    Drag and drop your thumbnail here or click to browse
                                </span>
                            )
                        }
                    </label>
                </div>
                <br />

                <div className="w-full flex items-center justify-end">
                    <input
                        type="submit"
                        value="Next"
                        className="w-full 800px:w-[180px] h-[40px] bg-[#39c1f3] text-center text-[#fff] rounded mt-8 cursor-pointer"
                    />
                </div>
                <br />
                <br />
            </form>
        </div>
    );
}

export default CourseInformation
