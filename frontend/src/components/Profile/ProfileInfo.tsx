"use client"
import React, { FC, useEffect, useState } from 'react'
import Image from '@/utils/Image'
import { AiOutlineCamera } from 'react-icons/ai';
import { VscVerifiedFilled } from 'react-icons/vsc';
import { styles } from '@/styles/style';
import { useEditProfileMutation, useUpdateAvatarMutation } from '@/redux/features/user/userApi';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import toast from 'react-hot-toast';

const avatarIcon = "/assets/heroicon3.jpg";

type Props = {
    avatar: string | null;
    user: any;
}

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
    const [name, setName] = useState(user?.name ?? "");
    const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
    const [editProfile, { isSuccess: success, error: updateError }] = useEditProfileMutation();
    const [loadUser, setLoadUser] = useState(false);
    const { } = useLoadUserQuery(undefined, { skip: loadUser ? false : true })

    const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            if (fileReader.readyState === 2) {
                const avatarData = fileReader.result as string;
                updateAvatar(avatarData);
            }
        };
        if (e.target.files && e.target.files[0]) {
            fileReader.readAsDataURL(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (isSuccess || success) {
            setLoadUser(true);
        }
        if (error || updateError) {
            console.log(error);
        }

        if (success) {
            toast.success("Profile updated successfully!!")
        }
    }, [isSuccess, error, success, updateError]);

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (name !== "") {
            await editProfile({
                name: name,
            })
        }
    };

    return (
        <>
            <div className="w-full flex justify-center">
                <div className="relative">
                    <Image
                        src={(user?.avatar && user.avatar.url) || avatar || avatarIcon}
                        alt=""
                        width={120}
                        height={120}
                        className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#39c1f3] rounded-full"
                    />
                    {user.role === 'admin' && (
                        <div className="absolute top-2 right-2 p-[2px] bg-white dark:bg-slate-900 rounded-full shadow-md">
                            <VscVerifiedFilled className="text-red-500" size={20} title="Admin Account" />
                        </div>
                    )}
                    {user.role === 'teacher' && (
                        <div className="absolute top-2 right-2 p-[2px] bg-white dark:bg-slate-900 rounded-full shadow-md">
                            <VscVerifiedFilled className="text-green-500" size={20} title="Teacher Account" />
                        </div>
                    )}

                    <input
                        type="file"
                        name=""
                        id="avatar"
                        className="hidden"
                        onChange={imageHandler}
                        accept="image/png, image/jpg, image/jpeg, image/webp"
                    />

                    <label htmlFor="avatar">
                        <label htmlFor="avatar" className="relative cursor-pointer">
                            <div className="w-8 h-8 rounded-full 
                                bg-white dark:bg-black 
                                flex items-center justify-center 
                                absolute bottom-0 right-0 
                                shadow-md hover:scale-110 transition-transform">
                                <AiOutlineCamera size={16} className="text-black dark:text-white" />
                            </div>
                        </label>
                    </label>
                </div>
            </div>
            <br />
            <br />

            <div className="w-full pl-6 800px:pl-10">
                <form onSubmit={handleSubmit}>
                    <div className="800px:w-[50%] m-auto block pb-4">
                        <div className="w-[100%]">
                            <label className="block pb-2">Full Name</label>
                            <input
                                type="text"
                                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="w-[100%] pt-2">
                            <label className="block pb-2">Email Address</label>
                            <input
                                type="text"
                                readOnly
                                className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                                required
                                value={user?.email ?? ""}
                            />
                        </div>

                        <input
                            className={`w-full 800px:w-[50px] h-[40px] border border-[#39c1f3] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer`}
                            type="submit"
                            required
                            value="Update"
                        />
                    </div>
                </form>
            </div>
        </>
    )
}

export default ProfileInfo
