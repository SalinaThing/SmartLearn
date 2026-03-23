import { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import CourseDetailsPage from "@/components/Course/CourseDetailsPage"
import Loader from "@/components/Loader/Loader"

export default function CourseDetailPage() {
    const { id } = useParams<{ id: string }>()
    return (
        <div>
            <Suspense fallback={<Loader />}>
            {id && <CourseDetailsPage id={id}/>}
            </Suspense>
        </div>
    )
}
