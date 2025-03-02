import { Card, CardBody, Input, Button, Typography } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log("Checking token:", localStorage.getItem("token"));
    if (localStorage.getItem("token")) {
      navigate("/dashboard/home");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}auth/login`, { username, password });
      localStorage.setItem("token", res.data.token);
      alert(res.data.message);

      navigate("/dashboard/home");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-96 p-6 rounded-lg shadow-lg bg-white border border-gray-300">
        <CardBody>
          <div className="text-center mb-6">
            <Typography variant="h4" className="font-bold text-gray-800">
              Admin Login
            </Typography>
            <Typography variant="paragraph" className="text-sm text-gray-600">
              Manage rentals, track inventory, and more.
            </Typography>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <Typography variant="small" className="font-medium text-gray-700">Username</Typography>
              <Input
                size="lg"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-400 rounded-md"
              />
            </div>

            <div>
              <Typography variant="small" className="font-medium text-gray-700">Password</Typography>
              <Input
                type="password"
                size="lg"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-400 rounded-md"
              />
            </div>

            <Button type="submit" size="lg" fullWidth className="mt-4 bg-yellow-600 text-white hover:bg-yellow-700">
              Sign In
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}

export default SignIn;