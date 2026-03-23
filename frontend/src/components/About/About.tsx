import React from "react";
import { styles } from "@/styles/style";

const About = () => {
    return (
        <div className="text-black dark:text-white">
            <br />
            <br />
            <div className="w-[95%] 800px:w-[85%] m-auto">
                <h1 className={`${styles.title} 800px:!text-[45px]`}>
                    What is <span className="text-gradient">SmartLearn?</span>
                </h1>
                <br />
                <div className="1000px:flex items-center">
                    <div className="1000px:w-[50%] w-full">
                        <p className="text-[18px] font-Poppins">
                            SmartLearn is a cutting-edge learning management system designed to empower both students and teachers. 
                            Our platform provides a seamless experience for course management, interactive quizzes, and real-time feedback.
                            <br />
                            <br />
                            Whether you are a student looking to enhance your skills with premium courses and assessments, or a teacher 
                            aiming to provide world-class education with automated grading and detailed analytics, SmartLearn is for you.
                            <br />
                            <br />
                            Join our community today and start your journey towards excellence!
                        </p>
                    </div>
                    <div className="1000px:w-[50%] w-full flex justify-center mt-10 1000px:mt-0">
                        <img 
                            src="/assets/about.png" 
                            alt="About SmartLearn" 
                            className="w-[80%] rounded-lg shadow-xl"
                            onError={(e:any) => e.target.src = "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
                        />
                    </div>
                </div>
                <br />
                <br />
            </div>
        </div>
    );
};

export default About;
