import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import {
    StarIcon,
    UsersIcon,
    NoSymbolIcon,
    TrashIcon,
    CheckBadgeIcon
} from "@heroicons/react/24/outline";
import {
    CodeBracketSquareIcon
} from "@heroicons/react/24/solid";
import Cookies from "js-cookie";

import { selectUpdate, setOpen, setUpdate } from '@/store/authSlice'
import { makeRequest, getDaysBetweenDates } from "./helpers";
import SubModal from "./sub-modal";
import Loading from "./loading";


export default function HackCard({authData, hackathon}) {
    const router = useRouter();
    const dispatch = useDispatch();
    const update = useSelector(selectUpdate);

    const [loading, setLoading] = useState(true);
    const [enrollments, setEnrollments] = useState(null);
    const [userEnrollment, setUserEnrollment] = useState(null);
    const [openSubModal, setOpenSubModal] = useState(false);

    useEffect(() => {
        fetchHackathonEnrollments();
    }, [])

    const fetchHackathonEnrollments = async() => {
        try {
            const response = await makeRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hackathons/${hackathon.id}/enrollments`, 'GET');
            if (response.status === 200) {
                setEnrollments(response.data);
                setUserEnrollment(response.data.find((enrollment) => (enrollment.user === authData?.user.id)));
                setLoading(false);
            } else { 
                console.log(response) 
                setLoading(false);
            }
        } catch (error) {
            console.error(`An error occurred while fetching enrollments of hackathon - ${hackathon.title}:`, error);
            setLoading(false);
        }
    }

    const handleApply = async() => {
        if(!authData?.user){
            router.push('/login');
            return;
        } 
        const data = { hackathon: hackathon.id }
        const accessToken = Cookies.get('access_token');
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }

        try {
            setLoading(true);
            const response = await makeRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hackathons/enroll/`, 'POST', data, config);
            if (response.status === 201) {
                fetchHackathonEnrollments();
                setTimeout(() => {
                    dispatch(setUpdate(!update));
                    setLoading(false);
                }, 1000);
            } else { 
                console.log(response) 
                setLoading(false);
            }
        } catch (error) {
            console.error(`An error occurred while enrolling for hackathon - ${hackathon.title}:`, error);
            setLoading(false);
        }
    }

    const handleSubmission = async() => {
        setOpenSubModal(true);
    }

    const handleDelete = async() => {
        const accessToken = Cookies.get('access_token');
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }

        try {
            setLoading(true);
            const response = await makeRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hackathons/list/${hackathon.id}/`, 'DELETE', null, config);
            setTimeout(() => {
                // dispatch(setOpen(false));                    
                dispatch(setUpdate(!update));
            }, 1000);
        } catch (error) {
            console.error(`An error occurred while deleting enrollment for hackathon - ${hackathon.title}:`, error);
            setLoading(false);
        }
    }

    const isHackathonOpen = (date) => { return (new Date(date).toJSON() > getCurrentDate()) }
    const getCurrentDate = () => { return new Date().toJSON() }
    const madeSubmission = () => { 
        return (
            userEnrollment && userEnrollment[userEnrollment?.submission_type[0] + "_submission"]
        ) 
    }

    const Button = ({className, text, icon=null, disabled=false, onClick}) => {
        return (
            <button 
                disabled={disabled} 
                className={`flex items-center rounded-md text-white focus:outline-none focus:ring-4 font-medium text-sm mt-4 ${className} {${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}}`} 
                onClick={onClick}
            >
                {icon && icon}
                <span>{text}</span>
            </button>
        )
    }

    if(loading) return <Loading />

    return (
        <Card 
            color="white" 
            shadow={false} 
            className={
                madeSubmission() ? 
                "w-full shadow-md px-4 md:px-6 lg:px-12 py-2 rounded-lg border-b-2 border-green-700"
                :
                "w-full shadow-md px-4 md:px-6 lg:px-12 py-2 rounded-lg"
            }>

            {/* Submission Modal */}
            { userEnrollment && <SubModal open={openSubModal} setOpen={setOpenSubModal} enrollment={userEnrollment} refresh={fetchHackathonEnrollments} /> }
            <CardHeader
                color="transparent"
                floated={false}
                shadow={false}
                className="overflow-visible lg:flex justify-between pt-0 pb-6 mx-0"
            >
                <div className="mx-0 sm:flex items-center gap-4">
                    { hackathon.logo ?
                        <img
                            src={hackathon.logo}
                            className="rounded-full h-16 w-16"
                            alt="img"
                        />
                        :
                        <CodeBracketSquareIcon className="w-28 text-black -translate-x-2" aria-hidden="true" />
                    }
                    <div className="flex w-full flex-col gap-0.5 mt-2 sm:mt-0">
                        <div className="flex items-center justify-between">
                            <Typography variant="h5" color="blue-gray" className="font-[ProductSans] tracking-wider">
                                {hackathon.title}
                            </Typography>
                            <div className="5 flex items-center gap-0">

                            </div>
                        </div>
                        <Typography color="blue-gray" className="font-[ProductSans] tracking-wide text-sm capitalize">{hackathon?.host_display_name}</Typography>
                    </div>
                </div>
                <div className="sm:flex items-start space-y-2 sm:space-y-0 sm:space-x-2 mt-4 lg:mt-0 font-[ProductSans] ">
                    { hackathon.reward &&
                        <div className="hidden xl:flex items-center sm:border-r border-gray-400 sm:pe-3">
                            <StarIcon className="w-5 h-5 text-gray-600" />
                            <span className="text-sm text-gray-800 ms-1.5 flex items-center">
                                <span className="font-semibold text-gray-600 text-lg mr-0.5 leading-none">&#x20B9;</span>
                                {hackathon.reward.toLocaleString('en-US', {maximumFractionDigits:2})}
                            </span>
                        </div>
                    }
                    <div className="flex items-center sm:border-r border-gray-400 sm:pe-3">
                        <UsersIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-800 ms-1.5 flex items-center">
                            {enrollments?.length} Registered
                        </span> 
                    </div>
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#4b5563" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-800 ms-1.5">
                                { isHackathonOpen(hackathon.start_on) ?
                                    <>{getDaysBetweenDates(getCurrentDate(), hackathon.start_on)} days left</>
                                    :
                                    ( isHackathonOpen(hackathon.end_on) ? 
                                        <>Ongoing</>
                                        :
                                        <>Expired</>
                                    )
                                }
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="mb-6 p-0 ">
                <Typography className="font-[ProductSans] font-normal text-gray-900 description">
                    <div dangerouslySetInnerHTML={{ __html: (hackathon.description) }}></div>
                </Typography>
                <div className="flex justify-between items-end font-[ProductSans]">
                    <div>
                        { hackathon.reward &&
                            <div className="flex xl:hidden items-center sm:pe-3">
                                Win upto 
                                <span className="text-sm text-gray-800 ms-1.5 flex items-center font-semibold">
                                    <span className="text-gray-900 text-lg mr-0.5 leading-none">&#x20B9;</span>
                                    {hackathon.reward.toLocaleString('en-US', {maximumFractionDigits:2})}
                                </span>
                            </div>
                        }                    
                    </div>
                    <div>
                        {!authData?.user ?
                            (isHackathonOpen(hackathon.start_on) ?
                                <Button className="bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 px-6 py-2" text="Apply" onClick={handleApply} />
                                :
                                <Button className="bg-gray-500 ps-3 pr-4 py-2" text="Closed" icon={<NoSymbolIcon className="h-5 w-5 mr-1" />} disabled={true} />
                            )
                            :
                            <div className="space-x-3 flex">
                                { hackathon.host === authData?.user?.id && 
                                    <Button className="bg-red-800 hover:bg-red-700 ps-3 pr-4 py-2" text="Delete" icon={<TrashIcon className="h-5 w-5 mr-1" />} onClick={handleDelete} />
                                }
                                { userEnrollment ?
                                    ( isHackathonOpen(hackathon.start_on) ?
                                        <Button className="bg-blue-800 ps-3 pr-4 py-2" text="Applied" icon={<CheckBadgeIcon className="h-5 w-5 mr-1" />} disabled={true} />
                                        :
                                        ( madeSubmission() ?
                                            <Button className="bg-green-700 ps-3 pr-4 py-2" text="Submitted" icon={<CheckBadgeIcon className="h-5 w-5 mr-1" />} disabled={true} />
                                            :
                                            ( isHackathonOpen(hackathon.end_on) ?
                                                <Button className="bg-gray-900 hover:bg-gray-800 focus:ring-black px-6 py-2" text="Make Submission" onClick={handleSubmission} />
                                                :
                                                <Button className="bg-gray-500 ps-3 pr-4 py-2" text="Closed" icon={<NoSymbolIcon className="h-5 w-5 mr-1" />} disabled={true} />
                                            )
                                        )
                                    )
                                    :
                                    (isHackathonOpen(hackathon.start_on) ?
                                        <Button className="bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 px-6 py-2" text="Apply" onClick={handleApply} />
                                        :
                                        <Button className="bg-gray-500 ps-3 pr-4 py-2" text="Closed" icon={<NoSymbolIcon className="h-5 w-5 mr-1" />} disabled={true} />
                                    )
                                }
                            </div>
                        }
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}