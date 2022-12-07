import React, { useEffect, useState } from 'react';
import { sortBy } from 'lodash';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from '@firebase/firestore';
import db from './firebase.js';
import ToDo from './Todo.jsx';
import getModal from './modals/index.js';

function ToDoList() {
  const [TodoList, setToDoList] = useState([]);

  useEffect(() => {
    const colRef = collection(db, 'todos');
    onSnapshot(colRef, (querySnapshot) => {
      setToDoList(
        querySnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id })),
      );
    });
  }, []);

  const handleToggle = async (id) => {
    const docRef = doc(db, '/todos', id);
    const docSnap = await getDoc(docRef);
    const isComplete = docSnap.data().complete;
    await updateDoc(docRef, { complete: !isComplete });
  };

  const [modalInfo, setModalInfo] = useState({ type: null, todo: null });
  const showModal = (type, todo = null) => setModalInfo({ type, todo });
  const hideModal = () => setModalInfo({ type: null, todo: null });
  const renderModal = ({ modalInfo, hideModal }) => {
    if (!modalInfo.type) {
      return null;
    }
    const Component = getModal(modalInfo.type);
    return <Component modalInfo={modalInfo} onHide={hideModal} />;
  };

  const sortedList = sortBy(TodoList, ['complete', 'task']);

  return (
    <ul className="todo-list">
      {sortedList.map((todo) => (
        <ToDo
          key={todo.id}
          todo={todo}
          handleToggle={handleToggle}
          handleRemove={() => showModal('removing', todo)}
        />
      ))}
      {renderModal({ modalInfo, hideModal })}
    </ul>
  );
}

export default ToDoList;
