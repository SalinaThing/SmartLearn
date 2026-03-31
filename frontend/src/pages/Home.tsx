import React, { useState } from "react";
import Heading from "@/utils/Heading";
import Header from "@/components/Header";
import Hero from "@/components/Route/Hero";
import Courses from "@/components/Route/Courses";
import Reviews from "@/components/Route/Reviews";
import Faq from "@/components/FAQ/Faq";
import Footer from "@/components/Footer";
import SmartChat from "@/components/Chat/SmartChat";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="SmartLearn - Home"
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

      <Hero setOpen={setOpen} setRoute={setRoute} />
      <Courses/>
      <Reviews/>
      <Faq/>
      <Footer setOpen={setOpen} setRoute={setRoute} />
      <SmartChat />
    </div>
  );
}
