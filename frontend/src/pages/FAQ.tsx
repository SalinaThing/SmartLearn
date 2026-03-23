import React from 'react';
import Heading from '@/utils/Heading';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Faq from '@/components/FAQ/Faq';

const FaqPage = () => {
    return (
        <div>
            <Heading
                title="FAQ - SmartLearn"
                description="Frequently Asked Questions"
                keywords="Programming,MERN,Redux,Machine Learning"
            />
            <Header activeItem={4} open={false} setOpen={() => {}} route="" setRoute={() => {}} />
            <br />
            <Faq />
            <Footer />
        </div>
    );
};

export default FaqPage;
