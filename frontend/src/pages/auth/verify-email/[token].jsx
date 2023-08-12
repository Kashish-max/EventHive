import { useState, useEffect } from "react";
import { useRouter } from "next/router"
import {
    CheckCircleIcon,
    InformationCircleIcon
} from "@heroicons/react/24/outline"
import Cookies from 'js-cookie';

import { makeRequest } from '@/components/helpers';
import Loading from '@/components/loading';

const Verify = () => {
    const router = useRouter();
    const { token } = router.query;
  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(token) verifyEmail();
    }, [token]);

    const verifyEmail = async () => {
        try {
            const response = await makeRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-email/${token}/`, 'GET');
            if (response.status === 200) {
                console.log('User verified successfully.');
                if(response.data.access &&  response.data.refresh) {
                    Cookies.set('access_token', response.data.access, { expires: 1 });
                    Cookies.set('refresh_token', response.data.refresh, { expires: 7 });
                    setLoading(false);
                }
            } else {
                console.log(response);
                if(response?.response?.data?.message) {
                    setError(response?.response?.data?.message);
                    setLoading(false);
                } else if(response?.response?.status === 404){
                    router.push('/404');
                } else {
                    setError("An error occurred while verfying your email. please try logging in again.");
                    setLoading(false);
                }
            }
        } catch (error) {
            setError("An error occurred while verfying your email. please try logging in again.");
            setLoading(false);
        }   
    }
  
    if(loading) return <Loading className="w-screen h-screen -translate-y-8" />

    return (
        <div className="min-w-screen min-h-screen flex justify-center items-center">
            <div className="max-w-5xl flex flex-col items-center font-[ProductSans] -translate-y-8 p-8 text-center">
                {error ? 
                    <>
                        <InformationCircleIcon className="w-24 h-24 sm:w-40 sm:h-40 text-red-400" />
                        <p className="text-xl sm:text-3xl text-gray-900 font-semibold tracking-wider">Verification link expired</p>
                        <p className="leading-tight text-lg sm:text-xl text-gray-600 tracking-wider mt-3">{error}</p>
                        <button 
                            className="flex items-center rounded-md text-white text-sm focus:outline-none focus:ring-4 font-medium mt-8 bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 px-12 py-2"
                            onClick={() => router.push('/login')}
                        >
                            <span>Go to Login Page</span>
                        </button>
                    </>
                    :                
                    <>
                        <CheckCircleIcon className="w-40 h-40 text-green-400" />
                        <p className="text-xl sm:text-3xl text-gray-900 font-semibold tracking-wider">Thank you</p>
                        <p className="leading-tight text-lg sm:text-xl text-gray-600 tracking-wider mt-3">Your have verified your email.</p>
                        <button 
                            className="flex items-center rounded-md text-white text-sm focus:outline-none focus:ring-4 font-medium mt-8 bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 px-12 py-2"
                            onClick={() => router.push('/')}
                        >
                            <span>Continue</span>
                        </button>
                    </>
                }
            </div>
        </div>
    );
}
    
export default Verify;