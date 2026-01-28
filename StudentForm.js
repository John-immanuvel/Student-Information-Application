"use client";
import { useState } from "react";
import tnLocations from "../data/tnLocations";
import { useRouter } from "next/navigation";

const subjects = [
  "Tamil",
  "English",
  "Mathematics",
  "Science",
  "Social Science",
];
const clearAllStudentData = () => {
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    // Mobile number (10 digits) OR Ack No (ABC1232024)
    if (/^\d{10}$/.test(key) || /^[A-Z]{3}\d{3}\d{4}$/.test(key)) {
      localStorage.removeItem(key);
    }
  });

  // Reset last Ack number
  localStorage.setItem("lastAckNum", "3000");

  alert("All student data cleared!");
};

export default function StudentForm() {
  const router = useRouter();

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
    subjects.map((s) => ({ subject: s, mark: "", remark: "" })),
  );

  const [errors, setErrors] = useState({});

  /* ---------- REMARK ---------- */
  const getRemark = (m) => {
    const mark = Number(m);

    if (mark < 20) return "Fail Of Very Bad";
    if (mark >= 20 && mark <= 34) return "Very Poor Of Fail";
    if (mark >= 35 && mark <= 50) return "Pass of Below Average";
    if (mark >= 51 && mark <= 80) return "Good(pass)";
    if (mark >= 81 && mark <= 90) return "Excellent";
    if (mark >= 91 && mark <= 100) return "Outstand(pass)";

    return ""; // default for invalid marks
  };

  const total = marks.reduce((sum, m) => sum + Number(m.mark || 0), 0);
  const avg = (total / subjects.length).toFixed(2);

  /* ---------- VALIDATION ---------- */
  const validate = () => {
    const newErrors = {};
    const addressRegex = /^[a-zA-Z0-9 ,]+$/;

    if (!student.name) newErrors.name = "Name is required";

    if (!student.mobile) newErrors.mobile = "Mobile number is required";
    else if (student.mobile.length !== 10)
      newErrors.mobile = "Mobile number must be 10 digits";

    if (!student.email) newErrors.email = "Email is required";
    else if (!student.email.includes("@"))
      newErrors.email = "Enter valid email address";

    if (!student.address1) newErrors.address1 = "Address Line 1 is required";
    else if (!addressRegex.test(student.address1))
      newErrors.address1 = "Only alphabets and numbers allowed";

    if (student.address2 && !addressRegex.test(student.address2))
      newErrors.address2 = "Only alphabets and numbers allowed";

    if (!student.district) newErrors.district = "District is required";

    if (!student.taluk) newErrors.taluk = "Taluk is required";

    if (!student.village) newErrors.village = "Village is required";

    if (!student.pincode) newErrors.pincode = "Pincode is required";
    else if (student.pincode.length !== 6)
      newErrors.pincode = "Pincode must be 6 digits";

    marks.forEach((m, i) => {
      if (m.mark === "") newErrors[`mark${i}`] = "Mark is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = () => {
    if (!validate()) return;

    // Get last used number from localStorage (default 3000)
    let lastNum = Number(localStorage.getItem("lastAckNum") || "3000");

    // Increment for new submission
    lastNum += 1;

    // Generate Acknowledgement Number
    const ack =
      student.name.substring(0, 3) + // first 3 letters
      student.mobile[4] + // 5th digit (index 4)
      student.mobile[8] + // 9th digit (index 8)
      lastNum; // incremented number

    const data = { student, marks, total, avg, ack };

    // Save data
    localStorage.setItem(ack, JSON.stringify(data));
    localStorage.setItem(student.mobile, JSON.stringify(data));

    // Update last number
    localStorage.setItem("lastAckNum", lastNum.toString());

    alert("Submitted Successfully\nAck No: " + ack);
  };

  return (
    <>
      <div className="header">Student Information System</div>

      <div className="container">
        <div className="form-grid">
          {/* NAME */}
          <div>
            <input
              placeholder="Name"
              value={student.name}
              onChange={(e) =>
                setStudent({
                  ...student,
                  name: e.target.value.replace(/[^a-zA-Z ]/g, ""),
                })
              }
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          {/* MOBILE */}
          <div>
            <input
              placeholder="Mobile"
              maxLength={10}
              value={student.mobile}
              onChange={(e) =>
                setStudent({
                  ...student,
                  mobile: e.target.value.replace(/\D/g, ""),
                })
              }
            />
            {errors.mobile && <span className="error">{errors.mobile}</span>}
          </div>

          {/* EMAIL */}
          <div className="full">
            <input
              placeholder="Email"
              value={student.email}
              onChange={(e) =>
                setStudent({ ...student, email: e.target.value })
              }
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          {/* ADDRESS LINE 1 */}
          <div className="full">
            <input
              placeholder="Address Line 1"
              value={student.address1}
              onChange={(e) =>
                setStudent({ ...student, address1: e.target.value })
              }
            />
            {errors.address1 && (
              <span className="error">{errors.address1}</span>
            )}
          </div>

          {/* ADDRESS LINE 2 */}
          <div className="full">
            <input
              placeholder="Address Line 2 (Optional)"
              value={student.address2}
              onChange={(e) =>
                setStudent({ ...student, address2: e.target.value })
              }
            />
            {errors.address2 && (
              <span className="error">{errors.address2}</span>
            )}
          </div>

          {/* DISTRICT */}
          <div>
            <select
              value={student.district}
              onChange={(e) =>
                setStudent({
                  ...student,
                  district: e.target.value,
                  taluk: "",
                  village: "",
                })
              }
            >
              <option value="">Select District</option>
              {Object.keys(tnLocations).map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            {errors.district && (
              <span className="error">{errors.district}</span>
            )}
          </div>

          {/* TALUK */}
          <div>
            <select
              value={student.taluk}
              onChange={(e) =>
                setStudent({ ...student, taluk: e.target.value })
              }
            >
              <option value="">Select Taluk</option>
              {student.district &&
                tnLocations[student.district].taluks.map((t) => (
                  <option key={t}>{t}</option>
                ))}
            </select>
            {errors.taluk && <span className="error">{errors.taluk}</span>}
          </div>

          {/* VILLAGE */}
          <div>
            <select
              value={student.village}
              onChange={(e) =>
                setStudent({ ...student, village: e.target.value })
              }
            >
              <option value="">Select Village</option>
              {student.district &&
                tnLocations[student.district].villages.map((v) => (
                  <option key={v}>{v}</option>
                ))}
            </select>
            {errors.village && <span className="error">{errors.village}</span>}
          </div>

          {/* PINCODE */}
          <div>
            <input
              placeholder="Pincode"
              maxLength={6}
              value={student.pincode}
              onChange={(e) =>
                setStudent({
                  ...student,
                  pincode: e.target.value.replace(/\D/g, ""),
                })
              }
            />
            {errors.pincode && <span className="error">{errors.pincode}</span>}
          </div>
        </div>

        {/* MARKS TABLE */}
        <table className="marks-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Mark</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((m, i) => (
              <tr key={i}>
                <td>{m.subject}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={m.mark}
                    onChange={(e) => {
                      const copy = [...marks];
                      copy[i].mark = e.target.value;
                      copy[i].remark = getRemark(e.target.value);
                      setMarks(copy);
                    }}
                  />
                  {errors[`mark${i}`] && (
                    <span className="error">{errors[`mark${i}`]}</span>
                  )}
                </td>
                <td>{m.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          <b>Total:</b> {total} / 500
        </p>
        <p>
          <b>Average:</b> {avg}
        </p>

        <button onClick={handleSubmit}>Submit</button>

        <button
          style={{ marginLeft: "10px" }}
          onClick={() => router.push("/search")}
        >
          View Details
        </button>
        <button
          onClick={clearAllStudentData}
          style={{ marginLeft: "10px", backgroundColor: "#d32f2f" }}
        >
          Clear All Data
        </button>
      </div>
    </>
  );
}
