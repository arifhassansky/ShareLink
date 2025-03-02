import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxiosPublic from "../hooks/useAxiosPublic";
import axios from "axios";
import authContext from "../context/AuthContext";

const CreateLink = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(authContext);
  console.log(user?.email);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [file, setFile] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [link, setLink] = useState("");

  // Handle file selection
  const handleFileChange = (e) => setFile(e.target.files[0]);

  // Upload text to Cloudinary as an image (optional if text is provided)
  const uploadTextToCloudinary = async (text) => {
    const formData = new FormData();
    formData.append("file", new Blob([text], { type: "text/plain" }));
    formData.append(
      "upload_preset",
      `${import.meta.env.VITE_CLOUDINARY_PRESET}`
    );
    formData.append("cloud_name", `${import.meta.env.VITE_CLOUDINARY_NAME}`);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_NAME
      }/upload`,
      formData
    );

    return response?.data?.url;
  };

  // Upload file to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      `${import.meta.env.VITE_CLOUDINARY_PRESET}`
    );
    formData.append("cloud_name", `${import.meta.env.VITE_CLOUDINARY_NAME}`);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_NAME
      }/upload`,
      formData
    );

    return response?.data?.url;
  };

  // Handle submit
  const onSubmit = async (data) => {
    if (!data.content && !file) {
      toast.error("Please enter some content or upload a file.");
      return;
    }
    setIsLoading(true);

    let fileUrl = "";
    let textUrl = "";

    // Upload text to Cloudinary if there's text content
    if (data.content) {
      textUrl = await uploadTextToCloudinary(data.content);
      if (!textUrl) {
        setIsLoading(false);
        return;
      }
    }

    // Upload file to Cloudinary if there's a file
    if (file) {
      fileUrl = await uploadToCloudinary(file);
      if (!fileUrl) {
        setIsLoading(false);
        return;
      }
    }

    try {
      // Send data to the backend
      const linkData = {
        email: user?.email,
        content: data.content,
        isPrivate,
        expirationDate: data.expirationDate,
        fileUrl,
        textUrl,
      };

      const response = await axiosPublic.post("/create-link", linkData);
      console.log(response.data.fileUrl);
      setLink(response?.data?.textUrl || response?.data?.fileUrl);
      toast.success("Link created successfully!");
      reset();
      setFile(null);
      setIsPrivate(false);
    } catch (error) {
      toast.error("Error creating link.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
        Create Your ShareLink
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Content Input */}
        <textarea
          {...register("content")}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg mb-4"
          placeholder="Enter the content you want to share..."
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}

        {/* File Upload */}
        <div className="mb-4">
          <label htmlFor="fileUpload" className="text-gray-600">
            Upload a file (Optional)
          </label>
          <input
            type="file"
            id="fileUpload"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Private Link Option */}
        <div className="flex items-center space-x-4 mb-4">
          <label className="text-gray-600">Set as Private</label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
            className="text-blue-500"
          />
        </div>

        {/* Expiration Date */}
        <div className="mb-4">
          <label htmlFor="expiration" className="text-gray-600">
            Set Expiration Date (Optional)
          </label>
          <input
            {...register("expirationDate")}
            type="date"
            id="expiration"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 px-6 py-2 text-white rounded text-lg font-semibold hover:bg-green-700 transition w-full"
        >
          {isLoading ? "Creating..." : "Create Link"}
        </button>
      </form>

      {/* Display the generated link */}
      {link && (
        <div className="my-8 text-center">
          <p className="text-lg font-semibold text-green-600">Your Link:</p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            {link}
          </a>
        </div>
      )}
    </div>
  );
};

export default CreateLink;
