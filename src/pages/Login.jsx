import Google from "../images/google.png";

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const google = () => {
    window.open(`${API_URL}/api/auth/google`, "_self");
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
