import { useState, useRef, useEffect, FC } from 'react';
import { collection, addDoc } from '@firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import * as dayjs from 'dayjs';
import { db, filesRef } from './firebase';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Todo } from './types';

export const ToDoForm: FC = () => {
  const currentDate = dayjs().format('YYYY-MM-DD');
  const initialState = {
      id: '',
      name: '',
      description: '',
      deadline: currentDate,
      fileUrl: '',
      complete: false,
  }
  const [userData, setUserData] = useState(initialState);

  const deadlineInputEl = useRef(null);
  const fileInputEl = useRef(null);
  const taskInputEl = useRef(null);
  const formEl = useRef(null);
  useEffect(() => {
    deadlineInputEl.current.value = currentDate;
    taskInputEl.current.focus();
  }, []);

  const addTask = async (userInput: Todo) => {
    const { name, description, deadline } = userInput;
    const file = fileInputEl.current.files[0];

    if (file) {
      const storageRef = ref(filesRef, `${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              break;
            case 'storage/canceled':
              break;
            case 'storage/unknown':
              break;
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await addDoc(collection(db, 'todos'), {
              name,
              description,
              deadline,
              complete: false,
              fileUrl: downloadURL,
            });
          });
        },
      );
    } else {
      await addDoc(collection(db, 'todos'), {
        name,
        description,
        deadline,
        complete: false,
        fileUrl: '',
      });
    }
  };

  const handleChange = (e: { currentTarget: { name: string; value: string } }) => {
    const fieldName = e.currentTarget.name;
    setUserData({ ...userData, [fieldName]: e.currentTarget.value });
  };

  const submitHandler = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    addTask(userData).then(() => console.log('task is added'));
    formEl.current.reset();
    deadlineInputEl.current.value = currentDate;
    setUserData(initialState);
    taskInputEl.current.focus();
  };

  return (
    <Form ref={formEl} onSubmit={submitHandler} className="mb-3">
      <Form.Group className="mb-2">
        <Form.Label htmlFor="name">Task name</Form.Label>
        <Form.Control
          required
          ref={taskInputEl}
          type="text"
          id="name"
          name="name"
          maxLength={40}
          size="sm"
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label htmlFor="description">Task description</Form.Label>
        <Form.Control
          as="textarea"
          id="description"
          name="description"
          onChange={handleChange}
          placeholder="Add more details to the task"
          required
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label htmlFor="fileUrl">Add some files</Form.Label>
        <Form.Control ref={fileInputEl} type="file" id="file" name="fileUrl" onChange={handleChange} />
      </Form.Group>
      <Row className="mb-2">
        <Col>
          <Form.Group className="d-flex justify-content-between">
            <Form.Label htmlFor="deadline">Deadline</Form.Label>
            <Form.Control
              ref={deadlineInputEl}
              type="date"
              id="start"
              name="deadline"
              min="2022-12-31"
              max="2050-12-31"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md="auto">
          <Button type="submit">Add task</Button>
        </Col>
      </Row>
    </Form>
  );
};
