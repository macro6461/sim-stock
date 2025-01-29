import MyForm from "./MyForm"
const Register = () =>{
    return (
        <>
        <h2>Register</h2>
        <MyForm path="/login" linkText="Already have an account? Log In!" route="register"/> 
        </>
    )
}

export default Register;