import { useEffect, useState, FC } from 'react';
import { sortBy } from 'lodash';
import { collection, doc, getDoc, onSnapshot, updateDoc } from '@firebase/firestore';
import { db } from './firebase';
import { ToDo } from './ToDo';
import { getModal } from './modals';
import { Todo, ModalInfo } from './types';

export const ToDoList: FC = () => {
  const [todoList, setToDoList] = useState([]);

  useEffect(() => {
    const colRef = collection(db, 'todos');
    onSnapshot(colRef, (querySnapshot) => {
      setToDoList(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  const handleToggle = async (id: string) => {
    const docRef = doc(db, '/todos', id);
    const docSnap = await getDoc(docRef);
    const isComplete = docSnap.data().complete;
    await updateDoc(docRef, { complete: !isComplete });
  };

  const [modalInfo, setModalInfo] = useState({ type: null, todo: null });
  const showModal = (type: string, todo: Todo) => setModalInfo({ type, todo });
  const hideModal = () => setModalInfo({ type: null, todo: null });
  const renderModal: FC<{ modalInfo: ModalInfo; hideModal: () => void }> = ({ modalInfo, hideModal }) => {
    if (!modalInfo.type) {
      return null;
    }
    const Component = getModal(modalInfo.type);
    return <Component modalInfo={modalInfo} onHide={hideModal} />;
  };

  const sortedList = sortBy(todoList, ['complete', 'name']);

  return (
    <ul className="todo-list">
      {sortedList.map((todo) => (
        <ToDo
          key={todo.id}
          todo={todo}
          handleToggle={handleToggle}
          handleRemove={() => showModal('removing', todo)}
          handleEdit={() => showModal('edit', todo)}
        />
      ))}
      {renderModal({ modalInfo, hideModal })}
    </ul>
  );
};
