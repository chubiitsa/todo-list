import React, { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  collection, doc, setDoc,
} from '@firebase/firestore';
import cn from 'classnames';

function ToDoForm({ database }) {
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
    const newTaskId = doc(collection(database, '/todos'));
    await setDoc(doc(database, '/todos', newTaskId.id), {
      task: name, description, deadline, id: newTaskId.id, complete: false,
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
          <input ref={taskInputDate} type="text" id="name" name="name" required maxLength="20" size="10" onChange={handleChange} />
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
          />
        </label>
      </div>
      <div className="input-wrapper-h">
        <div className="input-wrapper">
          <label className="label" htmlFor="deadline">
            <p className="field-name">Deadline </p>
            <input ref={deadlineInputEl} type="date" id="start" name="deadline" min="2021-12-31" max="2022-12-31" onChange={handleDeadlineChange} />
          </label>
        </div>
        <button type="submit" className={cn('button')}>Add task</button>
      </div>

    </form>
  );
}

export default ToDoForm;
