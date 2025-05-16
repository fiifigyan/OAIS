import { schoolInfo } from '../config';

export const generateGradebookHTML = (studentData, schoolInfo) => {
  const { studentId, selectedTerm, overallGrade, attendance, assignments, subjects } = studentData;
  const { SCHOOL_NAME, WATERMARK, SCHOOL_LOGO } = schoolInfo;

  const watermarkHTML = WATERMARK ? 
    `<div style="position: fixed; opacity: 0.1; font-size: 80px; color: #cccccc; 
      transform: rotate(-45deg); top: 40%; left: 10%; z-index: -1;">
      ${WATERMARK}
    </div>` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page { margin: 1cm; size: letter; }
        body { font-family: 'Nexa', Arial, sans-serif; margin: 0; padding: 0; }
        .header { text-align: center; margin-bottom: 20px; position: relative; }
        .school-logo { height: 70px; margin-bottom: 10px; }
        .title { font-size: 18pt; font-weight: bold; margin: 5px 0; }
        .subtitle { font-size: 12pt; color: #555; margin-bottom: 15px; }
        .student-info { margin: 15px 0; font-size: 11pt; }
        .section { margin-bottom: 20px; page-break-inside: avoid; }
        .section-title { 
          font-size: 14pt; 
          font-weight: bold; 
          border-bottom: 1px solid #03ac13; 
          padding-bottom: 3px;
          margin-bottom: 10px;
          color: #03ac13;
        }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th { background: #03ac13; color: aliceblue; text-align: left; padding: 8px; }
        td { padding: 8px; border-bottom: 1px solid #ddd; }
        .progress-bar { 
          height: 15px; 
          background: #e0e0e0; 
          border-radius: 3px;
          margin: 5px 0;
        }
        .progress-fill { 
          height: 100%; 
          background: #03ac13; 
          border-radius: 3px;
        }
        .footer { 
          font-size: 9pt; 
          text-align: center; 
          margin-top: 20px;
          color: #777;
        }
        ${watermarkHTML}
      </style>
    </head>
    <body>
      <div class="header">
        ${SCHOOL_LOGO ? `<img src="${SCHOOL_LOGO}" class="school-logo">` : ''}
        <div class="title">${SCHOOL_NAME}</div>
        <div class="subtitle">Gradebook Report</div>
        <div class="student-info">
          <strong>Student:</strong> ${studentId} | 
          <strong>Term:</strong> ${selectedTerm} | 
          <strong>Generated:</strong> ${new Date().toLocaleDateString()}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Performance Summary</div>
        <table>
          <tr>
            <td width="30%"><strong>Overall Grade</strong></td>
            <td width="70%">${overallGrade}</td>
          </tr>
          <tr>
            <td><strong>Attendance</strong></td>
            <td>${attendance}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Assignment Details</div>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Assignment</th>
              <th>Date</th>
              <th>Score</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            ${assignments.map(assignment => `
              <tr>
                <td>${assignment.subject}</td>
                <td>${assignment.name}</td>
                <td>${assignment.date}</td>
                <td>${assignment.score}</td>
                <td>${assignment.grade}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Subject Mastery</div>
        ${subjects.map(subject => `
          <div style="margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between;">
              <span>${subject.name}</span>
              <span>${subject.grade} (${subject.progress}%)</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${subject.progress}%"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="footer">
        <div>${SCHOOL_NAME} - Official Gradebook Report</div>
        <div>Page 1 of 1 | Generated on ${new Date().toLocaleString()}</div>
      </div>
    </body>
    </html>
  `;
};

export const generateReportHTML = (studentData, schoolInfo) => {
  const { studentId, term, overallGrade, attendance, subjects, comments } = studentData;
  const { SCHOOL_LOGO, SCHOOL_NAME, WATERMARK } = schoolInfo;

  const watermarkHTML = WATERMARK ? 
    `<div style="position: fixed; opacity: 0.1; font-size: 80px; color: #cccccc; 
      transform: rotate(-45deg); top: 40%; left: 10%; z-index: -1;">
      ${WATERMARK}
    </div>` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page { margin: 1cm; size: letter; }
        body { font-family: 'Helvetica', Arial, sans-serif; margin: 0; padding: 0; }
        .header { text-align: center; margin-bottom: 20px; position: relative; }
        .school-logo { height: 70px; margin-bottom: 10px; }
        .title { font-size: 18pt; font-weight: bold; margin: 5px 0; }
        .subtitle { font-size: 12pt; color: #555; margin-bottom: 15px; }
        .student-info { margin: 15px 0; font-size: 11pt; }
        .section { margin-bottom: 20px; page-break-inside: avoid; }
        .section-title { 
          font-size: 14pt; 
          font-weight: bold; 
          border-bottom: 1px solid #03ac13; 
          padding-bottom: 3px;
          margin-bottom: 10px;
          color: #03ac13;
        }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th { background: #03ac13; color: aliceblue; text-align: left; padding: 8px; }
        td { padding: 8px; border-bottom: 1px solid #ddd; }
        .comment-box { 
          border: 1px solid #ddd; 
          padding: 10px; 
          margin: 5px 0; 
          border-radius: 4px;
        }
        .footer { 
          font-size: 9pt; 
          text-align: center; 
          margin-top: 20px;
          color: #777;
        }
        ${watermarkHTML}
      </style>
    </head>
    <body>
      <div class="header">
        ${SCHOOL_LOGO ? `<img src="${SCHOOL_LOGO}" class="school-logo">` : ''}
        <div class="title">${SCHOOL_NAME}</div>
        <div class="subtitle">Academic Report Card</div>
        <div class="student-info">
          <strong>Student:</strong> ${studentId} | 
          <strong>Term:</strong> ${term} | 
          <strong>Generated:</strong> ${new Date().toLocaleDateString()}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Academic Summary</div>
        <table>
          <tr>
            <td width="30%"><strong>Overall Grade</strong></td>
            <td width="70%">${overallGrade}</td>
          </tr>
          <tr>
            <td><strong>Attendance Rate</strong></td>
            <td>${attendance}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Subject Performance</div>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Grade</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            ${subjects.map(subject => `
              <tr>
                <td>${subject.name}</td>
                <td>${subject.grade}</td>
                <td>
                  <div style="display: flex; align-items: center;">
                    <div style="width: 60px; margin-right: 10px;">${subject.progress}%</div>
                    <div style="flex-grow: 1; height: 10px; background: #e0e0e0; border-radius: 5px;">
                      <div style="height: 100%; width: ${subject.progress}%; background: #03ac13; border-radius: 5px;"></div>
                    </div>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Teacher Comments</div>
        ${comments.map(comment => `
          <div class="comment-box">
            <div style="font-weight: bold; margin-bottom: 5px;">
              ${comment.teacher} - ${comment.subject}
            </div>
            <div>${comment.text}</div>
          </div>
        `).join('')}
      </div>

      <div class="footer">
        <div>${SCHOOL_NAME} - Official Academic Report</div>
        <div>Page 1 of 1 | Generated on ${new Date().toLocaleString()}</div>
        <div style="margin-top: 5px; font-size: 8pt;">
          This document is electronically generated and does not require a signature.
        </div>
      </div>
    </body>
    </html>
  `;
};