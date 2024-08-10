import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const Profile = () => {
  const { user, getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();  // Added isAuthenticated and isLoading
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isAuthenticated) {  // Check if the user is authenticated
          const token = await getAccessTokenSilently();
          const response = await axios.get('/api/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setProfile(response.data);
        }
      } catch (error) {
        setError('Error fetching profile data');
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [getAccessTokenSilently, isAuthenticated]);

  if (isLoading) return <div>Loading authentication...</div>;  // Handle the loading state for Auth0

  if (error) return <div>{error}</div>;  // Handle error state

  if (!profile) return <div>Loading profile...</div>;  // Handle loading state for profile

  return (
    <div>
      <h2>{profile.name}</h2>
      <p>Email: {profile.email}</p>
      <p>Organization: {profile.organization}</p>
    </div>
  );
};

export default Profile;
