import React, { useEffect, useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useParams } from "react-router-dom";

const LinkDetails = () => {
  const [link, setLink] = useState({});
  const axiosPublic = useAxiosPublic();
  const { id } = useParams();

  useEffect(() => {
    const fetchLinkDetails = async () => {
      try {
        const { data } = await axiosPublic.get(`/link-details/${id}`);
        console.log(data);
        setLink(data);
      } catch (error) {
        console.error("Error fetching link details:", error);
      }
    };

    fetchLinkDetails();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-blue-600 mb-12 text-center">
        See the Link Details Here
      </h2>

      {/* Optional: Display image if it exists */}
      {link.fileUrl && !link.textUrl ? (
        <div className="mt-4  flex justify-center">
          <img
            src={link.fileUrl}
            className="w-44 h-44 rounded-lg object-cover"
          />
        </div>
      ) : (
        <div className="my-4">
          <p className="text-gray-600">
            <strong>Shared Content:</strong>{" "}
            {link.content ? link.content : "No content available"}
          </p>
        </div>
      )}

      <div className="mb-4">
        <p className="text-gray-600">
          <strong>Shared Link: </strong>
          <span className="whitespace-normal break-words text-blue-500">
            {link.fileUrl || link.textUrl}
          </span>
        </p>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          <strong>Private:</strong> {link.isPrivate ? "Private" : "Public"}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          <strong>Expiration Date:</strong>{" "}
          {link.expirationDate ? link.expirationDate : "No expiration date set"}
        </p>
      </div>
      <div className="mb-4">
        <p className="text-gray-600">
          <strong>Total Link Visited:</strong> {link.VisitedCount}
        </p>
      </div>
    </div>
  );
};

export default LinkDetails;
