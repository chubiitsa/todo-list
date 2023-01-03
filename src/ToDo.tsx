import { FC } from 'react';
import * as dayjs from 'dayjs';
import * as cn from 'classnames';
import { AppProps } from './types';
import './App.css';

export const ToDo: FC<AppProps> = (props) => {
  const { todo, handleToggle, handleRemove, handleEdit } = props;
  const { name, description, deadline, complete, id, fileUrl } = todo;
  const expiresString = dayjs(deadline).format('DD/MM/YYYY');
  const expired = dayjs(deadline).diff(dayjs());
  const classes = {
    'todo-list-item': true,
    complete,
    expired: expired < 0,
  };

  const handleClick = (e: { preventDefault: () => void; currentTarget: { id: string } }) => {
    e.preventDefault();
    handleToggle(e.currentTarget.id);
  };

  return (
    <li id={id} className={cn(classes)} value={id}>
      <div className="fields-wrapper-left">
        <div className="todo-item-field">{expiresString}</div>
        <div className="button-wrapper">
          <button type="button" className="task-control" id={id} onClick={handleClick}>
            V
          </button>
          <button type="button" className="task-control" id={id} onClick={handleEdit}>
            ...
          </button>
          <button type="button" className="task-control" id={id} onClick={handleRemove}>
            X
          </button>
        </div>
      </div>
      <div className="fields-wrapper-right">
        <div className="todo-item-field">{name}</div>
        <div className={cn('todo-item-field', 'description')}>{description}</div>
        {fileUrl.length > 0 ? (
          <a href={fileUrl} className="todo-item-field" target="_blank" rel="noreferrer">
            file
          </a>
        ) : null}
      </div>
    </li>
  );
};
