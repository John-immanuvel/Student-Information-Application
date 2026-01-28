function getRemark(mark) {
  if (mark < 20) return "Fail - Bad";
  if (mark > 20 && mark <= 34) return "Very Poor - Fail";
  if (mark >= 35 && mark <= 50) return "Pass - Below Average";
  if (mark >= 51 && mark <= 80) return "Good - Pass";
  if (mark >= 81 && mark <= 90) return "Excellent - Pass";
  if (mark >= 91 && mark <= 100) return "Outstanding - Pass";
  return "";
}

export default function MarksTable({ marks, setMarks }) {
  const handleChange = (index, field, value) => {
    const updated = [...marks];
    updated[index][field] = value;

    if (field === "mark") {
      updated[index].remark = getRemark(value);
    }

    setMarks(updated);
  };
  return (
    <div>
      <h3>Marks Details</h3>

      <table>
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
              <td>
                <input
                  placeholder="Subject"
                  onChange={(e) => handleChange(i, "subject", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="0-100"
                  onChange={(e) => handleChange(i, "mark", e.target.value)}
                />
              </td>
              <td>{m.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
