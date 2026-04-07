import CourseContent from '@/components/Course/CourseContent';
import Loader from '@/components/Loader/Loader';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect } from 'react'

export default function CourseAccessPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {isLoading, error, data}= useLoadUserQuery(undefined, {});

    useEffect(() => {
      if(error){
        navigate("/", { replace: true });
      }
    }, [data, error, id, navigate]);


  return (
    <>
      {isLoading ? (
        <Loader/>
      ):(
        <div>
          {data?.user && id && (
          <CourseContent  
            id={id}
          />
          )}
        </div>

      )}
    </>
  )
}
