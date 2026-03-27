import { styles } from '@/styles/style';
import { useActivationMutation } from '@/redux/features/auth/authApi';
import React, { FC, useEffect, useRef, useState } from 'react'
import {toast} from 'react-hot-toast';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { useSelector } from 'react-redux';

type Props = {
    setRoute: (route: string) => void;
}

// Otp Verification digit type
type VerifyNumber ={
    "0": string;
    "1": string;
    "2": string;
    "3": string;
};

const Verification: FC<Props> = ({setRoute}) => {
    const {token} = useSelector((state: {auth: {token: string}}) => state.auth);
    const [activation, {isSuccess, error}] = useActivationMutation();
    const [invalidError, setInvalidError] = useState<boolean>(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if(isSuccess){
            console.log('Activation successful');
            toast.success("Account activated successfully");
            setRoute("Login");
        }
        if(error){
            console.log('Activation error:', error);
            if("data" in error){
                const errorData = error.data as {message: string};
                toast.error(errorData.message);
                setInvalidError(true);
            } else {
                console.log('Unexpected error:', error);
            }
        }
    }, [isSuccess, error]);

    const inputRefs =[
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
        "0": "",
        "1": "",
        "2": "",
        "3": "",
    });

    const verificationHandler = async () => {
        const verificationNumber = Object.values(verifyNumber).join("");

        if(verificationNumber.length !==4){
            setInvalidError(true);
            return;
        }
        setInvalidError(false);
        console.log('Sending activation:', { activation_token: token, activation_code: verificationNumber });
        await activation ({
            activation_token: token,
            activation_code: verificationNumber,
        })
    }

    const handleInputChange= (index:number, value:string) => {
        setInvalidError(false);
        const newVerifyNumber= { ...verifyNumber, [index.toString()]: value };
        setVerifyNumber(newVerifyNumber);

        if(value === "" && index > 0){
            inputRefs[index - 1].current?.focus();
        } else if(value.length === 1 && index<3){
            inputRefs[index + 1].current?.focus();
        }
    };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-md border border-gray-100 dark:border-gray-800 transition-all duration-300">
        <h1 className={`${styles.title} text-[28px] font-bold tracking-tight text-gray-900 dark:text-white mb-2`}>Verify Your Account</h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6 font-Poppins">Enter the 4-digit code sent to your email.</p>

        <div className="w-full flex items-center justify-center mt-2">
            <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
                <VscWorkspaceTrusted size={40} />
            </div>
        </div>
        <br/>
        <br/>

        <div className="m-auto flex items-center justify-around">
            {
                Object.keys(verifyNumber).map((key, index) => (
                    <input
                        key={index}
                        type="text"
                        ref={inputRefs[index]}
                        className={`w-[60px] h-[60px] bg-transparent border-[2.5px] rounded-xl flex items-center text-black dark:text-white justify-center text-[22px] font-Poppins outline-none text-center transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-sm ${
                             invalidError
                              ? "shake border-red-500 ring-2 ring-red-500 font-bold"
                              : "dark:border-gray-600 border-gray-300"
                        }`}
                        maxLength={1}
                        placeholder=''
                        value={verifyNumber[key as keyof VerifyNumber]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                ))
            }
        </div>
        <br/>
        <br/>

        <div className="w-full flex justify-center mt-8">
            <button
                className={`${styles.button} hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-200 font-bold active:scale-95 text-white`}
                onClick={verificationHandler}
            >
                Verify Account
            </button>
        </div>
        <br/>

        <div className="text-center pt-6 font-Poppins text-[15px] text-gray-600 dark:text-gray-300">
            Go back to sign in?{" "}
            <span
                className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline"
                onClick={() => setRoute("Login")}
            >
                Login
            </span>
        </div>
       
    </div>
  )
}

export default Verification;
