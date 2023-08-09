import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CodeBracketIcon } from '@heroicons/react/24/outline'
import Cookies from 'js-cookie'

import { makeRequest } from '../helpers'
import useAuthentication from '../hooks/useAuthentication'
import ModalLayout from './tab-body-layout'
import HackCard from '../hack-card'
import Loading from '../loading'
import { selectSearch } from '../../store/authSlice'

export default function MyRegistrations() {
    const { authState, user } = useAuthentication();    

    const [myEnrollments, setEnrollments] = useState();
    const search = useSelector(selectSearch);

    useEffect(() => {
        fetchMyRegistrations();
    }, [])

    const fetchMyRegistrations = async() => {
        const accessToken = Cookies.get('access_token');
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        try {
            const response = await makeRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hackathons/my-enrollments/`, 'GET', null, config);
            if (response.status === 200) {
                const data = response.data.map((enrollment) => { return enrollment.hackathon})
                setEnrollments(data);
            } else { console.log(response) }
        } catch (error) {
            console.error('An error occurred while fetching hackathons:', error);
        }
    }

    const Body = () => {
        return (
            <div className="bg-[#f6f8fa] px-2 sm:px-6 lg:px-20 pt-6 pb-16 space-y-4">
                {(myEnrollments?.length > 0) ? 
                    myEnrollments.filter((hackathon) => (hackathon?.title?.toLowerCase().includes(search))).map((hackathon) => {
                        return (
                            <HackCard key={hackathon.id} authData={{user: user, authState: authState}} hackathon={hackathon} />
                        )
                    })
                    :
                    <div className="flex flex-col items-center justify-center">
                        No Hackathons Found.
                    </div>
                }
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

    if(!myEnrollments) return <Loading />

    return (
        <div>
            <ModalLayout 
                icon={<CodeBracketIcon className="h-6 w-6 text-black" aria-hidden="true" />}
                title="Your Registrations"
                description="See all the hackathons you have registered for."
                showSearch={true}
            >
                <Body />
            </ModalLayout>
        </div>
    )
}