import Link from 'next/link'
import { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

import { makeRequest } from '@/components/helpers';
import Loading from '@/components/loading';
import useAuthentication from '@/components/hooks/useAuthentication';

export default function Signup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { authState, user } = useAuthentication('/');

    const handleSubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.phone = "+91" + data.phone;
        data.gender = [data.gender]

        if (data.agreement == "on") {
            delete data.agreement;
            setLoading(true);
            try {
                const response = await makeRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup/`, 'POST', data);
              if (response.status === 200) {
                console.log('User registered successfully.');
                if(response.data.access &&  response.data.refresh) {
                    Cookies.set('access_token', response.data.access, { expires: 1 });
                    Cookies.set('refresh_token', response.data.refresh, { expires: 7, httpOnly: true });
                    setLoading(false);
                    router.push('/')
                }
              } else {
                console.log('User registeration failed.');
                console.log(response);
                setLoading(false);
                setError(response?.response?.data?.error);
              }
            } catch (error) {
              console.error('An error occurred while signing up:', error);
              setLoading(false);
            }
        }
    }

    if(loading) return <Loading className="w-screen h-screen -translate-y-8" />

    if(!authState) {
        return <Loading className="w-screen h-screen -translate-y-8" />
    }

    return (
        <form className="bg-white py-12 px-4 sm:px-12 sm:py-24 lg:px-24 min-h-screen flex justify-center items-center font-[ProductSans]" onSubmit={handleSubmit}>
            <div className="max-w-xl m-auto border border-gray-300 p-8 shadow-lg rounded-lg">
                <div className="space-y-2">
                    <div className="border-b border-gray-900/10 pb-6">
                        <h2 className="text-3xl font-bold leading-7 text-gray-900">Register</h2>
                        <p className="text-red-600 text-sm mt-2">{error && error}</p>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                    Username
                                </label>
                                <div className="mt-1">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-400 focus-within:outline-none sm:max-w-md">
                                        <input
                                            required
                                            type="text"
                                            name="username"
                                            id="username"
                                            className="block flex-1 border-0 bg-transparent py-1 sm:py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                                            placeholder="janesmith"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-8">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            This information won&apos;t be a part of your public profile.
                        </p>

                        <div className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
                                    First name
                                </label>
                                <div className="mt-1">
                                    <input
                                    required
                                    type="text"
                                    name="first_name"
                                    id="first_name"
                                    className="block w-full rounded-md border-0 py-1 sm:py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 focus-within:outline-none sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Last name
                                </label>
                                <div className="mt-1">
                                    <input
                                    type="text"
                                    name="last_name"
                                    id="last_name"
                                    className="block w-full rounded-md border-0 py-1 sm:py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 focus-within:outline-none sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

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
                                    className="block w-full rounded-md border-0 py-1 sm:py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 focus-within:outline-none sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="col-span-6 sm:col-span-2">
                                <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                                    Gender
                                </label>
                                <div className="mt-1">
                                    <select
                                    id="gender"
                                    name="gender"
                                    className="block w-full rounded-md border-0 py-1 sm:py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-400 focus-within:outline-none sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer_not_to_say">Prefer Not To Say</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-span-6 sm:col-span-2">
                                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                    Phone
                                </label>
                                <div className="mt-1">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-400 sm:max-w-md">
                                        <span className="flex select-none items-center ps-3 pe-1 text-gray-500 sm:text-sm">+91</span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            className="block flex-1 border-0 bg-transparent py-1 sm:py-1.5 ps-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 outline-none sm:text-sm sm:leading-6"
                                            placeholder="8273927425"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-6 sm:col-span-2">
                                <label htmlFor="date_of_birth" className="block text-sm font-medium leading-6 text-gray-900">
                                    DOB
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        id="date_of_birth"
                                        className="block w-full rounded-md border-0 py-1 sm:py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 focus-within:outline-none sm:text-sm sm:leading-6"
                                        required
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
                                        className="block w-full rounded-md border-0 py-1 sm:py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 focus-within:outline-none sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="pb-6 pt-2">
                        <div className="relative flex gap-x-3">
                            <div className="flex h-6 items-center">
                                <input
                                required
                                id="agreement"
                                name="agreement"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400 focus-within:outline-none"
                                />
                            </div>
                            <div className="text-sm leading-6">
                                <label htmlFor="agreement" className="font-medium text-gray-900">
                                    By checking this box, you agree to our Privacy Policy and Terms of Service.
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-2 flex flex-col items-center space-y-2">
                    <button
                    type="submit"
                    className="rounded-md w-full px-3 py-2 text-sm font-semibold text-white text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                    Register
                    </button>
                    <p className="text-base text-sm text-gray-500">
                        Already have an account? 
                        <Link href="/login" className="ml-1 text-blue-500">Login</Link>
                    </p>
                </div>
            </div>
        </form>
    )
}