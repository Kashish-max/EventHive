import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Cookies from 'js-cookie'

import { makeRequest } from '@/components/helpers';
import Loading from '@/components/loading';
import useAuthentication from '@/components/hooks/useAuthentication';


export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { authState, user } = useAuthentication('/');
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        setLoading(true);
        try {
            const response = await makeRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login/`, 'POST', data);
            if (response.status === 200) {
                console.log('Logged in successfully.');
                if(response.data.access &&  response.data.refresh) {
                    Cookies.set('access_token', response.data.access, { expires: 1 });
                    Cookies.set('refresh_token', response.data.refresh, { expires: 7 });
                    setLoading(false);
                    router.push('/')
                }
            } else {
                console.log('Login failed.');
                console.log(response);
                setError(response?.response?.data?.error);
                setLoading(false);
            }
        } catch (error) {
            console.error('An error occurred while signing in:', error);
            setLoading(false);
        }
    }

    if(loading) return <Loading className="w-screen h-screen -translate-y-8" />

    if(!authState) {
        return <Loading className="w-screen h-screen -translate-y-8" />
    }

    return (
        <form className="py-12 px-4 sm:px-12 sm:py-24 lg:px-24 min-h-screen flex justify-center items-center font-[ProductSans]" onSubmit={handleSubmit}>
            <div className="bg-white w-full max-w-xl border border-gray-300 p-8 shadow-lg rounded-lg">
                <div className="pb-4">
                    <h2 className="text-3xl font-bold leading-7 text-gray-900">Login</h2>
                    <p className="text-red-600 text-sm mt-2">{error && error}</p>
                    <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-6">

                        <div className="col-span-6">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                required
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="block w-full rounded-md border-0 py-1 sm:py-2 ps-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 outline-none sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="col-span-6">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    autoComplete="password"
                                    className="block w-full rounded-md border-0 py-1 sm:py-2 ps-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 outline-none sm:text-sm sm:leading-6"
                                    required
                                />
                            </div>
                        </div>

                    </div>

                </div>
    
                <p className="text-right cursor-default">
                    forgot password?
                </p>

                <div className="mt-2 flex flex-col items-center space-y-2">
                    <button
                    type="submit"
                    className="rounded-md w-full px-3 py-3 text-sm font-semibold text-white text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                    Login
                    </button>
                    <p className="text-base text-sm text-gray-500">
                        Don&apos;t have an account? 
                        <Link href="/signup" className="ml-1 text-blue-500">Sign up</Link>
                    </p>
                </div>
            </div>
        </form>
    )
}
