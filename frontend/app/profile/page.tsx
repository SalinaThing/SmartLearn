"use client";
import React, { FC, useState } from 'react'
import Protected from '../hooks/useProtected';
import Header from '../components/Header';
import Heading from '../utils/Heading';
import Profile from '../components/Profile/Profile';
import { useSelector } from 'react-redux';
import Footer from '../components/Footer';

type Props = {
  user:any;
}

const Page: FC <Props> = () => {

  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const {user} = useSelector ((state: any) => state.auth);

  return (
    <div>
      <Protected>
        <Heading
          title={`${user?.name} profile - SmartLearn`}
          description="Welcome to the SmartLearn - your gateway to online education. Explore courses, manage your learning, and connect with educators and peers."
          keywords="SmartLearn, Online Education, Courses, Students, Teachers"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          route={route}
          setRoute={setRoute}
        />

        <Profile
         user={user}
        />
        <Footer />
      </Protected>

    </div>
  )
}
export default Page;