"use client";
import { useState } from "react";

export default function Home() {
  const [student, setStudent] = useState({
    name: "",
    mobile: "",
    email: "",
    address1: "",
    address2: "",
    district: "",
    taluk: "",
    village: "",
    pincode: "",
  });

  const [marks, setMarks] = useState(
    Array.from({ length: 5 }, () => ({ subject: "", mark: "", remark: "" })),
  );

  const total = marks.reduce((sum, m) => sum + Number(m.mark || 0), 0);
  const avg = total / 100;

  const getRemark = (mark) => {
    if (mark < 20) return "Fail - Bad";
    if (mark >= 20 && mark <= 34) return "Fail - Very Poor";
    if (mark >= 35 && mark <= 50) return "Pass - Below Average";
    if (mark >= 51 && mark <= 80) return "Pass - Good";
    if (mark >= 81 && mark <= 90) return "Pass - Excellent";
    if (mark >= 91 && mark <= 100) return "Pass - Outstanding";
    return "";
  };

  const handleMarkChange = (i, field, value) => {
    const copy = [...marks];
    copy[i][field] = value;
    if (field === "mark") copy[i].remark = getRemark(Number(value));
    setMarks(copy);
  };

  const handleSubmit = () => {
    const ackNo =
      student.name.substring(0, 3).toUpperCase() +
      student.mobile.substring(4, 9) +
      "30001";

    const data = { student, marks, total, avg, ackNo };
    localStorage.setItem(ackNo, JSON.stringify(data));
    localStorage.setItem(student.mobile, JSON.stringify(data));

    alert(`Acknowledgement Created\nAck No: ${ackNo}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Student Entry Form</h2>

      {Object.keys(student).map((key) => (
        <input
          key={key}
          placeholder={key}
          value={student[key]}
          onChange={(e) => setStudent({ ...student, [key]: e.target.value })}
        />
      ))}

      <h3>Marks</h3>
      {marks.map((m, i) => (
        <div key={i}>
          <input
            placeholder="Subject"
            onChange={(e) => handleMarkChange(i, "subject", e.target.value)}
          />
          <input
            type="number"
            placeholder="Mark"
            onChange={(e) => handleMarkChange(i, "mark", e.target.value)}
          />
          <input placeholder="Remark" value={m.remark} readOnly />
        </div>
      ))}

      <p>Total: {total} / 500</p>
      <p>Average: {avg}</p>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
