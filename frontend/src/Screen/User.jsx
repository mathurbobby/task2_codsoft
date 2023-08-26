import React, { useState } from "react";
import signin from "../assests/signin.svg";
import logo from "../assests/logo.png";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const User = () => {
  const navigate = useNavigate();

  const [isSignIn, setSignIn] = useState(false);

  const [signUpData, setsignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [signInData, setsignInData] = useState({
    email: "",
    password: "",
  });

  const handleSignUp = (e) => {
    setsignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSignIn = (e) => {
    setsignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const signUpNoti = (data) => {
    if (!data.success) {
      // console.log('inside failure')
      const err = data.error;
      toast.warning(err, { position: "top-center" });
    } else {
      toast.success("Successfully registered", { position: "top-center" });

      setsignUpData({
        name: "",
        email: "",
        password: "",
      });
      setSignIn(true);
    }
  };

  const signInNoti = (data) => {
    if (!data.success) {
      const err = data.error;
      toast.error(err, { position: "top-center" });
    } else {
      toast.success("Successfully logged in", { position: "top-center" });
      localStorage.setItem("authToken", data.authToken);
      localStorage.setItem("userEmail", signInData.email);
      localStorage.setItem("userName", data.userName);
      setsignInData({
        email: "",
        password: "",
      });
      // console.log(data.userId);
      navigate(`/user/${data.userId}`);
    }
  };

  const handleSignUpSubmit = async (e) => {
    // console.log('submitted')
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
      }),
    });
    const json_data = await response.json();
    // console.log(json_data)
    signUpNoti(json_data);
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/loginuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: signInData.email,
        password: signInData.password,
      }),
    });
    const json_data = await response.json();
    signInNoti(json_data);
  };

  return (
    <>
      <div className="mobile-view">
        Please open in desktop for a better experience
      </div>
      <div className="box">
        <div className="inner-box">
          {isSignIn ? (
            <div className="my-form">
              <div className="form-heading">
                <img src={logo} alt="logo" srcset="" />
                <h6>proplanr</h6>
              </div>
              <div className="form-body">
                <h2>Welcome Back</h2>
                <p>
                  Not registered yet ?{" "}
                  <span onClick={() => setSignIn(false)}>Sign up</span>
                </p>
              </div>
              <div className="form-actual">
                <Form onSubmit={handleSignInSubmit}>
                  <Form.Group className="mb-4" controlId="formBasicEmail">
                    {/* <Form.Label>Email address</Form.Label> */}
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={signInData.email}
                      onChange={handleSignIn}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={signInData.password}
                      onChange={handleSignIn}
                      required
                    />
                  </Form.Group>
                  <button className="form-button" type="submit">
                    Sign In
                  </button>
                </Form>
              </div>
            </div>
          ) : (
            <div className="my-form">
              <div className="form-heading">
                <img src={logo} alt="logo" srcset="" />
                <h6>proplanr</h6>
              </div>
              <div className="form-body">
                <h2>Get Started</h2>
                <p>
                  Already have an account ?{" "}
                  <span
                    onClick={() => {
                      setSignIn(true);
                    }}
                  >
                    Sign in
                  </span>
                </p>
              </div>
              <div className="form-actual">
                <Form onSubmit={handleSignUpSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Control
                      type="name"
                      name="name"
                      placeholder="Name"
                      value={signUpData.name}
                      onChange={handleSignUp}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="formBasicEmail">
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={signUpData.email}
                      onChange={handleSignUp}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={signUpData.password}
                      onChange={handleSignUp}
                      required
                    />
                  </Form.Group>
                  <button className="form-button" type="submit">
                    Sign Up
                  </button>
                </Form>
              </div>
            </div>
          )}

          <div className="poster">
            <div className="poster-top">
              <h1>
                The modern{" "}
                <span style={{ color: "#F06A6A" }}> project management </span>{" "}
                tool for your business
              </h1>
            </div>
            <div className="poster-bottom">
              <img src={signin} alt="fdf" srcset="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
