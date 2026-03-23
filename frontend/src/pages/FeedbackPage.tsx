import React, { useState } from 'react'
import Heading from '@/utils/Heading'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FeedbackForm from '@/components/Course/FeedbackForm'

const FeedbackPage = () => {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");

    return (
        <div>
            <Heading
                title="Feedback - SmartLearn"
                description="SmartLearn is a platform for students to learn and get help from teachers"
                keywords="Programming,MERN,Redux,Machine Learning"
            />
            <Header
                open={open}
                setOpen={setOpen}
                activeItem={3}
                setRoute={setRoute}
                route={route}
            />
            <div className="min-h-screen mt-[120px]">
                <FeedbackForm />
            </div>
            <Footer />
        </div>
    )
}

export default FeedbackPage
