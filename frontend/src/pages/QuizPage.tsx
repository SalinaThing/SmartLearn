import React, { useState } from 'react'
import Heading from '@/utils/Heading'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AllQuizzesStudent from '@/components/Quiz/AllQuizzesStudent'
import SmartChat from '@/components/Chat/SmartChat'

const QuizPage = () => {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");

    return (
        <div>
            <Heading
                title="Quizzes - SmartLearn"
                description="SmartLearn is a platform for students to learn and get help from teachers"
                keywords="Programming,MERN,Redux,Machine Learning"
            />
            <Header
                open={open}
                setOpen={setOpen}
                activeItem={2}
                setRoute={setRoute}
                route={route}
            />
            <div className="min-h-screen">
                <AllQuizzesStudent />
            </div>
            <Footer />
            <SmartChat />
        </div>
    )
}

export default QuizPage
