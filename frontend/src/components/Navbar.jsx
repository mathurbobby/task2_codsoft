import React from "react";
import homelogo from "../assests/homelogo.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {

  const params = useParams();
  const navigate = useNavigate();

  const userId = params.userId;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    toast.error("Logged Out", { position: "top-center" });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  return (
    <>
      <div className="navbar">
        <div className="navbar-items">
          <div className="brand cursor">
            <Link to={`/user/${userId}`} ><img src={homelogo} alt="" srcset="" /></Link>
            <h4><Link to={`/user/${userId}`} >proplanr</Link></h4>
          </div>
          {/* <div className="search cursor">
            <input type="text" placeholder="search project" />
          </div> */}
          <div className="logout cursor" onClick={handleLogout} >logout</div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
