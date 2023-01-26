import {FC, useState, useRef, useEffect} from 'react';
import {collection, addDoc} from '@firebase/firestore';
import * as dayjs from 'dayjs';
import {db} from './firebase';
import {Form, Button, Row, Col} from 'react-bootstrap';
import {Todo} from './types';
import {uploadFile} from './utils/uploadFile';

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

    const fileInputEl = useRef(null);
    const taskInputEl = useRef(null);
    const formEl = useRef(null);
    useEffect(() => {
        taskInputEl.current.focus();
    }, []);

    const addTask = async (userInput: Todo) => {
        const file = fileInputEl.current.files[0];

        if (file) {
            await uploadFile(file).then(async (downloadUrl: string) => {
                await addDoc(collection(db, 'todos'), {...userInput, fileUrl: downloadUrl, fileStatus: true});
            });
            setLoadingStatus('idle');
        } else {
            await addDoc(collection(db, 'todos'), userInput);
            setLoadingStatus('idle');
        }
    };

    const handleChange = (e: { currentTarget: { name: string; value: string } }) => {
        const fieldName = e.currentTarget.name;
        setUserData({...userData, [fieldName]: e.currentTarget.value});
    };

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setLoadingStatus('loading');
        addTask(userData).then(() => console.log('task is added'));
        formEl.current.reset();
        setUserData(initialState);
        taskInputEl.current.focus();
    };

    return (
        <Form ref={formEl} onSubmit={handleSubmit} className="mb-3">
          <fieldset disabled={loadingStatus === 'loading'}>
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
            <Form.Group className="mb-2 d-flex justify-content-between">
              <Form.Label className="col-md-auto me-2" htmlFor="fileUrl">
                Add files
              </Form.Label>
              <Form.Control ref={fileInputEl} type="file" id="file" name="fileUrl" onChange={handleChange}/>
            </Form.Group>
            <Row className="mb-2">
              <Col>
                <Form.Group className="d-flex justify-content-between">
                  <Form.Label className="me-2" htmlFor="deadline">
                    Deadline
                  </Form.Label>
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
                <Button type="submit">Add task</Button>
              </Col>
            </Row>
          </fieldset>
        </Form>

    )


};
