import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Tooltip } from "react-tooltip";
import Task from "../components/Task";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import Dropdown from "react-bootstrap/Dropdown";

const Project = () => {
  const location = useLocation();
  const data = location.state;
  const navigate = useNavigate();
  const param = useParams();
  const user = param.userId;
  console.log(data.projectMembers)
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTasks] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [taskDone, setTaskDone] = useState(0);

  const updateCounts = (status) => {
    if (status === "Done") {
      setTaskDone((prevCount) => prevCount + 1);
    } else if (status === "To do") {
      setTaskDone((prevCount) => prevCount - 1);
    }
  };

  const optVal = data.projectMembers.map((e, i) => {
    return {
      label: e,
      value: e,
    };
  });
  const fetchTask = async () => {
    const response = await fetch("http://localhost:5000/api/projecttask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: data._id,
      }),
    });
    let json_data = await response.json();
    // console.log(json_data);

    setTasks(json_data);
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const [taskData, setTaskData] = useState({
    taskName: "",
    taskAssigned: [],
    taskDueDate: "",
    taskStatus: "To do",
  });

  function handleSelect(data) {
    setSelectedOptions(data);
    var members = data.map((e) => {
      return e.value;
    });
    setTaskData({ ...taskData, taskAssigned: members });
  }
  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const Notification = (data) => {
    if (!data.success) {
      const err = data.error;
      toast.error(err, { position: "top-center" });
    } else {
      toast.success("New task added", { position: "top-center" });
      setTaskData({
        taskName: "",
        taskAssigned: [],
        taskDueDate: "",
        taskStatus: "To do",
      });
      setSelectedOptions([]);
      setIsOpen(false);
      fetchTask();
    }
  };

  const DeleteNoti = (data) => {
    if (!data.success) {
      const err = data.error;
      toast.error(err, { position: "top-center" });
    } else {
      toast.success("Project deleted", { position: "top-center" });
      navigate(`/user/${user}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("are you sure want to delete")) {
      const response = await fetch(`http://localhost:5000/api/${data._id}`, {
        method: "DELETE",
      });
      const json_data = await response.json();
      DeleteNoti(json_data);
    } else {
      console.log("false");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/addtask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskUnderProject: data._id, taskData: taskData }),
    });
    const json_data = await response.json();
    // console.log(json_data);
    Notification(json_data);
  };

  var done = taskDone;
  var todo = task.length !== 0 ? task[0].tasks.length : 1;
  var percentage = Math.floor((done / todo) * 100);

  return (
    <div className="project-card">
      <Navbar />
      <div className="project-card-header">
        <div className="project-header-left">
          <div className="logo">{`P${data.key}`}</div>
          <div className="project-name">{data.projectName}</div>
        </div>
        <div className="project-header-right">
          <Dropdown className="d-inline mx-2" variant='secondary' >
            <Dropdown.Toggle className="menu" id="dropdown-autoclose-true">
              Project members
            </Dropdown.Toggle>

            <Dropdown.Menu>
            {data.projectMembers.map( (e,i) => {
              return (
                <Dropdown.Item as='div' className="menu-item" key={i} >{e}</Dropdown.Item>
              )
            })}
            </Dropdown.Menu>
          </Dropdown>
         <MdDelete className="del-btn"  onClick={handleDelete} />
        </div>
      </div>
      <div className="project-card-body">
        <div className="project-body-left">
          {isOpen && (
            <Form onSubmit={handleSubmit} className="add-task-body">
              <textarea
                name="taskName"
                value={taskData.taskName}
                placeholder="Write a task"
                rows={2}
                required
                autoComplete="off"
                autoFocus
                onChange={handleChange}
              ></textarea>
              <Select
                required
                className="react-select"
                options={optVal}
                placeholder="Assign task"
                value={selectedOptions}
                onChange={handleSelect}
                isSearchable={true}
                isMulti
              />
              <div className="third-row">
                <input
                  required
                  value={taskData.taskDueDate}
                  onChange={handleChange}
                  type="date"
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="due date"
                  data-tooltip-place="top"
                  name="taskDueDate"
                  className="due-date"
                />

                <Button type="submit">add</Button>
              </div>
              <Tooltip id="my-tooltip" />
            </Form>
          )}
          <div className="add-task-btn" onClick={() => setIsOpen(!isOpen)}>
            + Add task
          </div>
          <hr />
          <div className=" mb-2 text-dark fw-bold">Task progress</div>
          <ProgressBar variant={`${percentage <= 30 ? `danger` : `${percentage <= 60 ? `warning` : `success` }` }`} animated now={percentage} label={`${percentage}%`} />
        </div>
        <div className="project-body-right">
          {task.length !== 0 ? (
            task[0].tasks.map((e, i) => {
              return (
                <Task
                  key={i}
                  name={e.taskName}
                  date={e.taskDueDate}
                  assigned={e.taskAssigned}
                  updateCounts={updateCounts}
                />
              );
            })
          ) : (
            <div>No task added yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Project;
