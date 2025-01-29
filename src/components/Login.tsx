import MyForm from "./MyForm";

const Login = () => {

  return (
    <>
    <h2>Login</h2>
    <MyForm path="/register" linkText="Don't have an account? Register!" route="login"/>
    </>
  );
};

export default Login;