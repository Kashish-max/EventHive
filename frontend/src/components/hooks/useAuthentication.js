import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';

const useAuthentication = (redirectTo) => {
  const router = useRouter();
  const [authState, setAuthState] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = Cookies.get('access_token');
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/list/me/`,
          config
        );
        if (response.status === 200) {
          setUser(response.data);
          if(redirectTo) router.push(redirectTo)
        } else {
          setAuthState(true);
        }
      } catch (error) {
        setAuthState(true);
      }
    };

    fetchUser();
  }, []);

  return { authState, user };
};

export default useAuthentication;
