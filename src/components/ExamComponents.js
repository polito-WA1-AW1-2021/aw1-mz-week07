import {Col, Table, Form, Button} from 'react-bootstrap';
import { iconDelete, iconEdit } from '../icons';
import { useState } from 'react';
import dayjs from 'dayjs';

function ExamScores(props) {
  return (
    <Col>
      <ExamTable exams={props.exams} courses={props.courses}/>
    </Col>
  );
}

function ExamTable(props) {
  const [exams, setExams] = useState([...props.exams]);
  const [showForm, setShowForm] = useState(false);

  const deleteExam = (code) => {
    setExams((exams) => exams.filter(ex => ex.code !== code));
  };

  const addExam = (exam) => {
    setExams(exams => [...exams, exam]);
  }

  return (
    <>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Exam</th>
            <th>Score</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {
          exams.map((ex) => <ExamRow key={ex.code}
            exam={ex}
            examName={props.courses.filter(c => c.code === ex.code)[0].name}
            deleteExam={deleteExam}
          />)
          }
        </tbody>
      </Table>
      {showForm ? <ExamForm courses={props.courses} addExam={exam => { addExam(exam); setShowForm(false); }} cancel={() => setShowForm(false)}></ExamForm> : <Button variant='success' onClick = {() => setShowForm(true)}>Add</Button>}
    </>
  );
}

function ExamRow(props) {
  return <tr><ExamRowData exam={props.exam} examName={props.examName}/><RowControl examCode={props.exam.code} deleteExam={props.deleteExam}/></tr>;
}

function ExamRowData(props) {
  return (<>
      <td>{props.examName}</td>
      <td>{props.exam.score}</td>
      <td>{props.exam.date.format('DD/MM/YYYY')}</td>
    </>
  );
}

function RowControl(props) {
  return <td>{iconEdit} <span onClick={() => props.deleteExam(props.examCode)}>{iconDelete}</span></td>;
}

function ExamForm(props) {
  const [course, setCourse] = useState('');
  const [score, setScore] = useState(30);
  const [date, setDate] = useState(dayjs());

  const handleSubmit = (event) => {
    event.preventDefault();
    const newExam = {code: course, score: score, date: date};
    // TODO: Aggiungere validazione!!!
    props.addExam(newExam);
  }

  return(
    <Form>
      <Form.Group controlId='selectedCourse'>
        <Form.Label>Course</Form.Label>
        <Form.Control as='select' defaultValue='' value={course} onChange={event => setCourse(event.target.value)}>
          <option value='' hidden disabled>Choose one...</option>
          { props.courses.map(course => 
          <option key={course.code} value={course.code}>
            {course.name}
          </option>) }
          {/* TODO: non inserire i corsi già superati */}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId='selectedScore'>
        <Form.Label>Score</Form.Label>
        <Form.Control type="number" min={18} max={31} value={score} onChange={event => setScore(event.target.value)}></Form.Control>
      </Form.Group>

      <Form.Group controlId='selectedDate'>
        <Form.Label>Date</Form.Label>
        <Form.Control type="date" value={date.format('YYYY-MM-DD')} onChange={event => setDate(dayjs(event.target.value))} />
      </Form.Group>

      <Button type='submit' onClick={handleSubmit}>Save</Button> <Button variant='secondary' onClick={props.cancel}>Cancel</Button>
      
    </Form>
  )
}

export {ExamScores};