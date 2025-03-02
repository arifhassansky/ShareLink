import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const DisplayLinks = () => {
  const [links, setLinks] = useState([]);
  const axiosPublic = useAxiosPublic();

  // Fetch all links from the backend
  const fetchLinks = async () => {
    try {
      const { data } = await axiosPublic.get("/links"); // Adjust the API endpoint if necessary
      setLinks(data); // Assume the response contains an array of links
    } catch (error) {
      toast.error("Error fetching links.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="w-9/12 mx-auto p-4 my-16">
      <h2 className="text-4xl font-semibold text-center text-white mb-6">
        All Shared Links
      </h2>

      <div className="space-y-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {links.length === 0 ? (
          <p className="text-center text-gray-500">No links available.</p>
        ) : (
          links?.map((link) => (
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
                <p className="text-sm text-gray-600 mt-2">{link.content}</p>
              </div>
              <div className="flex justify-center mt-2">
                <a
                  href={link.fileUrl || link.textUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-4 mb-2 rounded-2xl text-lg font-semibold"
                >
                  View Link
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DisplayLinks;
