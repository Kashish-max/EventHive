import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CodeBracketIcon } from '@heroicons/react/24/outline'
import Cookies from 'js-cookie'

import { makeRequest } from '../helpers'
import useAuthentication from '../hooks/useAuthentication'
import ModalLayout from './tab-body-layout'
import HackCard from '../hack-card'
import Loading from '../loading'
import { selectSearch, selectUpdate } from '../../store/authSlice'

export default function MyListings() {
    const { authState, user } = useAuthentication();    

    const [myListings, setMyListings] = useState();
    const search = useSelector(selectSearch);
    const update = useSelector(selectUpdate);

    useEffect(() => {
        fetchMyListings();
    }, [update])

    const fetchMyListings = async() => {
        const accessToken = Cookies.get('access_token');
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        try {
            const response = await makeRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hackathons/my-listings/`, 'GET', null, config);
            if (response.status === 200) {
                console.log(response.data);
                setMyListings(response.data);
            } else { console.log(response) }
        } catch (error) {
            console.error('An error occurred while fetching hackathons:', error);
        }
    }

    const Body = () => {
        return (
            <div className="bg-[#f6f8fa] px-2 sm:px-6 lg:px-20 pt-6 pb-16 space-y-4">
                {(myListings?.length > 0) ? 
                    myListings.filter((hackathon) => (hackathon.title.toLowerCase().includes(search))).map((hackathon) => {
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
                    You need to be logged in to view this page.
                </div>        
            )
        )
    }

    if(!myListings) return <Loading />

    return (
        <div>
            <ModalLayout 
                icon={<CodeBracketIcon className="h-6 w-6 text-black" aria-hidden="true" />}
                title="Your Hackathons"
                description="View all your hosted hackathons"
                showSearch={true}
            >
                <Body />
            </ModalLayout>
        </div>
    )
}