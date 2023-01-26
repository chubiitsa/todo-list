import { FC } from 'react';
import * as dayjs from 'dayjs';
import { db } from './firebase';
import { doc, getDoc, updateDoc } from '@firebase/firestore';
import { Button, ButtonGroup, ListGroup, Badge } from 'react-bootstrap';
import { Todo } from './types';
import { Edit } from './modals/Edit';
import { Remove } from './modals/Remove';

export const ToDo: FC<{ todo: Todo }> = (props) => {
  const { todo } = props;
  const { name, description, deadline, complete, id, fileUrl, fileStatus } = todo;
  const expiresString = dayjs(deadline).format('DD/MM/YYYY');
  const expired = dayjs(deadline).diff(dayjs());
  const isTodoExpired = expired < 0 ? 'danger' : 'secondary';

  const handleToggle = async (e: { preventDefault: () => void; currentTarget: { id: string } }) => {
    e.preventDefault();
    const docRef = doc(db, '/todos', id);
    const docSnap = await getDoc(docRef);
    const isComplete = docSnap.data().complete;
    await updateDoc(docRef, { complete: !isComplete });
  };

  return (
    <ListGroup.Item
      id={id}
      className="d-flex justify-content-between align-items-start"
      variant={complete ? 'success' : null}
    >
      <div className="me-2 d-flex flex-column justify-content-around">
        <Badge className="mb-2" bg={isTodoExpired}>
          {expiresString}
        </Badge>
        {fileStatus ? (
          <Badge bg="info">
            <a href={fileUrl} className="todo-item-field" target="_blank" rel="noreferrer">
              file
            </a>
          </Badge>
        ) : null}
      </div>
      <div className="ms-2 pe-3 me-auto">
        <div className="fw-bold">{name}</div>
        <div>{description}</div>
      </div>
      <ButtonGroup className="align-items-center">
        <Button variant="success" id={id} onClick={handleToggle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-check-square"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z" />
          </svg>
        </Button>
        <Edit todo={todo} />
        <Remove todo={todo} />
      </ButtonGroup>
    </ListGroup.Item>
  );
};
