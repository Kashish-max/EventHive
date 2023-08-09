import { useState } from 'react'
import { Inter } from 'next/font/google'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowRightOnRectangleIcon, BookmarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Cookies from 'js-cookie'

import { makeRequest } from '@/components/helpers'
import Layout from '@/components/layout'
import Modal from '@/components/modal'
import BaseSpeedDial from '@/components/speed-dial'
import useAuthentication from '@/components/hooks/useAuthentication'
import Loading from '@/components/loading'
import { selectOpen, setOpen, setDefaultTab } from '@/store/authSlice'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const dispatch = useDispatch();
  const open = useSelector(selectOpen);
  const { authState, user } = useAuthentication();
  const [loading, setLoading] = useState(false);

  const handleLogout = async(e) => {
    e.preventDefault();

    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  
    let data = { refresh: refreshToken };

    setLoading(true);
    try {
      const response = await makeRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout/`, 'POST', data, config);
      if (response.status === 200) {
        console.log('User logged out successfully.');
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.reload()
      } else {
        // Cookies.remove('access_token');
        // Cookies.remove('refresh_token');    
        console.log('Logout request failed from server.');
        console.log(response);
        setLoading(false);
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
      setLoading(false);
    }
  }

  if(loading) return <Loading className="w-screen h-screen -translate-y-8" />
  if(!user && !authState) return <Loading className="w-screen h-screen -translate-y-8" />

  return (
      <Layout>
        { user &&
          <BaseSpeedDial logout={handleLogout} />
        }
        <Modal authData={{authState, user}} />
        <div className="max-w-3xl flex flex-col items-center space-y-8">
          <h1 className="text-lg sm:text-2xl text-black text-center">Explore opportunities from across the globe to learn, showcase skills, gain CV points, & get hired by your dream company.</h1>
          <div className="flex space-x-2">
            {user ?
              <>
                <button 
                  onClick={() => {
                    dispatch(setDefaultTab('hackathons'))
                    dispatch(setOpen(true))
                  }} 
                  className="flex items-center rounded-md text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-sm px-5 py-2.5 mr-2 mb-2"
                >
                  <BookmarkIcon className="h-4 w-4 mr-2" />
                  <span>Explore Hackathons</span>
                </button>
                <button 
                  className="flex items-center rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium text-sm px-5 py-2.5 mr-2 mb-2"
                  onClick={handleLogout}
                >
                  <span>Logout</span>
                </button> 
              </>
              :
              <>
                <Link href="/login" className="flex items-center rounded-md text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-sm px-5 py-2.5 mr-2 mb-2">
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  <span>Login</span>
                </Link>
                <Link href="/signup" className="flex items-center rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium text-sm px-5 py-2.5 mr-2 mb-2">
                  <span>Signup</span>
                </Link>              
              </>             
            }
          </div>
        </div>
      </Layout>
    )
}
