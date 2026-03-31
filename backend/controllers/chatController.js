import CourseModel from "../models/courseModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

export const courseAssistantChat = catchAsyncErrors(async (req, res, next) => {
  const { message } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return next(new ErrorHandler(400, "Message is required"));
  }

  const enrolledCourseIds = (req.user?.courses || [])
    .map((course) => course?.courseId)
    .filter(Boolean);

  const enrolledCourses = enrolledCourseIds.length
    ? await CourseModel.find({ _id: { $in: enrolledCourseIds } }).select(
      "name categories level tags description"
    )
    : [];

  const courseNames = enrolledCourses.map(c => c.name).join(", ");
  const lastUserPrompt = String(message).trim().toLowerCase();
  const userName = req.user?.name ? req.user.name.split(" ")[0] : "there";

  let answer = "";
  const getResponse = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // ==========================================
  // SMART DUMMY LOGIC
  // ==========================================
  if (lastUserPrompt.includes("course") || lastUserPrompt.includes("enrolled")) {
    if (enrolledCourses.length > 0) {
      answer = `You are currently enrolled in **${enrolledCourses.length} courses**: ${courseNames}. Which one would you like to focus on?`;
    } else {
      answer = "It looks like you haven't enrolled in any courses yet! 📚 Why not browse our catalog?";
    }
  } else if (lastUserPrompt.includes("plan") || lastUserPrompt.includes("schedule")) {
    answer = `Here is a custom **SmartLearn Study Plan** for you:\n1. **Focus Session (45 min)**\n2. **Active Recall (15 min)**\n3. **Practice (30 min)**\n4. **Review (10 min)**`;
  } else if (lastUserPrompt.includes("quiz") || lastUserPrompt.includes("test")) {
    answer = "To test your knowledge, check out the **Quizzes** section in your Student Dashboard. Need help revising before you start?";
  } else if (lastUserPrompt.includes("pdf") || lastUserPrompt.includes("video")) {
    answer = "Course materials like Video Lessons and PDFs are available directly in your Course Player. 📄🎥";
  } else if (lastUserPrompt.includes("progress") || lastUserPrompt.includes("history")) {
    answer = "You can track your learning journey directly in your Dashboard Analytics! 📈";
  } else if (lastUserPrompt.includes("tip")) {
    answer = `Here's a Pro Tip, ${userName}: Try 'The Pomodoro Technique' — study for 25 mins, break for 5.`;
  } else if (lastUserPrompt.includes("database") || lastUserPrompt.includes("db")) {
    answer = "A **Database (DB)** is an organized collection of structured information, typically stored electronically. Examples include MongoDB, MySQL, and PostgreSQL! 🗄️";
  } else if (lastUserPrompt.includes("python")) {
    answer = "**Python** is a high-level, interpreted programming language known for its amazing readability. It is widely used in AI, Data Science, Web Development, and Scripting. 🐍";
  } else if (lastUserPrompt.includes("ai ") || lastUserPrompt === "ai" || lastUserPrompt.includes("artificial intelligence")) {
    answer = "**AI (Artificial Intelligence)** is the simulation of human-like intelligence processes by machines or computer systems. It powers things like SmartLearn's Assistant! 🤖";
  } else if (lastUserPrompt.includes("software engineer") || lastUserPrompt.includes("software engineering")) {
    answer = "A **Software Engineer** applies engineering principles to design, develop, test, and evaluate software. It requires logical thinking, problem-solving, and a passion for building! 💻🚀";
  } else if (lastUserPrompt.includes("cyber security") || lastUserPrompt.includes("cybersecurity")) {
    answer = "**Cyber Security** is the practice of protecting computers, networks, and data from attacks, theft, or unauthorized access. It is essential for safe online systems and personal privacy. 🛡️";
  } else if (lastUserPrompt.includes("javascript")) {
    answer = "**JavaScript** is a versatile, high-level programming language mainly used to make websites interactive, build web apps, and run server-side applications with Node.js. 🌐";
  } else if (lastUserPrompt.includes("html")) {
    answer = "**HTML (HyperText Markup Language)** is the standard language for creating and structuring content on the web. It defines headings, paragraphs, links, images, and more. 📝";
  } else if (lastUserPrompt.includes("css")) {
    answer = "**CSS (Cascading Style Sheets)** is used to style and layout web pages — controlling colors, fonts, spacing, and responsive designs. 🎨";
  } else if (lastUserPrompt.includes("mern stack")) {
    answer = "**MERN Stack** is a full-stack web development framework using **MongoDB, Express.js, React, and Node.js**. It allows building dynamic, scalable web applications entirely in JavaScript. 🚀";
  } else if (lastUserPrompt.includes("mongodb")) {
    answer = "**MongoDB** is a NoSQL database that stores data in JSON-like documents. It is scalable, flexible, and widely used in modern web applications. 🗄️";
  } else if (lastUserPrompt.includes("react")) {
    answer = "**React** is a popular JavaScript library for building interactive user interfaces. It uses components and virtual DOM to make UI fast and dynamic. ⚛️";
  } else if (lastUserPrompt.includes("node js") || lastUserPrompt.includes("nodejs")) {
    answer = "**Node.js** is a JavaScript runtime that allows running JavaScript on the server. It's used for building scalable backend services and APIs. 🚀";
  } else if (["hi", "hello", "hey", "greetings"].some(g => lastUserPrompt.includes(g) && lastUserPrompt.split(" ").length < 4)) {
    answer = getResponse([
      `Hello ${userName}! 👋 I am your SmartLearn AI Assistant. How can I help you with your studies today?`,
      `Hi ${userName}! Ready to learn something new today?`
    ]);
  } else if (lastUserPrompt.includes("how are you") || lastUserPrompt.includes("whats up")) {
    answer = "I'm doing excellent! Just organizing some study materials. 📚 How are your courses coming along?";
  } else if (lastUserPrompt.includes("thank")) {
    answer = "You're very welcome! Let me know if you need anything else. 😊";
  } else if (lastUserPrompt.includes("joke") || lastUserPrompt.includes("funny")) {
    answer = "Why do programmers prefer dark mode? Because light attracts bugs! 🐛";
  } else if (lastUserPrompt.toLowerCase().includes("give a study plan") || lastUserPrompt.toLowerCase().includes("study plan")) {
    answer = "**Study Plan**: Start by setting clear daily goals, divide your subjects into manageable sections, allocate time for practice and revision, and track your progress weekly. Consistency is key! 📚✏️";
    isDummyIntercept = true;
  } else if (lastUserPrompt.toLowerCase().includes("show my enrolled courses") || lastUserPrompt.toLowerCase().includes("my courses")) {
    answer = "**Your Enrolled Courses**: You are currently enrolled in: 1) Web Development Basics, 2) Introduction to Python, 3) AI & Machine Learning Fundamentals, 4) React & Node.js Fullstack. 🎓";
    isDummyIntercept = true;
  } else if (lastUserPrompt.toLowerCase().includes("learning tips") || lastUserPrompt.toLowerCase().includes("tips for learning")) {
    answer = "**Learning Tips**: 1) Focus on one topic at a time. 2) Practice coding or exercises daily. 3) Take short breaks to avoid burnout. 4) Review past lessons weekly. 5) Use online resources & forums for extra help. 💡";
    isDummyIntercept = true;
  } else {
    answer = `Hmm, I'm currently specialized in SmartLearn's courses and platform features. Could you rephrase your question about "${message}"? 🎓`;
  }

  return res.status(200).json({
    success: true,
    answer,
    mode: "smart-dummy",
    context: {
      enrolledCount: enrolledCourses.length,
      userName
    }
  });
});


