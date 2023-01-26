import { FC, useRef, useState } from 'react';
import { Todo } from '../types';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { doc, updateDoc } from '@firebase/firestore';
import { db } from '../firebase';
import { uploadFile } from '../utils/uploadFile';

export const Edit: FC<{ todo: Todo }> = ({ todo }) => {
  const [userData, setUserData] = useState(todo);
  const fileInputEl = useRef(null);

  const updateTask = async (userInput: Todo) => {
    const toDoRef = doc(db, 'todos', userInput.id);
    const file = fileInputEl.current.files[0];

    if (file) {
      await uploadFile(file).then(async (downloadUrl: string) => {
        await updateDoc(toDoRef, { ...userInput, fileUrl: downloadUrl, fileStatus: true });
        setUserData({ ...userData, fileStatus: true });
      });
    } else {
      await updateDoc(toDoRef, userInput);
    }
  };

  const handleChange = (e: { currentTarget: { name: string; value: string } }) => {
    const fieldName = e.currentTarget.name;
    setUserData({ ...userData, [fieldName]: e.currentTarget.value });
  };

  const handleDeleteFile = () => {
    setUserData({ ...userData, fileStatus: false });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    updateTask(userData).then(() => console.log('task is changed'));
    handleModalClose();
  };

  const renderFile = (state: boolean) => {
    return state ? (
      <>
        <a href={userData.fileUrl} target="_blank" rel="noreferrer">
          View file
        </a>
        <Button variant="light" onClick={handleDeleteFile}>
          Delete file
        </Button>
      </>
    ) : null;
  };

  const [show, setShow] = useState(false);

  const handleCancel = () => {
    setUserData(todo);
    setShow(false);
  };
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  return (
    <>
      <Button variant="warning" onClick={handleModalShow}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-pencil"
          viewBox="0 0 16 16"
        >
          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
        </svg>
      </Button>

      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editing task: {todo.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} className="mb-3">
            <Form.Group className="mb-2">
              <Form.Label htmlFor="name">Task name</Form.Label>
              <Form.Control
                required
                type="text"
                id="name"
                name="name"
                maxLength={40}
                value={userData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label htmlFor="description">Task description</Form.Label>
              <Form.Control
                as="textarea"
                id="description"
                name="description"
                value={userData.description}
                onChange={handleChange}
                placeholder="Add more details to the task"
                required
              />
            </Form.Group>
            {renderFile(userData.fileStatus)}
            <Form.Group className="mb-2">
              <Form.Label htmlFor="fileUrl">Add some files</Form.Label>
              <Form.Control ref={fileInputEl} type="file" id="file" name="fileUrl" onChange={handleChange} />
            </Form.Group>
            <Row className="mb-2">
              <Col>
                <Form.Group className="d-flex justify-content-between">
                  <Form.Label htmlFor="deadline">Deadline</Form.Label>
                  <Form.Control
                    type="date"
                    id="start"
                    name="deadline"
                    min="2022-12-31"
                    max="2050-12-31"
                    value={userData.deadline}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md="auto">
                <Button type="submit" variant="primary">
                  Save changes
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
