
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
import { useRegisterUserMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';
import { signIn } from '@/auth/oauth';

type Props = {
    setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Please enter your name!!"),
    email: Yup.string()
        .email("Invalid email")
        .required("Please enter your email!!"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Please enter your password!!"),
});

const SignUp: FC<Props> = ({ setRoute }) => {
    const [show, setShow] = useState(false);
    const [registerUser, { data, error, isSuccess }] = useRegisterUserMutation();

    useEffect(() => {
        if (isSuccess) {
            const message = data?.message || "Registration successful!";
            toast.success(message);
            setRoute("Verification");
        }

        if (error) {
            if ('data' in error) {
                const errorData = error as any;
                toast.error(errorData.data?.message || "An error occurred during registration");
            } else {
                const fetchError = error as any;
                toast.error(fetchError?.error || "Failed to connect to server");
            }
        }

    }, [isSuccess, error, data, setRoute]);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            role: "student",
        },
        validationSchema: schema,
        onSubmit: async ({ name, email, password, role }) => {
            const data = {
                name, email, password, role
            }
            await registerUser(data);
        },
    });

    const {
        errors,
        touched,
        values,
        handleChange,
        handleSubmit
    } = formik;

    return (
        <div className="w-full">
            <h1 className={`${styles.title}`}>
                Join to SmartLearn
            </h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label
                        className={`${styles.label}`}
                        htmlFor="name"
                    >
                        Enter your name
                    </label>

                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`${errors.name && touched.name && "border-red-500"
                            } ${styles.input}`}
                    />

                    {
                        errors.name && touched.name && (
                            <span className="text-red-500 pt-2 block">
                                {errors.name}
                            </span>
                        )
                    }
                </div>
                <br />

                {/* Email */}
                <div className="mb-3">
                    <label
                        className={`${styles.label}`}
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
                        placeholder="login12@gmail.com"
                        className={`${errors.email && touched.email && "border-red-500"
                            } ${styles.input}`}
                    />

                    {
                        errors.email && touched.email && (
                            <span className="text-red-500 pt-2 block">
                                {errors.email}
                            </span>
                        )
                    }
                </div>
                <br />

                {/* Password */}
                <div className="w-full mt-5 relative mb-1">
                    <label
                        className={`${styles.label}`}
                        htmlFor="password"
                    >
                        Enter your password
                    </label>

                    <div className="relative">
                        <input
                            type={show ? "text" : "password"}
                            name="password"
                            id="password"
                            value={values.password}
                            onChange={handleChange}
                            placeholder="********"
                            className={`${errors.password && touched.password && "border-red-500"
                                } ${styles.input} pr-10`}
                        />

                        {!show ? (
                            <AiOutlineEyeInvisible
                                className="absolute right\-3 top-1/2 -translate-y-1/2 cursor-pointer z-10"
                                size={20}
                                onClick={() => setShow(true)}
                            />
                        ) : (
                            <AiOutlineEye
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer z-10"
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

                {/* Role */}
                <div className="mb-3">
                    <label
                        className={`${styles.label}`}
                        htmlFor="role"
                    >
                        Select your role
                    </label>
                    <select
                        name="role"
                        id="role"
                        value={values.role}
                        onChange={handleChange}
                        className={`${styles.input}`}
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <br />

                {/* Submit Button */}
                <div className="w-full mt-5">
                    <input
                        type="submit"
                        value="Sign Up"
                        className={`${styles.button}`}
                    />
                </div>
                <br />
                <h5 className="text-center pt-4 font-Poppins text-[16px] text-black dark:text-white">
                    Or join with
                </h5>

                <div className="flex items-center justify-center my-3">
                    <FcGoogle
                        size={30}
                        className="cursor-pointer mr-2"
                        onClick={() => signIn("google")}
                    />
                    <AiFillGithub
                        size={30}
                        className="cursor-pointer ml-2"
                        onClick={() => signIn("github")}
                    />
                </div>

                <h5 className="text-center pt-4 font-Poppins text-[16px]">
                    Already have an account?{" "}
                    <span
                        className="text-[#2190ff] cursor-pointer"
                        onClick={() => setRoute("Login")}
                    >
                        Login
                    </span>
                </h5>
                <br />
            </form>

        </div>
    )
}

export default SignUp;
