import { FC, useState, useRef, useEffect, ChangeEventHandler, FormEventHandler } from 'react';
import { collection, addDoc } from '@firebase/firestore';
import * as dayjs from 'dayjs';
import { db } from './firebase';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Todo } from './types';
import { uploadFile } from './utils/uploadFile';

export const ToDoForm: FC = () => {
  const currentDate = dayjs().format('YYYY-MM-DD');
  const initialState = {
    id: '',
    name: '',
    description: '',
    deadline: currentDate,
    fileUrl: '',
    complete: false,
    fileStatus: false,
  };
  const [userData, setUserData] = useState(initialState);
  const [loadingStatus, setLoadingStatus] = useState('idle');

  const fileInputRef = useRef(null);
  const taskInputRef = useRef(null);
  useEffect(() => {
    taskInputRef.current.focus();
  }, []);

  const addTask = async (userInput: Todo) => {
    const file = fileInputRef.current.files[0];

    if (file) {
      await uploadFile(file).then(async (downloadUrl: string) => {
        await addDoc(collection(db, 'todos'), { ...userInput, fileUrl: downloadUrl, fileStatus: true });
      });
      setLoadingStatus('idle');
    } else {
      await addDoc(collection(db, 'todos'), userInput);
      setLoadingStatus('idle');
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit: FormEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    setLoadingStatus('loading');
    addTask(userData).then(() => console.log('task is added'));
    setUserData(initialState);
    taskInputRef.current.focus();
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <fieldset disabled={loadingStatus === 'loading'}>
        <Form.Group className="mb-2">
          <Form.Label htmlFor="name">Task name</Form.Label>
          <Form.Control
            required
            ref={taskInputRef}
            name="name"
            maxLength={40}
            size="sm"
            onChange={handleChange}
            value={userData.name}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label htmlFor="description">Task description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            onChange={handleChange}
            placeholder="Add more details to the task"
            value={userData.description}
          />
        </Form.Group>
        <Form.Group className="mb-2 d-flex justify-content-between">
          <Form.Label className="col-md-auto me-2" htmlFor="fileUrl">
            Add files
          </Form.Label>
          <Form.Control
            ref={fileInputRef}
            type="file"
            name="fileUrl"
            onChange={handleChange}
            value={userData.fileUrl}
          />
        </Form.Group>
        <Row className="mb-2">
          <Col>
            <Form.Group className="d-flex justify-content-between">
              <Form.Label className="me-2" htmlFor="deadline">
                Deadline
              </Form.Label>
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
            <Button type="submit">Add task</Button>
          </Col>
        </Row>
      </fieldset>
    </Form>
  );
};
