import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import authContext from "../context/AuthContext";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logOut } = useContext(authContext);

  const handleLogout = async () => {
    await logOut();
  };

  return (
    <div className="bg-gray-100 py-4">
      <div className="w-9/12 mx-auto flex items-center justify-between">
        <h3 className="text-blue-500 font-bold text-2xl">
          Share<span className="text-green-600">Link</span>
        </h3>

        <div className="relative">
          {user ? (
            <div>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2"
              >
                <img
                  src={user.photoURL}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
              </button>

              {profileOpen && (
                <div className="absolute z-[1000] right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                  <div className="p-4">
                    <p className="text-sm font-medium text-black">
                      {user.displayName}
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  <div className="px-2 py-4">
                    <button
                      onClick={handleLogout}
                      className="w-full py-2 text-white rounded bg-green-600 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className="text-blue-500 text-lg font-semibold"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
