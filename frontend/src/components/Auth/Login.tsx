
import React, { FC, useEffect, useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    AiOutlineEye,
    AiOutlineEyeInvisible,
    AiFillGithub
} from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { styles } from '@/styles/style';
import { useLoginUserMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';
import { signIn } from '@/auth/oauth';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';

type Props = {
    setRoute: (route: string) => void;
    setOpen: (open: boolean) => void;
    refetch: any;
};

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Please enter your email!!"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Please enter your password!!"),
});

const Login: FC<Props> = ({ setRoute, setOpen, refetch }) => {
    const [show, setShow] = useState(false);
    const [login, { data, isSuccess, error }] = useLoginUserMutation();
    const navigate = useNavigate();
    const { user: hookUser } = useUser();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: schema,
        onSubmit: async ({ email, password }) => {
            await login({ email, password });
        },
    });

    useEffect(() => {
        if (isSuccess) {
            (async () => {
                // Prioritize data from the login response to ensure correct redirection
                const loggedInUser = data?.user || hookUser;
                const userRole = (loggedInUser as any)?.role || "student";
                const displayRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);

                toast.success(`Login with ${displayRole} successfully`);
                setOpen(false);

                try {
                    // Wait until the authenticated user is loaded
                    await refetch();
                } catch {
                    // handled by guards
                }

                const dashboardMap: Record<string, string> = {
                    admin: "/admin",
                    teacher: "/teacher",
                    student: "/student/dashboard",
                };

                navigate(dashboardMap[userRole] || "/profile");
            })();
        }

        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data?.message || "An error occurred during login");
            } else {
                const fetchError = error as any;
                toast.error(fetchError?.error || "Failed to connect to server");
            }
        }
    }, [isSuccess, error, setOpen, refetch, navigate]);

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-md border border-gray-100 dark:border-gray-800 transition-all duration-300">
            <h1 className={`${styles.title} text-[28px] font-bold tracking-tight text-gray-900 dark:text-white mb-2`}>
                Login to SmartLearn
            </h1>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">Access your account and resume learning!</p>

            <form onSubmit={handleSubmit}>
                <label
                    className={`${styles.label} font-medium block mb-1.5`}
                    htmlFor="email"
                >
                    Enter your email
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className={`${errors.email && touched.email ? "border-red-500 ring-1 ring-red-500" : "border-gray-300 dark:border-gray-700"} 
                        ${styles.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 block shadow-sm`}
                />

                {
                    errors.email && touched.email && (
                        <span className="text-red-500 pt-2 block">
                            {errors.email}
                        </span>
                    )
                }
                <br />

                {/* Password */}
                <div className="w-full mt-5 relative mb-2">
                    <label
                        className={`${styles.label} font-medium block mb-1.5`}
                        htmlFor="password"
                    >
                        Enter your password
                    </label>

                    <div className="relative group">
                        <input
                            type={show ? "text" : "password"}
                            name="password"
                            id="password"
                            value={values.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`${errors.password && touched.password ? "border-red-500 ring-1 ring-red-500" : "border-gray-300 dark:border-gray-700"} 
                                ${styles.input} pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 block shadow-sm`}
                        />

                        {!show ? (
                            <AiOutlineEyeInvisible
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer z-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors mt-[5px]"
                                size={20}
                                onClick={() => setShow(true)}
                            />
                        ) : (
                            <AiOutlineEye
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer z-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors mt-[5px]"
                                size={20}
                                onClick={() => setShow(false)}
                            />
                        )}
                    </div>

                    {errors.password && touched.password && (
                        <span className="text-red-500 pt-2 block">
                            {errors.password}
                        </span>
                    )}
                </div>
                <br />

                {/* Submit Button */}
                <div className="w-full mt-8">
                    <button
                        type="submit"
                        className={`${styles.button} hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-200 font-bold active:scale-95 text-white`}
                    >
                        Login
                    </button>
                </div>
                <br />
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">Or join with</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 my-4">
                    <button
                        type="button"
                        onClick={() => signIn("google")}
                        className="flex items-center justify-center p-3 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
                        aria-label="Sign in with Google"
                    >
                        <FcGoogle size={24} />
                    </button>
                    <button
                        type="button"
                        onClick={() => signIn("github")}
                        className="flex items-center justify-center p-3 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-gray-800 dark:text-gray-200"
                        aria-label="Sign in with Github"
                    >
                        <AiFillGithub size={24} />
                    </button>
                </div>

                <div className="text-center pt-6 font-Poppins text-[15px] text-gray-600 dark:text-gray-300">
                    Don't have an account?{" "}
                    <span
                        className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline"
                        onClick={() => setRoute("SignUp")}
                    >
                        Sign up
                    </span>
                </div>
            </form>

        </div>
    )
}

export default Login;
