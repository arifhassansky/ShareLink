import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaTrash } from "react-icons/fa";
import useAxiosPublic from "../hooks/useAxiosPublic";
import authContext from "../context/AuthContext";
import { toast } from "react-toastify";

const MySharedLinks = () => {
  const [newLink, setNewLink] = useState("");
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(authContext);

  // Fetch links using useQuery
  const { data: links = [], refetch } = useQuery({
    queryKey: ["sharedLinks", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/my-shared-links/${user?.email}`);
      return data;
    },
  });

  // Handle Add or Update Link
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newLink.trim()) return;

    try {
      if (editing) {
        await axiosPublic.put(`/my-shared-links/${editing._id}`, {
          url: newLink,
        });
      } else {
        await axiosPublic.post(`/my-shared-links`, {
          url: newLink,
          email: user.email,
        });
      }
      setNewLink("");
      setEditing(null);
      refetch(); // Manually refetch the data
    } catch (error) {
      console.error("Error saving link:", error);
    }
  };

  const confirmDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div className="flex items-center justify-between gap-2 p-2">
          <p className="text-sm text-gray-700 flex-1">
            Are you sure delete your task?
          </p>
          <div className="flex gap-2">
            <button
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
              onClick={() => {
                handleDelete(id);
                closeToast();
              }}
            >
              Yes
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
              onClick={closeToast}
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };
  // Handle Delete Link
  const handleDelete = async (id) => {
    const { data } = await axiosPublic.delete(`/my-shared-links/${id}`);
    if (data.deletedCount > 0) {
      toast.success("Link deleted Successfully");
      refetch();
    }
  };

  // Open Modal for Editing
  const openEditModal = (link) => {
    setCurrentLink(link);
    setShowModal(true);
  };

  // Handle Update Inside Modal
  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedLink = {
      content: currentLink.content,
      isPrivate: currentLink.isPrivate,
      expirationDate: currentLink.expirationDate,
    };

    try {
      const { data } = await axiosPublic.put(
        `/my-shared-links/${currentLink._id}`,
        updatedLink
      );
      setShowModal(false);
      refetch();
      if (data.modifiedCount > 0) toast.success("Updated successfully");
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  return (
    <div className="max-9/12 mx-auto p-6 bg-white">
      <div className="text-center mt-6">
        <h2 className="text-3xl font-bold text-blue-600">Your Shared Links</h2>
        <p className="text-gray-600 mb-6 mt-2">
          Discover, manage, and update all the links you’ve shared, right from
          this page.
        </p>
      </div>

      {/* Links List */}
      <div className="space-y-3 grid grid-cols-2 md:grid-cols-3 gap-8 ">
        {links?.map((link) => (
          <div
            key={link._id}
            className="flex items-center relative p-4 rounded-lg shadow-md h-60 bg-gradient-to-r from-green-100 to-blue-100"
          >
            <div className="w-full max-w-lg p-4 rounded-lg">
              <div className="flex justify-between items-center">
                {link.content ? (
                  <p className="text-gray-600 mt-2">
                    <strong>Shared Content:</strong> {link.content}
                  </p>
                ) : (
                  <div className="flex items-center gap-6">
                    <strong>Shared Image:</strong>
                    <img
                      className="w-16 h-16 rounded-lg object-cover"
                      src={link.fileUrl}
                      alt="shared content"
                    />
                  </div>
                )}

                {/* action buttons */}
                <div className="flex gap-2 mt-4 absolute top-0 right-4">
                  <button
                    onClick={() => openEditModal(link)}
                    className="text-green-500 cursor-pointer"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => confirmDelete(link._id)}
                    className="text-red-500 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mt-2">
                <strong>Private: </strong>
                {link.isPrivate ? "Private" : "Public"}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Expiration Date:</strong> {link.expirationDate || "N/A"}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Link: </strong>
                <span className="whitespace-normal break-words">
                  {link.fileUrl} {link.textUrl}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Editing */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-md">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Edit Shared Link
            </h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Shared Content
                </label>
                <textarea
                  value={currentLink.content}
                  onChange={(e) =>
                    setCurrentLink({ ...currentLink, content: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  rows="4"
                  placeholder="Enter content"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Private
                </label>
                <select
                  value={currentLink.isPrivate}
                  onChange={(e) =>
                    setCurrentLink({
                      ...currentLink,
                      isPrivate: e.target.value === "true",
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="false">Public</option>
                  <option value="true">Private</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={currentLink.expirationDate || ""}
                  onChange={(e) =>
                    setCurrentLink({
                      ...currentLink,
                      expirationDate: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySharedLinks;
