import React, { FC, useState } from 'react'
import Protected from '@/hooks/useProtected';
import Header from '@/components/Header';
import Heading from '@/utils/Heading';
import Profile from '@/components/Profile/Profile';
import { useUser } from '@/hooks/useUser';
import Footer from '@/components/Footer';

const Page: FC = () => {

  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const { user } = useUser();
  const isStudent = user?.role === "student" || user?.role === "teacher" || user?.role === "admin";

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
