const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSUbmit = async (e) => {
    e.preventDefault();
  };
  return (
    <>
      <div>
        <h1>Register Page</h1>
      </div>
      <div>
        <form>
          <div>name</div>
          <div>email</div>
          <div>password</div>
          <div>confirm password</div>
          <div>
            <button type="submit">Create new account</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
