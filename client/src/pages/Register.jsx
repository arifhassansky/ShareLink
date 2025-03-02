import loginImg from "../assets/login.avif";
const Register = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center mb-28">
      {/* Register image */}
      <div>
        <img src={loginImg} />
      </div>
      {/* login with google button */}
      <div className="space-y-3">
        <h3 className="font-semibold text-3xl">Login With Google</h3>
        <h2 className="flex justify-center cursor-pointer">
          <FcGoogle size={50} />
        </h2>
      </div>
    </div>
  );
};

export default Register;
