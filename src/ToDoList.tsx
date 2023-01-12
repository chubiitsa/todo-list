import { useEffect, useState, FC } from 'react';
import { sortBy } from 'lodash';
import { collection, onSnapshot } from '@firebase/firestore';
import ListGroup from 'react-bootstrap/ListGroup';
import { db } from './firebase';
import { ToDo } from './ToDo';

export const ToDoList: FC = () => {
  const [todoList, setToDoList] = useState([]);

  useEffect(() => {
    const colRef = collection(db, 'todos');
    onSnapshot(colRef, (querySnapshot) => {
      setToDoList(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  const sortedList = sortBy(todoList, ['deadline', 'complete']);

  return (
    <ListGroup className="pb-3">
      {sortedList.map((todo) => (
        <ToDo key={todo.id} todo={todo} />
      ))}
    </ListGroup>
  );
};
