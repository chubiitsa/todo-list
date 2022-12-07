import React, { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  collection, addDoc,
} from '@firebase/firestore';
import db from './firebase.js';

function ToDoForm() {
  const curValue = dayjs().format('YYYY-MM-DD');
  const [userData, setUserData] = useState({ deadline: curValue });

  const deadlineInputEl = useRef(null);
  const taskInputDate = useRef(null);
  const formRef = useRef(null);
  useEffect(() => {
    deadlineInputEl.current.value = curValue;
    taskInputDate.current.focus();
  }, []);

  const addTask = async (userInput) => {
    const { name, description, deadline } = userInput;
    await addDoc(collection(db, 'todos'), {
      task: name, description, deadline, complete: false,
    });
  };

  const handleChange = (e) => {
    const fieldName = e.currentTarget.name;
    setUserData({ ...userData, [fieldName]: e.currentTarget.value });
  };

  const handleDeadlineChange = (e) => {
    setUserData({ ...userData, deadline: e.currentTarget.value });
    deadlineInputEl.current.value = e.currentTarget.value;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    addTask(userData);
    formRef.current.reset();
    deadlineInputEl.current.value = curValue;
    setUserData({ deadline: curValue });
    taskInputDate.current.focus();
  };

  return (
    <form ref={formRef} className="todo-form" onSubmit={submitHandler}>
      <div className="input-wrapper">
        <label htmlFor="name">
          Task name
          <input
            required
            ref={taskInputDate}
            type="text"
            id="name"
            name="name"
            maxLength="20"
            size="10"
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="input-wrapper">
        <label htmlFor="description">
          Task description
          <textarea
            id="description"
            name="description"
            rows="5"
            cols="33"
            onChange={handleChange}
            placeholder="Add more details to the task"
            required
          />
        </label>
      </div>
      <div className="input-wrapper-h">
        <div className="input-wrapper">
          <label className="label" htmlFor="deadline">
            <p className="field-name">Deadline </p>
            <input
              ref={deadlineInputEl}
              type="date"
              id="start"
              name="deadline"
              min="2021-12-31"
              max="2050-12-31"
              onChange={handleDeadlineChange}
            />
          </label>
        </div>
        <button type="submit" className="button">Add task</button>
      </div>

    </form>
  );
}

export default ToDoForm;
