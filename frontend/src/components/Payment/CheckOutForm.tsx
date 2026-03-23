import { styles } from '@/styles/style';
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast';

type Props = {
    setOpen:any;
    data: any;
    user:any;
    stripePromise?: any;
    clientSecret?: string;
}

const CheckOutForm: FC <Props> = ({setOpen, data, user, stripePromise, clientSecret}: Props) => {
    const stripe = stripePromise;
    const elements = clientSecret;
    const [message, setMessage] = useState<any>("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        if(!stripe || !elements){
            setMessage("Payment is not ready yet. Please try again.");
            return;
        }
        setIsLoading(true);
        try {
            window.location.href = String(stripe);
        } catch {
            setIsLoading(false);
            toast.error("Could not start Khalti payment.");
        }
    };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
        <p className="text-black dark:text-white font-Poppins text-sm pb-2">
            Pay securely with Khalti (NPR). You will be redirected to complete payment.
        </p>
        <button disabled={isLoading || !stripe || !elements} id="submit" type="submit">
            <span id="button-text" className={`${styles.button} mt-2 !h-[35px]`}>
                {isLoading ? "Redirecting..." : "Pay now"}
            </span>
        </button>

        {/* Show any error or success message */}

        {message && (
            <div id="payment-message" className="text-[red] font-Poppins pt-2">
                {message}
            </div>
        )}
    </form>
  )
}

export default CheckOutForm
