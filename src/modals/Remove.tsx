import { FC, useState } from 'react';
import { deleteDoc, doc } from '@firebase/firestore';
import { db } from '../firebase';
import { Todo } from '../types';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const Remove: FC<{ todo: Todo }> = ({ todo }) => {
  const handleRemove = async () => {
    await deleteDoc(doc(db, 'todos', todo.id));
  };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        X
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Deleting task: {todo.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRemove}>
            Delete todo
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
