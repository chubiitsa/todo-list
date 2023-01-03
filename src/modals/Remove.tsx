import { FC } from 'react';
import { deleteDoc, doc } from '@firebase/firestore';
import { db } from '../firebase';
import { ModalInfo } from '../types';

export const Remove: FC<{ modalInfo: ModalInfo; onHide: () => void }> = ({ modalInfo, onHide }) => {
  const { todo } = modalInfo;

  const handleRemove = async () => {
    onHide();
    await deleteDoc(doc(db, 'todos', todo.id));
  };

  return (
    <div className="modal">
      <div>
        Do you really want to delete the following task?
        <div>{todo.name}</div>
      </div>
      <button className="button" type="button" onClick={onHide}>
        Close
      </button>
      <button className="button" type="button" onClick={handleRemove}>
        Delete
      </button>
    </div>
  );
};
