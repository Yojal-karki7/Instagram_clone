import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/login",
        input,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data.success) {
        navigate('/')
        toast.success(response.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={handleLogin}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center">
            Ligin to see photos & videos from your friends
          </p>
        </div>
        <div className="">
          <Label className="font-medium">Email</Label>
          <Input
            type="email"
            className="focus-visible:ring-transparent my-1"
            name="email"
            value={input.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        <div className="">
          <Label className="font-medium">Password</Label>
          <Input
            type="password"
            className="focus-visible:ring-transparent my-1"
            name="password"
            value={input.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>
        {
          loading ? (
            <Button>
              <Loader  className="mr-2 h-4 w-4 animate-spin"/>
              Loggin in...
            </Button>
          ) : (
          <Button type="submit" className="my-4">
            Login
          </Button>
          )
        }
        
        <span className="text-center">Don't have an account? 
          <Link to='/signup' className="text-blue-600 hover:underline">
        Signup
        </Link></span>
      </form>
    </div>
  );
};

export default Login;
