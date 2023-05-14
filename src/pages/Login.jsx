import Google from "../images/google.png";

const Login = () => {
  const google = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  };

  return (
    <div className="login">
      <h1 className="loginTitle">Login to Get Started</h1>
      <div className="loginButton google" onClick={google}>
        <img src={Google} alt="" className="icon" />
        Google
      </div>
    </div>
  );
};

export default Login;
