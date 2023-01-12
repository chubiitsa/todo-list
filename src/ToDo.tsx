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
  const { name, description, deadline, complete, id, fileUrl } = todo;
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
        {fileUrl.length > 0 ? (
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
          V
        </Button>
        <Edit todo={todo} />
        <Remove todo={todo} />
      </ButtonGroup>
    </ListGroup.Item>
  );
};
