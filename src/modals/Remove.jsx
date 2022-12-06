import React from 'react';
import { deleteDoc, doc } from '@firebase/firestore';

function Remove(props) {
  const { onHide, modalInfo, db } = props;
  const { todo } = modalInfo;

  const handleRemove = async () => {
    await deleteDoc(doc(db, 'todos', todo.id.toString()));
    onHide();
  };

  return (
    <div className="modal">
      <div>
        Do you really want to delete the following task?
        <div>{todo.task}</div>
      </div>
      <button type="button" onClick={onHide}>Close</button>
      <button type="button" onClick={handleRemove}>Delete</button>
    </div>
  );
}

export default Remove;
