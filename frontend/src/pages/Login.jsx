import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin") {
      localStorage.setItem("auth", "true");
      navigate("/");
    } else {
      alert("Invalid username");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Admin Login</h2>
      <input
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;