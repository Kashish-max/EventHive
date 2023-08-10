import { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { MegaphoneIcon } from '@heroicons/react/24/outline'
import Cookies from 'js-cookie'

import { makeRequest } from '../helpers'
import { setOpen } from '@/store/authSlice'
import useAuthentication from '../hooks/useAuthentication'
import ModalLayout from './tab-body-layout'
import Editor from '../editor'
import Upload from '../upload'
import Loading from '../loading'
import Success from '../success'

export default function HostHackathon({authData}) { 
    const router = useRouter();
    const dispatch = useDispatch();

    const { authState, user } = useAuthentication();
    const [hackLogo, setHackLogo] = useState(null);
    const [hackLogoPreview, setHackLogoPreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);

    let description = [
        { insert: "This field helps you to mention the details of the opportunity you are listing. It is better to include Rules, Eligibility, Process, Format, etc., in order to get the opportunity approved. The more details, the better!" },
        { insert: '\n' },
        { insert: '\n' },
      
        { insert: "Guidelines:", attributes: { bold: true } },
        { insert: '\n' },
        
        { insert: "Mention all the guidelines like eligibility, format, etc."},
        { insert: "\n", attributes: { "list": "unordered" } },
        { insert: "Inter-college team members allowed or not." },
        { insert: "\n", attributes: { "list": "unordered" } },
        { insert: "Inter-specialization team members allowed or not." },
        { insert: "\n", attributes: { "list": "unordered" } },
        { insert: "The number of questions/ problem statements." },
        { insert: "\n", attributes: { "list": "unordered" } },
        { insert: "Duration of the rounds." },
        { insert: "\n", attributes: { "list": "unordered" } },
      
        { insert: "Rules:", attributes: { bold: true } },
        { insert: "\n" },
      
        { insert: "Mention the rules of the competition." },
        { insert: "\n", attributes: { "list": "unordered" }}
    ];    
    const setDescription = (data) => {
        description = data;
    }

    const handleFileChange = (event) => {
        event.preventDefault();
        setHackLogo(event.target.files[0]);

        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const previewImage = reader.result;
            setHackLogoPreview(previewImage);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        const today = new Date().toJSON().slice(0, 10);

        if(data.start_on < today) { 
            setError('Start date should be after today.');
            return;
        }
        if(data.start_on >= data.end_on) { 
            setError('Start date should be before end date.');
            return;
        }
        // data.submission_type = [data.submission_type];
        if(!data.reward) delete data.reward;
        data.title = data.title.trim();
        data.logo = hackLogo;
        data.description = description;
        registerHackathon(data);
    }

    const registerHackathon = (data) => {
        const accessToken = Cookies.get('access_token');
        const config = {
          headers: {
            'content-type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        };

        try {
            setLoading(true);
            setTimeout(async() => {
                const response = await makeRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hackathons/list/`, 'POST', data, config);
                if (response.status === 201) {
                    console.log('Hackathon registered successfully.');
                    setHackLogoPreview(null);
                    setHackLogo(null);
                    setLoaded(true);
                    setTimeout(() => {
                        dispatch(setOpen(false));
                    }, 3000);
                } else { 
                    console.log(response)
                    setError(response);
                    setHackLogo(null);
                    setHackLogoPreview(null);
                    setLoading(false);
                    if(response.status === 401) router.push("/login");
                }    
            }, 1000)
        } catch (error) {
            console.error('An error occurred while fetching hackathons:', error);
        }
    }

    const Body = () => {
        return (
            <div className="bg-white px-4 sm:px-2 sm:px-6 lg:px-20 pt-6 pb-16 space-y-4">
                <form className="font-[ProductSans]" onSubmit={handleSubmit}>
                    <div className="space-y-6 border-t border-gray-900/10 py-8">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-lg font-semibold leading-7 text-black">Registrations Details</h2>
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                <div className="col-span-full">
                                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                                        Opportunity Logo
                                    </label>
                                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                        <div className="text-center">

                                            <div className="flex text-sm leading-6 justify-center text-gray-600">
                                                <Upload 
                                                    name="logo"
                                                    accept="image/*"
                                                    text="Opportunity Logo"
                                                    previewState={hackLogoPreview}
                                                    handleChange={handleFileChange}
                                                />
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>                                            
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                                        Title{' '}<span className="text-red-700">*</span>
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        required
                                        />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                        Description{' '}<span className="text-red-700">*</span>
                                    </label>
                                    {/* <div className="mt-2">
                                        <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        required
                                        />
                                    </div> */}
                                    <Editor initalContents={description} setContents={setDescription} />
                                    <p className="mt-3 text-sm leading-6 text-gray-600">Describe the opportunity in a few sentences.</p>
                                </div>

                            </div>
                        </div>

                        <div>
                            <h2 className="text-base font-semibold leading-7 text-gray-900">More Details</h2>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="start_on" className="block text-sm font-medium leading-6 text-gray-900">
                                        Start Date{' '}<span className="text-red-700">*</span>
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        type="datetime-local"
                                        name="start_on"
                                        id="start_on"
                                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        required
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="end_on" className="block text-sm font-medium leading-6 text-gray-900">
                                        End Date{' '}<span className="text-red-700">*</span>
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        type="datetime-local"
                                        name="end_on"
                                        id="end_on"
                                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        required
                                        />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="submission_type" className="block text-sm font-medium leading-6 text-gray-900">
                                        Submission Type{' '}<span className="text-red-700">*</span>
                                    </label>
                                    <div className="mt-2">
                                        <select
                                        id="submission_type"
                                        name="submission_type"
                                        className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        required
                                        >
                                            <option value="image">Image</option>
                                            <option value="file">File</option>
                                            <option value="link">Link</option>
                                        </select>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">Choose the format of submission for the Hackathon.</p>                                    
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="reward" className="block text-sm font-medium leading-6 text-gray-900">
                                        Host Name{' '}<span className="text-red-700">*</span>
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="host_display_name"
                                            name="host_display_name"
                                            type="text"
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                            placeholder="10000"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="reward" className="block text-sm font-medium leading-6 text-gray-900">
                                        Reward Prize{' '}
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="reward"
                                            name="reward"
                                            type="number"
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                            placeholder="10000"
                                        />
                                    </div>
                                </div>
                                
                            </div>
                            
                            {error && <p className="text-md text-red-700 mt-4">{error}</p>}
                        </div>

                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                        type="submit"
                        className="rounded-md bg-blue-600 tracking-wider px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Create
                        </button>
                    </div>
                </form>

            </div>            
        )
    }

    if(!user) {
        return (
            (!authState ? 
                <Loading /> 
                : 
                <div className="p-8 flex w-full justify-center items-center">
                    You need to be logged in to host a hackathon.
                </div>        
            )
        )
    }

    if(loading) {
        return (
            <div className="h-screen flex flex-col justify-center">
                { loaded ? <Success /> : <Loading /> }
            </div>
        )
    }

    return (
        <div>
            <ModalLayout 
                icon={<MegaphoneIcon className="h-6 w-6 text-black" aria-hidden="true" />}
                title="Host a Hackathon"
                description="Host a hackathon on our platform and reach out to thousands of developers."
            >
                <Body />
            </ModalLayout>
        </div>
    )
}