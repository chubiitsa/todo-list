import { ChangeEventHandler, FC, FormEventHandler, useRef, useState } from 'react';
import { Todo } from '../types';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { doc, updateDoc } from '@firebase/firestore';
import { db } from '../firebase';
import { uploadFile } from '../utils/uploadFile';
import editSvg from '../assets/img/pencil.svg';

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

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget;
    setUserData({ ...userData, [name]: value });
  };

  const handleDeleteFile = () => {
    setUserData({ ...userData, fileStatus: false });
  };

  const handleSubmit: FormEventHandler<HTMLElement> = (e) => {
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
        <img src={editSvg} alt="edit" />
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
              <Form.Control ref={fileInputEl} type="file" name="fileUrl" onChange={handleChange} />
            </Form.Group>
            <Row className="mb-2">
              <Col>
                <Form.Group className="d-flex justify-content-between">
                  <Form.Label htmlFor="deadline">Deadline</Form.Label>
                  <Form.Control
                    type="date"
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
