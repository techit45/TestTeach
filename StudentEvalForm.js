import React, { useState, useEffect } from 'react';

const API_URL = 'https://script.google.com/macros/s/AKfycbxI1-QQAoSNJa-o_sM3v8ak6x4KxTRybpMjDcX0vrWH6fiUrU-LiuM9KoNm3J8bIMSC/exec'; // Google Apps Script Web App URL

const centers = ['ลาดกระบัง', 'บางพลัด', 'ระยอง', 'ศรีราชา'];
const weeks = [1,2,3,4,5,6,7,8];

const StudentEvalForm = () => {
  const [center, setCenter] = useState(centers[0]);
  const [week, setWeek] = useState(1);
  const [instructor, setInstructor] = useState('');
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [instructorsMap, setInstructorsMap] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // ดึงข้อมูลชื่อผู้สอนจาก Google Sheet
    fetch(API_URL + '?action=getInstructors')
      .then(res => res.json())
      .then(data => setInstructorsMap(data));
  }, []);

  useEffect(() => {
    if (instructorsMap[center]) {
      setInstructor(instructorsMap[center][`week${week}`] || '');
    }
  }, [center, week, instructorsMap]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'submitEvaluation',
        center,
        week,
        instructor,
        score,
        comment
      })
    }).then(() => setSubmitted(true));
  };

  return submitted ? (
    <div>ขอบคุณสำหรับการประเมิน!</div>
  ) : (
    <form onSubmit={handleSubmit}>
      <label>ศูนย์:
        <select value={center} onChange={e => setCenter(e.target.value)}>
          {centers.map(c => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label>สัปดาห์:
        <select value={week} onChange={e => setWeek(Number(e.target.value))}>
          {weeks.map(w => <option key={w}>{w}</option>)}
        </select>
      </label>
      <div>ผู้สอน: <b>{instructor}</b></div>
      <label>คะแนน (1-5): <input type="number" min="1" max="5" value={score} onChange={e => setScore(e.target.value)} /></label>
      <label>ความคิดเห็น: <input type="text" value={comment} onChange={e => setComment(e.target.value)} /></label>
      <button type="submit">ส่งแบบประเมิน</button>
    </form>
  );
};

export default StudentEvalForm;
