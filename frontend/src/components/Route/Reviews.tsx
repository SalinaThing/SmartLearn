import React from 'react'
import Image from '@/utils/Image';
import { styles } from '@/styles/style';
import HeroImg from "../../assets/Hero.jpg";
import ReviewCard from '../Reviews/ReviewCard';

type Props = {}

export const reviews = [
  {
    name: "Gene Bates",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Student | Cambridge university",
    comment:
      "I had the pleasure of exploring SmartLearn, a website that provides an extensive range of courses on various tech-related topics. I was thoroughly impressed with my experience, as the website offers a comprehensive selection of courses that cater to different skill levels and interests. If you're looking to enhance your knowledge and skills in the tech industry, I highly recommend checking out SmartLearn!",
    ratings: 5,
  },
  {
    name: "Verna Santos",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profession: "Full stack developer | Quarter ltd.",
    comment:
      "Thanks for your amazing programming tutorial channel! Your teaching style is outstanding, and the quality of your tutorials is top-notch. Your ability to break down complex topics into manageable parts, and cover diverse programming languages and topics is truly impressive.",
    ratings: 5,
  },
  {
    name: "Jay Gibbs",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    profession: "computer systems engineering student | Zimbabwe",
    comment:
      "Thanks for your amazing programming tutorial channel! Your teaching style is outstanding, and the quality of your tutorials is top-notch. Your ability to break down complex topics into manageable parts, and cover diverse programming languages and topics is truly impressive. The practical applications and real-world examples you incorporate reinforce the theoretical knowledge and provide valuable insights.",
    ratings: 5,
  },
  {
    name: "Mina Davidson",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    profession: "Junior Web Developer | Indonesia",
    comment:
      "I had the pleasure of exploring SmartLearn, a website that provides an extensive range of courses on various tech-related topics. I was thoroughly impressed with my experience.",
    ratings: 5,
  },
  {
    name: "Rosemary Smith",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    profession: "Full stack web developer | Algeria",
    comment:
      "Your content is very special. The thing I liked the most is that the videos are so long, which means they cover everything in details. for that any person had beginner-level can complete an integrated project when he watches the videos. Thank you very much. Im very excited for the next videos Keep doing this amazing work",
    ratings: 5,
  },
  {
    name: "Laura Mckenzie",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    profession: "Full stack web developer | Canada",
    comment:
      "Join SmartLearn! SmartLearn focuses on practical applications rather than just teaching the theory behind programming languages or frameworks. I took a lesson on creating a web marketplace using React JS, and it was very helpful in teaching me the different stages involved in creating a project from start to finish. Overall, I highly recommend SmartLearn to anyone looking to improve their programming skills and build practical projects. SmartLearn is a great resource that will help you take your skills to the next level.",
    ratings: 5,
  },
]; 

const Reviews = (props: Props) => {
  return (
    <div className="w-[90%] 800px:w-[85%] m-auto py-10">
      <div className="w-full 800px:flex items-center"> 
        <div className="800px:w-[50%] w-full">
          <Image
            src={HeroImg}
            alt="business"
            width={700}
            height={700}
          />
        </div>

        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.title} 800px:!text-[40px] !text-left`}>
            Our Students Are{" "}
            <span className="text-gradient">Our Strength</span>{" "}
            <br />
              See What They Say About Us
          </h3>
          <br />

          <p className={`${styles.label} !text-left`}>
              Our students are at the heart of everything we do. Their dedication, passion, and success stories 
              are what drive us to provide the highest quality education. We take pride in seeing our learners 
              transform their careers and achieve their goals through our comprehensive courses and supportive community. 
              Join thousands of successful alumni who have already started their journey with us.
          </p>
        </div>
      </div>
      <br/>
      <br/>

      <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12">
        {reviews.map((i, index) => <ReviewCard item={i} key={index} />)}
      </div>
    </div>
  )
}

export default Reviews





