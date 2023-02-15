import { FC, useState } from 'react';
import { deleteDoc, doc } from '@firebase/firestore';
import { db } from '../firebase';
import { Todo } from '../types';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import deleteSvg from '../assets/img/x-square.svg';

export const Remove: FC<{ todo: Todo }> = ({ todo }) => {
  const handleRemove = async () => {
    await deleteDoc(doc(db, 'todos', todo.id));
  };
  const [show, setShow] = useState(false);

  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  return (
    <>
      <Button variant="danger" onClick={handleModalShow}>
        <img src={deleteSvg} alt="delete" />
      </Button>

      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Deleting task: {todo.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRemove}>
            Delete & Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
