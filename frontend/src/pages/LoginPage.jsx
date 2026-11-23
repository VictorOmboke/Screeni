import { useState } from "react";
import api from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";

export default function Login() {
  // Initialize states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Router hook to navigate users programmatically
  const navigate = useNavigate();

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset errors

    // Call login route from backend api
    try {
      const response = await api.post("/auth/login", { email, password });

      // Store response
      const data = await response.data;

      // Set JWT token to browser storage
      localStorage.setItem("token", data.accessToken);

      // Redirect user to their watchlist
      navigate("/watchlist");
    } catch (err) {
      setError(
        err.response?.request?.status === 401
          ? err.response.data.message
          : "Unable to reach server. Please try again. "
      );
    }
  };

  // Redirect new user to register page
  const handleNewUser = () => {
    // Redirect user
    navigate("/register");
  };

  return (
    <div className="login-container">
      <h1>SCREENi</h1>
      <h3>The App Created To Tackle Your Backlog</h3>

      <div className="login-form-container">
        <h3>Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Render error message if one exists */}
          {error && <p className="error-banner">{error}</p>}

          <button type="submit">Log In</button>
        </form>
      </div>

      <div className="register">
        <p>Don't have an account?</p>
        <button onClick={handleNewUser}>Sign Up</button>
      </div>

      <div className="info-container">
        <div className="info-icon">
          <Info color="#ffffff" size={35} />
        </div>

        <div className="how-to">
          <h5>How to Use</h5>
          <ul>
            <li>
              Search up any movie or show on the{" "}
              <span className="keyword">Search</span> page.
            </li>
            <li>
              Add them to your watchlist using the{" "}
              <span className="keyword">+</span> button.
            </li>
            <li>
              View movie and show details by clicking them on your{" "}
              <span className="keyword">Watchlist</span>.
            </li>
            <li>Delete movies and shows from your watchlist.</li>
            <li>
              Not sure what to watch? Check out the{" "}
              <span className="keyword">Rando</span> feature which will pick a
              movie or show from your watchlist for you.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
