import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import AppShell from "@/components/AppShell";
import { fetchUserData } from "@/features/user/userSlice";
import { AppDispatch } from "@/redux/store";

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUserId, currentUserEmail, currentUserName, isLoading, error } =
    useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchUserData());
    }
  }, [dispatch, currentUserId]);

  if (isLoading) {
    return <AppShell>Loading...</AppShell>;
  }

  if (error) {
    return <AppShell>Error: {error}</AppShell>;
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Personal Information
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {currentUserName}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {currentUserEmail}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {currentUserId}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Profile;
