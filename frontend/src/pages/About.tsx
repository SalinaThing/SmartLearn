import React from 'react';
import Heading from '@/utils/Heading';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import About from '@/components/About/About';

const AboutPage = () => {
    return (
        <div>
            <Heading
                title="About Us - SmartLearn"
                description="SmartLearn is a platform for students to learn and get help from teachers"
                keywords="Programming,MERN,Redux,Machine Learning"
            />
            <Header activeItem={5} open={false} setOpen={() => {}} route="" setRoute={() => {}} />
            <About />
            <Footer />
        </div>
    );
};

export default AboutPage;
