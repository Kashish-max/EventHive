import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CodeBracketIcon } from '@heroicons/react/24/outline'

import { makeRequest } from '../helpers'
import ModalLayout from './tab-body-layout'
import HackCard from '../hack-card'
import Loading from '../loading'
import { selectSearch, selectUpdate } from '../../store/authSlice'

export default function AllHackathons({authData}) { 
    const [allHackathons, setAllHackathons] = useState();
    const search = useSelector(selectSearch);
    const update = useSelector(selectUpdate);

    useEffect(() => {
        fetchAllHackathons();
    }, [update])

    const fetchAllHackathons = async() => {
        try {
            const response = await makeRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hackathons/list/`, 'GET');
            if (response.status === 200) {
                console.log(response.data);
                setAllHackathons(response.data);
            } else { console.log(response) }
        } catch (error) {
            console.error('An error occurred while fetching hackathons:', error);
        }
    }

    const Body = () => {
        return (
            <div className="bg-[#f6f8fa] px-2 sm:px-6 lg:px-20 pt-6 pb-16 space-y-4">
                {(allHackathons?.length > 0) ? 
                    allHackathons.filter((hackathon) => (hackathon.title.toLowerCase().includes(search))).map((hackathon) => {
                        return (
                            <HackCard key={hackathon.id} authData={authData} hackathon={hackathon} />
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

    if(!allHackathons) return <Loading />

    return (
        <div>
            <ModalLayout 
                icon={<CodeBracketIcon className="h-6 w-6 text-black" aria-hidden="true" />}
                title="Hackathons"
                description="Register for hackathons around the world."
                showSearch={true}
            >
                <Body />
            </ModalLayout>
        </div>
    )
}