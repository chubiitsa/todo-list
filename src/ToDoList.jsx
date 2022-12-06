import React, { useEffect, useState } from 'react';
import { sortBy } from 'lodash';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
} from '@firebase/firestore';
import ToDo from './Todo.jsx';
import getModal from './modals/index.js';

async function fetchData(database) {
  const colRef = collection(database, 'todos');
  const docsSnap = await getDocs(colRef);
  return docsSnap.docs.map((task) => task.data());
}

function ToDoList({ database }) {
  const [TodoList, setToDoList] = useState([]);

  useEffect(() => {
    fetchData(database).then((d) => setToDoList(d));
  }, []);

  const q = query(collection(database, '/todos'));
  onSnapshot(q, (querySnapshot) => {
    const todos = [];
    querySnapshot.forEach((task) => {
      todos.push(task.data());
    });
    setToDoList(todos);
  });

  const handleToggle = async (id) => {
    const docRef = doc(database, '/todos', id);
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
    return <Component modalInfo={modalInfo} onHide={hideModal} db={database} />;
  };

  const sortedList = sortBy(TodoList, 'complete');

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
