import React from 'react';
import Heading from '@/utils/Heading';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ContactPage = () => {
    return (
        <div>
            <Heading
                title="Contact Us - SmartLearn"
                description="Get in touch with us"
                keywords="Programming,MERN,Redux,Machine Learning"
            />
            <Header activeItem={6} open={false} setOpen={() => {}} route="" setRoute={() => {}} />
            <div className="w-[90%] 800px:w-[80%] m-auto mt-20 mb-20">
                <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white text-center">
                    Contact Us
                </h1>
                <p className="text-[18px] text-black dark:text-white mt-4 text-center">
                    Email: support@smartlearn.com <br />
                    Phone: +1 234 567 890
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default ContactPage;
