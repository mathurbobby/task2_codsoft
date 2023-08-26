import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";

const Home = () => {
  const params = useParams();

  const userId = params.userId;
  const email = localStorage.getItem('userEmail')

  const [show, setShow] = useState(false);
  const name = localStorage.getItem("userName");
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([{ label:email, value: email }]);
  const [projects, setProjects] = useState([]);

  const [projectData, setProjectData] = useState({
    projectName: "",
    projectMembers: [email],
  });

  const fetchProject = async () => {
    const response = await fetch("http://localhost:5000/api/userprojects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
      }),
    });
    let json_data = await response.json();
    // console.log(json_data);
    setProjects(json_data);
  };
  

  useEffect(() => {
    fetchProject();
    const fetchUser = async () => {
      const response = await fetch("http://localhost:5000/api/userid", {
        method: "GET",
      });
      let json_data = await response.json();
      // console.log(json_data);
      setOptions(json_data);
    };
    fetchUser();
  }, []);

  const optVal = options.map((e, i) => {
    return {
      label: e.email,
      value: e.email,
    };
  });

  function handleSelect(data) {
    setSelectedOptions(data);
    var members = data.map((e) => {
      return e.value;
    });
    setProjectData({ ...projectData, projectMembers: [...projectData.projectMembers, ...members ]});
  }

  const handleChange = (e) => {
    // console.log(e.target.value);
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const Notification = (data) => {
    if (!data.success) {
      const err = data.error;
      toast.error(err, { position: "top-center" });
    } else {
      toast.success("New project added", { position: "top-center" });
      handleClose();
      setProjectData({
        projectName: "",
        projectMembers: [],
      });
      setSelectedOptions([{ label:email, value: email }]);
      fetchProject();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/createproject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectName: projectData.projectName,
        projectMembers: projectData.projectMembers,
        projectLeader: userId,
      }),
    });
    const json_data = await response.json();
    Notification(json_data);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  var day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date();
  const curDate = date.getDate();
  const curDay = day[date.getDay()];
  const curMonth = months[date.getMonth()];

  return (
    <>
      
      <div className="home">
        <Navbar />
        <div className="home-body">
          <p className="fs-3">
            {curDay}, {curMonth} {curDate}
          </p>
          <p className="fs-1 mt-n1">Welcome, {name}</p>
          <div className="home-body-container">
            <div className="container-heading fs-5 fw-bold">Projects</div>
            <div className="container-body mt-3">
              <div className="grid-item create-project" onClick={handleShow}>
                <div className="project p-2">
                  <div className="create-project-logo">+</div>
                  <div className="create-project-title ">Create project</div>
                </div>
              </div>
              {projects.map((project, i) => {
                return (
                  <div key={i} className="grid-item">
                    <Link to={`/${userId}/p${i+1}`} state={{...project, key:i+1}} >
                      <div className="project p-2">
                        <div className="project-logo bg-info fs-5 ">{`P${i+1}`}</div>
                        <div className="project-title ">
                          {project.projectName}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* create project modal */}

      <Modal centered show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>New project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Project name</Form.Label>
              <Form.Control
              maxLength={35}
                type="text"
                name="projectName"
                // value={projectData.projectName}
                autoComplete="off"
                onChange={handleChange}
                required
                placeholder="Enter project name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Project members</Form.Label>
              <Select
                options={optVal}
                placeholder="Add project members"
                value={selectedOptions}
                onChange={handleSelect}
                isSearchable={true}
                isMulti
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="primary" type="submit">
                Create
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Home;
