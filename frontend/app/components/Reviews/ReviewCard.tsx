import React from 'react'
import Image from 'next/image'
import Ratings from '../../../app/utils/Ratings'

type Props = {
  item:any,
}

const ReviewCard = (props: Props) => {
  return (
    <div className="w-full h-max pb-4 bg-[#111c43] dark:bg-slate-500 dark:bg-opacity-[0.20] border border-[#ffffff1d] backdrop-blur rounded-lg p-5 shadow-inner">
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center">
            <Image 
                src={props.item.avatar}
                alt=''
                width={50}
                height={50}
                className="w-[50px] h-[50px] rounded-full object-cover"
            />
            <div className="pl-4">
                <h5 className="text-[20px] text-white">
                    {props.item.name}
                </h5>
                <h6 className="text-[16px] text-[#ffffffab]">
                    {props.item.profession}
                </h6>
            </div>
        </div>
        <Ratings rating={props.item.ratings}/>  
      </div>

      <p className="pt-4 font-Poppins text-white">
        {props.item.comment}
      </p>
    </div>
  )
}

export default ReviewCard