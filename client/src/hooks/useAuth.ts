import { useSelector } from "react-redux";
import { RootState } from "@/store"; // Adjust this import based on your actual store setup

export interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

export function useAuth() {
  const user = useSelector((state: RootState) => ({
    id: state.user.currentUserId,
    email: state.user.currentUserEmail,
    name: state.user.currentUserName,
    role: state.user.role,
    isEmailVerified: state.user.isEmailVerified,
  }));
  const isAuthenticated = useSelector(
    (state: RootState) => !!state.user.currentUserEmail
  );

  return { user, isAuthenticated };
}
