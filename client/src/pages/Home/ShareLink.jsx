import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Link, useNavigate } from "react-router-dom";

const DisplayLinks = () => {
  const [links, setLinks] = useState([]);
  const [passwordModal, setPasswordModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [password, setPassword] = useState("");
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  console.log(password);

  // Fetch all links from the backend
  const fetchLinks = async () => {
    try {
      const { data } = await axiosPublic.get("/links");
      setLinks(data);
    } catch (error) {
      toast.error("Error fetching links.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleLinkClick = async (link) => {
    if (!link.isPrivate) {
      try {
        // Increase visit count
        await axiosPublic.patch(`/update-count/${link._id}`);
        navigate(`/link-details/${link._id}`);
      } catch (error) {
        toast.error("Failed to update visit count.");
        console.error(error);
      }
    } else {
      setSelectedLink(link);
      setPasswordModal(true);
    }
  };

  const verifyPassword = async () => {
    try {
      const { data } = await axiosPublic.post("/verify-password", {
        linkId: selectedLink._id,
        password,
      });

      if (data.success) {
        toast.success("Access granted!");
        await axiosPublic.patch(`/update-count/${selectedLink._id}`);
        navigate(`/link-details/${selectedLink._id}`);
      } else {
        toast.error("Incorrect password.");
      }
    } catch (error) {
      toast.error("Failed to verify password.");
      console.error(error);
    }
    setPasswordModal(false);
    setPassword("");
  };

  return (
    <div className="w-9/12 mx-auto p-4 my-16">
      <h2 className="text-4xl font-semibold text-center text-white mb-6">
        All Shared Links
      </h2>

      <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {links.length === 0 ? (
          <p className="text-center text-gray-500">No links available.</p>
        ) : (
          links.map((link) => (
            <div
              key={link._id}
              className="flex flex-col bg-gray-50 px-4 rounded-lg shadow-sm h-28"
            >
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500 bg-amber-100 px-2 rounded-2xl">
                  {link.isPrivate ? "Private" : "Public"}
                </span>
                <span>
                  Expired: {link.expirationDate ? link.expirationDate : "N/A"}
                </span>
              </div>
              <div className="flex flex-col items-center justify-between grow-1">
                <p className="text-sm text-gray-600 mt-2">
                  {link.content ? link.content : "Image / Video"}
                </p>
              </div>
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => handleLinkClick(link)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 mb-2 rounded-2xl text-lg font-semibold"
                >
                  View Link
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Password Modal */}
      {passwordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-center">
              This Link is Private. Enter Password to see the link details.
            </h3>
            <input
              type="password"
              className="w-full p-2 border rounded"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setPasswordModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={verifyPassword}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayLinks;
