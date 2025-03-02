import { Link } from "react-router-dom";
import ShareLink from "./ShareLink";
const Home = () => {
  return (
    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 flex flex-col justify-center items-center">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-white py-20 px-4">
        <h2 className="text-4xl font-bold mb-4">
          Share Your Links Securely & Privately
        </h2>
        <p className="text-lg max-w-2xl text-center mb-8">
          Share links to text, images, and files with ease. Set your links as
          public for anyone or private for secure access.
        </p>
        <Link
          to="/create-link"
          className="bg-green-600 px-6 py-3 rounded text-xl font-semibold hover:bg-green-700 transition"
        >
          Create Your Link Now
        </Link>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-teal-500 mb-4">
              Simple Link Creation
            </h3>
            <p className="text-lg text-gray-600">
              Quickly create links for text, images, or files and share them
              with others instantly.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-teal-500 mb-4">
              Public or Private Links
            </h3>
            <p className="text-lg text-gray-600">
              Set your links to be public or private with password protection or
              authentication.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-teal-500 mb-7">
              Expiration & Analytics
            </h3>
            <p className="text-lg text-gray-600">
              Control how long your links last and track their access with
              detailed analytics.
            </p>
          </div>
        </div>
      </section>

      {/*  Shared Links */}
      <ShareLink />
    </div>
  );
};

export default Home;
