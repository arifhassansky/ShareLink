import { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import authContext from "../context/AuthContext";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logOut } = useContext(authContext);

  const handleLogout = async () => {
    await logOut();
  };

  return (
    <div className="bg-blue-100 py-4">
      <div className="w-9/12 mx-auto flex items-center justify-between">
        <Link to="/" className="text-blue-500 font-bold text-2xl">
          Share<span className="text-green-600">Link</span>
        </Link>

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
                  className="w-10 h-10 rounded-full cursor-pointer"
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

                  <div className="px-2 mb-2">
                    <Link
                      to="/create-link"
                      onClick={() => setProfileOpen(false)}
                      className="px-11 py-1 text-green-600 font-medium hover:text-white rounded hover:bg-green-600 ho cursor-pointer"
                    >
                      Create Link
                    </Link>
                  </div>

                  <div className="px-2">
                    <Link
                      to="/my-links"
                      onClick={() => setProfileOpen(false)}
                      className="px-7 py-1 text-green-600 font-medium hover:text-white rounded hover:bg-green-600 ho cursor-pointer"
                    >
                      My Shared Links
                    </Link>
                  </div>

                  <div className="px-2 py-4">
                    <button
                      onClick={handleLogout}
                      className="w-full py-1 text-white rounded bg-green-600 cursor-pointer"
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
              Login / Register
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
