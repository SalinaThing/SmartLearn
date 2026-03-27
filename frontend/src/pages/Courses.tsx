import { useGetAllCoursesByUserQuery } from '@/redux/features/courses/coursesApi'
import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi'
import { useSearchParams } from 'react-router-dom'
import React, { useState } from 'react'
import Loader from '@/components/Loader/Loader'
import Header from '@/components/Header'
import Heading from '@/utils/Heading'
import { styles } from '@/styles/style'
import CourseCard from '@/components/Course/CourseCard'

type Props = {}

const page = (props: Props) => {
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams?.get('title') || "";
    
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    
    const [search, setSearch] = useState(initialSearch);
    const [category, setCategory] = useState("All");
    const [level, setLevel] = useState("All");
    const [sort, setSort] = useState("newest");
    
    const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
    const categories = categoriesData?.layout.categories;

    const { data, isLoading } = useGetAllCoursesByUserQuery({
        search,
        category: category !== "All" ? category : "",
        level: level !== "All" ? level : "",
        sort
    });
    
    const courses = data?.courses || [];

    const handleClearFilters = () => {
        setSearch("");
        setCategory("All");
        setLevel("All");
        setSort("newest");
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Header
                        open={open}
                        setOpen={setOpen}
                        activeItem={1}
                        route={route}
                        setRoute={setRoute}
                    />

                    <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh] py-8">
                        <Heading
                            title={"All courses - SmartLearn"}
                            description="Welcome to the SmartLearn - your gateway to online education. Explore courses, manage your learning, and connect with educators and peers."
                            keywords="SmartLearn, Online Education, Courses, Students, Teachers"
                        />

                        {/* Top Bar for Filters */}
                        <div className="w-full mt-8 mb-8 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
                            
                            {/* Search Input */}
                            <div className="w-full md:flex-1">
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-Poppins text-[14px]"
                                />
                            </div>

                            {/* Dropdowns Container */}
                            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4">
                                {/* Category Dropdown */}
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full sm:w-[160px] px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-Poppins text-[14px]"
                                >
                                    <option value="All">All Categories</option>
                                    {categories && categories.map((item: any, index: number) => (
                                        <option key={index} value={item.title}>{item.title}</option>
                                    ))}
                                </select>

                                {/* Level Dropdown */}
                                <select
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="w-full sm:w-[150px] px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-Poppins text-[14px]"
                                >
                                    <option value="All">All Levels</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>

                                {/* Sort Dropdown */}
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="w-full sm:w-[160px] px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-Poppins text-[14px]"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                </select>
                                
                                <button
                                    onClick={handleClearFilters}
                                    className="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/* Courses Grid */}
                        {courses && courses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 border-dashed">
                                <h2 className="text-2xl font-bold dark:text-white text-black mb-2 font-Poppins">
                                    No courses found
                                </h2>
                                <p className="dark:text-gray-400 text-gray-500 font-Poppins">
                                    {search ? "Try adjusting your search or filters to find what you're looking for." : "No courses available matching your criteria."}
                                </p>
                                <button
                                    onClick={handleClearFilters}
                                    className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-0">
                                {courses &&
                                    courses.map((item: any, index: number) => {
                                        return <CourseCard item={item} key={index} />
                                    })
                                }
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    )
}

export default page
