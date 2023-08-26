import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

const Task = ({ name, date, assigned, updateCounts }) => {
  const [status, setStatus] = useState("To do");
  const newdate = date.slice(5, date.length);

  const handleStatus = () => {
    setStatus((pre) => {
      if (pre === "To do") {
        return "Done";
      } else {
        return "To do";
      }
    });
    if (status === "To do") {
      updateCounts("Done");
    } else {
      updateCounts("To do");
    }
  };

  return (
    <>
      <div
        className={`task p-3 ${
          status === `To do` ? `border border-danger` : `border border-success`
        } ${status === `To do` ? `opacity-100` : `opacity-50`}`}
      >
        <div className="task-body">{name}</div>
        <div className="task-footer">
          <div
            className={`task-status ${
              status === `To do` ? `bg-danger` : `bg-success`
            }`}
          >
            {status}
          </div>
          <div className="task-date text-black">{newdate}</div>
          {/* <Dropdown as='div' className="d-inline mx-2" variant='secondary' >
            <Dropdown.Toggle as='div' className="menu" id="dropdown-autoclose-true">
              P
            </Dropdown.Toggle>

            <Dropdown.Menu>
            {assigned.map( (e,i) => {
              return (
                <Dropdown.Item as='div' className="menu-item" key={i} >{e}</Dropdown.Item>
              )
            })}
            </Dropdown.Menu>
          </Dropdown> */}
          <button
            onClick={handleStatus}
            className={`task-submit ${
              status === `To do` ?null :  `bg-success`
            }`}
          >
            <span>&#10004;</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Task;
