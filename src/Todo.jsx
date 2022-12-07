import React from 'react';
import dayjs from 'dayjs';
import cn from 'classnames';
import './App.css';

function ToDo({ todo, handleToggle, handleRemove }) {
  const {
    task, description, deadline, complete, id,
  } = todo;
  const expiresString = dayjs(deadline).format('DD/MM/YYYY');
  const expired = dayjs(deadline).diff(dayjs());
  const classes = {
    'todo-list-item': true,
    complete,
    expired: expired < 0,
  };

  const handleClick = (e) => {
    e.preventDefault();
    handleToggle(e.currentTarget.id);
  };

  return (
    <li
      id={id}
      className={cn(classes)}
      value={id}
    >
      <div className="fields-wrapper-left">
        <div className="todo-item-field">{expiresString}</div>
        <div className="button-wrapper">
          <button type="button" className="task-control" id={id} onClick={handleClick}>V</button>
          <button type="button" className="task-control" id={id}>...</button>
          <button type="button" className="task-control" id={id} onClick={handleRemove}>X</button>
        </div>
      </div>
      <div className="fields-wrapper-right">
        <div className="todo-item-field">{task}</div>
        <div className={cn('todo-item-field', 'description')}>{description}</div>
      </div>
    </li>
  );
}

export default ToDo;
