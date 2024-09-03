import { useDispatch } from "react-redux";
import { clearUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    navigate("/"); // Redirect to the landing page
  };

  return logout;
};
