import React, { useState, useEffect } from 'react';

const API_URL = 'https://script.google.com/macros/s/AKfycbxI1-QQAoSNJa-o_sM3v8ak6x4KxTRybpMjDcX0vrWH6fiUrU-LiuM9KoNm3J8bIMSC/exec'; // Google Apps Script Web App URL

const centers = ['ลาดกระบัง', 'บางพลัด', 'ระยอง', 'ศรีราชา'];
const weeks = [1,2,3,4,5,6,7,8];

const ManageInstructors = () => {
  const [instructorsMap, setInstructorsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL + '?action=getInstructors')
      .then(res => res.json())
      .then(data => {
        setInstructorsMap(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (center, week, value) => {
    setInstructorsMap(prev => ({
      ...prev,
      [center]: {
        ...prev[center],
        [`week${week}`]: value
      }
    }));
  };

  const handleSave = () => {
    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateInstructors',
        instructorsMap
      })
    }).then(() => alert('บันทึกสำเร็จ'));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>แก้ไขชื่อผู้สอน</h2>
      {centers.map(center => (
        <div key={center}>
          <h3>ศูนย์ {center}</h3>
          {weeks.map(week => (
            <div key={week}>
              สัปดาห์ {week}: <input 
                value={instructorsMap[center][`week${week}`] || ''}
                onChange={e => handleChange(center, week, e.target.value)}
              />
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSave}>บันทึก</button>
    </div>
  );
};

export default ManageInstructors;
