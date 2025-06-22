import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Login from "../components/Login";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate=useNavigate();

  const [credit, setCredit] = useState(false);

  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/user/credits", {
        headers: { token },
      });

      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItemItem("token");
    setToken("");
    setUser(null);
  };
  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);

  const generateImage = async (prompt) => {
    try {
      const {data}=await axios.post(backendurl+'/api/image/generate-image',{prompt},{headers:{token}})

      if(data.success)
      {
        loadCreditsData();
        return data.resultImage
      }
      else
      {
        toast.error(data.message)
        loadCreditsData();
        if(data.creditBalance===0)
        {
          navigate('/buy')
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const value = {
    user,
    setUser,
    setShowLogin,
    showLogin,
    backendurl,
    token,
    setCredit,
    setToken,
    credit,
    loadCreditsData,
    logout,
    generateImage
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
