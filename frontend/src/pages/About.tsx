import React from 'react';
import Heading from '@/utils/Heading';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import About from '@/components/About/About';
import SmartChat from '@/components/Chat/SmartChat';

const AboutPage = () => {
    const [open, setOpen] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState(5);
    const [route, setRoute] = React.useState("Login");

    return (
        <div>
            <Heading
                title="About Us - SmartLearn"
                description="SmartLearn is a platform for students to learn and get help from teachers"
                keywords="Programming,MERN,Redux,Machine Learning"
            />
            <Header
                activeItem={5}
                open={open}
                setOpen={setOpen}
                route={route}
                setRoute={setRoute}
            />
            <About setOpen={setOpen} setRoute={setRoute} />
            <Footer setOpen={setOpen} setRoute={setRoute} />
            <SmartChat />
        </div>
    );
};

export default AboutPage;
