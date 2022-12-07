import React from 'react';
import { deleteDoc, doc } from '@firebase/firestore';
import db from '../firebase.js';

function Remove(props) {
  const { onHide, modalInfo } = props;
  const { todo } = modalInfo;

  const handleRemove = async () => {
    onHide();
    await deleteDoc(doc(db, 'todos', todo.id));
  };

  return (
    <div className="modal">
      <div>
        Do you really want to delete the following task?
        <div>{todo.task}</div>
      </div>
      <button className="button" type="button" onClick={onHide}>Close</button>
      <button className="button" type="button" onClick={handleRemove}>Delete</button>
    </div>
  );
}

export default Remove;
