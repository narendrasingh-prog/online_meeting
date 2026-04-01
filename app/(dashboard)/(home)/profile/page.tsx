'use server'
import React, { Suspense } from 'react'
import Profile from '@/components/profile/Profile'
import { ProfileService } from '@/services/ProfileService';
import UserLoading from './loading';

const ProfilePage = async() => {
    const profileService=await ProfileService.Server();
    const user=await profileService.getProfile();

      const userData=user.success?user.data:null;
      
  return (
    <Suspense fallback={<UserLoading/>}>
        
        <Profile userData={userData} />
    </Suspense>
  )
}

export default ProfilePage
