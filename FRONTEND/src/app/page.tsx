"use client";

import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Image from "next/image";

const deptFullNames: Record<string, string> = {
  MECH: "Mechanical Engineering",
  ECE: "Electronics and Communication Engineering",
  EEE: "Electrical and Electronics Engineering",
  CIVIL: "Civil Engineering",
  CSE: "Computer Science and Engineering",
  IT: "Information Technology",
  CSM: "Computer Science and Engineering (Artificial Intelligence & Machine Learning)",
  CSD: "Computer Science and Engineering (Data Science)",
  CSB: "Computer Science and Business Systems",
};

export default function Page() {
  const [currentPage, setCurrentPage] = useState<"login" | "selection" | "form">("login");

  // Selection state
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");

  // Login handlers
  const handleLoginSuccess = () => setCurrentPage("selection");
  const handleSelectionSuccess = () => setCurrentPage("form");
  const goBackToSelection = () => setCurrentPage("selection");

  return (
    <>
      <div className={`page ${currentPage === "login" ? "active" : ""}`} style={{ display: currentPage === "login" ? "block" : "none" }}>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </div>

      <div className={`page ${currentPage === "selection" ? "active" : ""}`} style={{ display: currentPage === "selection" ? "block" : "none" }}>
        <SelectionPage 
          onSelectionSuccess={handleSelectionSuccess} 
          year={year} setYear={setYear}
          semester={semester} setSemester={setSemester}
          department={department} setDepartment={setDepartment}
        />
      </div>

      <div className={`page ${currentPage === "form" ? "active" : ""}`} style={{ display: currentPage === "form" ? "block" : "none" }}>
        <FormPage 
          onBack={goBackToSelection}
          year={year}
          semester={semester}
          department={department}
        />
      </div>
    </>
  );
}

// ------ LOGIN PAGE COMPONENT ------
function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanEmail.endsWith("@vbithyd.ac.in")) {
      setEmailError("Only @vbithyd.ac.in email addresses are allowed!");
      triggerShake();
      return;
    }
    
    onLoginSuccess();
  };

  const triggerShake = () => {
    setIsShaking(false);
    setTimeout(() => setIsShaking(true), 10);
  };

  return (
    <section className="login-bg">
      <div className="login-card">
        <div className="login-logo-container">
          <img src="/vbit_logo.png" alt="VBIT Logo" className="login-logo" />
          <div className="login-brand-text">
            <h1 className="login-college-name">VIGNANA BHARATHI</h1>
            <h2 className="login-college-sub">Institute of Technology</h2>
            <p className="login-college-tag">Affiliated to JNTUH | Approved by AICTE</p>
          </div>
        </div>
        <div className="login-divider"></div>
        <h3 className="login-title">Student Login</h3>
        <p className="login-subtitle">Access your Major Project Summary Sheet</p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="input-group">
            <label>College Email ID</label>
            <input 
              type="email" 
              placeholder="e.g. 23p61a6782@vbithyd.ac.in" 
              required 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              style={{
                borderColor: emailError ? "#E53935" : "",
                animation: isShaking ? "shake 0.4s ease" : "none"
              }}
            />
            <span className="input-hint">Only @vbithyd.ac.in emails are allowed</span>
            <span className="input-error">{emailError}</span>
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-login">
            <span>Login</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
        <div className="login-or-divider">
          <span>or</span>
        </div>
        <button type="button" className="btn-google" onClick={() => setShowGoogleModal(true)}>
          <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span>Sign in with Google</span>
        </button>
        <p className="login-footer">&copy; 2026 VBIT Hyderabad. All rights reserved.</p>
      </div>

      {showGoogleModal && (
        <GoogleModal 
          onClose={() => setShowGoogleModal(false)} 
          onSuccess={() => { setShowGoogleModal(false); onLoginSuccess(); }}
        />
      )}
    </section>
  );
}

function GoogleModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith("@vbithyd.ac.in")) {
      setError("Only @vbithyd.ac.in email addresses are allowed!");
      setIsShaking(false);
      setTimeout(() => setIsShaking(true), 10);
      return;
    }
    onSuccess();
  };

  return (
    <div className="google-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="google-modal">
        <button className="google-modal-close" onClick={onClose}>&times;</button>
        <div className="google-modal-header">
          <svg width="40" height="40" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <h3>Sign in with Google</h3>
          <p>Use your VBIT college account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="google-input-group">
            <input 
              type="email" 
              placeholder="Enter your college email" 
              required 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              style={{
                borderColor: error ? "#EA4335" : "",
                animation: isShaking ? "shake 0.4s ease" : "none"
              }}
            />
            <span className="google-input-hint">Only @vbithyd.ac.in accounts</span>
            <span className="input-error">{error}</span>
          </div>
          <div className="google-modal-actions">
            <button type="button" className="google-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="google-btn-next">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ------ SELECTION PAGE COMPONENT ------
function SelectionPage({ 
  onSelectionSuccess, year, setYear, semester, setSemester, department, setDepartment 
}: any) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !semester || !department) {
      alert("Please select all fields before proceeding.");
      return;
    }
    onSelectionSuccess();
  };

  return (
    <section className="selection-bg">
      <div className="selection-card">
        <div className="selection-logo-container">
          <img src="/vbit_logo.png" alt="VBIT Logo" className="selection-logo" />
          <div className="selection-brand-text">
            <h1 className="selection-college-name">VIGNANA BHARATHI</h1>
            <h2 className="selection-college-sub">Institute of Technology</h2>
          </div>
        </div>
        <div className="login-divider"></div>
        <h3 className="selection-title">Select Your Details</h3>
        <p className="selection-subtitle">Choose your year, semester, and department to proceed</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Year</label>
            <select required value={year} onChange={e => setYear(e.target.value)}>
              <option value="" disabled>Select Year</option>
              <option value="II">II Year</option>
              <option value="III">III Year</option>
              <option value="IV">IV Year</option>
            </select>
          </div>
          <div className="input-group">
            <label>Semester</label>
            <select required value={semester} onChange={e => setSemester(e.target.value)}>
              <option value="" disabled>Select Semester</option>
              <option value="I">I Semester</option>
              <option value="II">II Semester</option>
            </select>
          </div>
          <div className="input-group">
            <label>Department</label>
            <select required value={department} onChange={e => setDepartment(e.target.value)}>
              <option value="" disabled>Select Department</option>
              <option value="MECH">MECH - Mechanical Engineering</option>
              <option value="ECE">ECE - Electronics &amp; Communication Engineering</option>
              <option value="EEE">EEE - Electrical &amp; Electronics Engineering</option>
              <option value="CIVIL">CIVIL - Civil Engineering</option>
              <option value="CSE">CSE - Computer Science &amp; Engineering</option>
              <option value="IT">IT - Information Technology</option>
              <option value="CSM">CSM - Computer Science &amp; Engineering (AI &amp; ML)</option>
              <option value="CSD">CSD - Computer Science &amp; Engineering (Data Science)</option>
              <option value="CSB">CSB - Computer Science &amp; Business Systems</option>
            </select>
          </div>
          <button type="submit" className="btn-login">
            <span>Submit &amp; Proceed</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}

// ------ FORM PAGE COMPONENT ------
function FormPage({ onBack, year, semester, department }: any) {
  const [projectTitle, setProjectTitle] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const paperRef = useRef<HTMLDivElement>(null);

  const downloadFormAsPDF = () => {
    if (!paperRef.current) return;
    setIsGeneratingPdf(true);
    const formPaper = paperRef.current;
    
    // Auto-resize magic
    formPaper.classList.add('download-mode');
    const textareas = formPaper.querySelectorAll('textarea');
    const originalHeights: string[] = [];
    textareas.forEach((ta, i) => {
      originalHeights[i] = ta.style.height;
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
      ta.style.overflow = 'hidden';
    });

    setTimeout(() => {
      html2canvas(formPaper, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: formPaper.scrollWidth,
        height: formPaper.scrollHeight,
        windowWidth: formPaper.scrollWidth,
        windowHeight: formPaper.scrollHeight
      }).then((canvas) => {
        const pdfWidth = 210;
        const pdfHeight = 297;
          
        // Remove jsPDF extra margin (relying on CSS padding instead)
        const margin = 0;
        const contentWidth = pdfWidth - (margin * 2);
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageContentHeight = pdfHeight - (margin * 2);

        let finalImgWidth = imgWidth;
        let finalImgHeight = imgHeight;

        if (finalImgHeight > pageContentHeight) {
          const ratio = pageContentHeight / finalImgHeight;
          finalImgHeight = pageContentHeight;
          finalImgWidth = imgWidth * ratio;
        }

        const xOffset = margin + (imgWidth - finalImgWidth) / 2;

        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', xOffset, margin, finalImgWidth, finalImgHeight);
        
        const sanitizedTitle = (projectTitle || 'Summary_Sheet').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50);
        pdf.save(`${sanitizedTitle}_Summary_Sheet.pdf`);

        formPaper.classList.remove('download-mode');
        textareas.forEach((ta, i) => {
          ta.style.height = originalHeights[i] || '';
          ta.style.overflow = '';
        });
        setIsGeneratingPdf(false);
      }).catch(err => {
        console.error('PDF generation error:', err);
        alert('There was an error generating the PDF.');
        formPaper.classList.remove('download-mode');
        textareas.forEach((ta, i) => {
          ta.style.height = originalHeights[i] || '';
          ta.style.overflow = '';
        });
        setIsGeneratingPdf(false);
      });
    }, 300);
  };

  return (
    <div className="form-page-bg">
      <div className="form-toolbar">
        <button className="btn-back" onClick={onBack} title="Go Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="toolbar-title">Major Project Individual Summary Sheet</h2>
        <button className="btn-download" onClick={downloadFormAsPDF}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download Form
        </button>
      </div>

      <div className="form-paper" ref={paperRef} id="form-paper">
        <div className="form-header">
          <div className="header-logo-section" style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
            <img
              src="/vbit_form_logo.png" 
              alt="VBIT Form Header Logo"
              className="form-logo-wide"
              style={{ objectFit: 'contain', width: '100%', maxWidth: '100%', minHeight: '60px', maxHeight: '110px' }}
            />
          </div>
          <p className="header-department">{deptFullNames[department] || "Department"}</p>
          <p className="header-info">{year} B.Tech {semester} Semester Major Project Individual Summary Sheet</p>
          <div className="header-line"></div>
        </div>

        <table className="summary-table" style={{ tableLayout: 'fixed', width: '100%', wordWrap: 'break-word' }}>
          <colgroup>
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td colSpan={4} className="field-row">
                <span className="field-label">Project Title:</span>
                <textarea
                  className="field-input"
                  placeholder="Enter your project title"
                  value={projectTitle}
                  onChange={e => {
                    setProjectTitle(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  rows={1}
                  style={{ resize: 'none', overflow: 'hidden' }}
                />
              </td>
            </tr>
            <tr>
              <td className="field-row compact">
                <span className="field-label">Project Code</span>
                <textarea className="field-input small auto-resize" rows={1} style={{ resize: 'none', overflow: 'hidden' }} placeholder="e.g. Batch 96/DS/390"></textarea>
              </td>
              <td className="field-row compact">
                <span className="field-label">BATCH NO</span>
                <textarea className="field-input small auto-resize" rows={1} style={{ resize: 'none', overflow: 'hidden' }} placeholder="05"></textarea>
              </td>
              <td colSpan={2} className="field-row compact">
                <span className="field-label">Batch</span>
                <textarea className="field-input small auto-resize" rows={1} style={{ resize: 'none', overflow: 'hidden' }} placeholder="2024-2025"></textarea>
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="field-row">
                <span className="field-label">Domain/Area:</span>
                <textarea className="field-input auto-resize" rows={1} style={{ resize: 'none', overflow: 'hidden' }} placeholder="e.g. Internet of Things"></textarea>
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="section-cell">
                <div className="section-header-label">Abstract:</div>
                <textarea className="section-textarea large" placeholder="Enter the abstract of your project..."></textarea>
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="section-header-cell"><span className="section-header-text">Technical S/W &amp; H/W Specifications</span></td>
              <td colSpan={2} className="section-header-cell"><span className="section-header-text">Module(s) Specifications</span></td>
            </tr>
            <tr>
              <td className="content-cell">
                <div className="sub-header">Software Specifications</div>
                <textarea className="section-textarea medium" placeholder="Enter software specifications..."></textarea>
              </td>
              <td className="content-cell">
                <div className="sub-header">Hardware Specifications</div>
                <textarea className="section-textarea medium" placeholder="Enter hardware specifications..."></textarea>
              </td>
              <td colSpan={2} className="content-cell">
                <textarea className="section-textarea large" placeholder="Enter module specifications..."></textarea>
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="section-header-cell"><span className="section-header-text">Architecture Diagram</span></td>
              <td colSpan={2} className="section-header-cell"><span className="section-header-text">Methodology</span></td>
            </tr>
            <tr>
              <td colSpan={2} className="content-cell architecture-cell">
                <ImageUploadBox maxSize={1048576} placeholderText="Click to upload architecture diagram" isLarge />
              </td>
              <td colSpan={2} className="content-cell">
                <textarea className="section-textarea large" placeholder="Enter the methodology of your project..."></textarea>
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="section-header-cell"><span className="section-header-text">Existing System</span></td>
              <td colSpan={2} className="section-header-cell"><span className="section-header-text">Proposed System</span></td>
            </tr>
            <tr>
              <td colSpan={2} className="content-cell">
                <textarea className="section-textarea medium" placeholder="Describe the existing system..."></textarea>
              </td>
              <td colSpan={2} className="content-cell">
                <textarea className="section-textarea medium" placeholder="Describe the proposed system..."></textarea>
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="section-header-cell"><span className="section-header-text">Guide Details</span></td>
              <td colSpan={2} className="section-header-cell"><span className="section-header-text">Batch Members</span></td>
            </tr>
            <tr>
              <td colSpan={2} className="content-cell guide-cell">
                <div className="guide-layout">
                  <div className="guide-photo-container">
                    <ImageUploadBox maxSize={1048576} isSmall />
                  </div>
                  <div className="guide-info">
                    <textarea className="guide-info-textarea" wrap="off" placeholder="Name:&#10;Designation:&#10;Professor, Dept of&#10;CSE&#10;DATA SCIENCE&#10;VBIT&#10;Email:&#10;Phone:"></textarea>
                  </div>
                </div>
              </td>
              <td colSpan={2} className="content-cell batch-cell">
                <div className="batch-members-grid">
                  {[1, 2, 3, 4].map(idx => (
                    <div className="member-item" key={idx}>
                      <ImageUploadBox maxSize={1048576} isSmall />
                      <textarea className="member-details" placeholder="Name:&#10;Roll No:"></textarea>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="download-section">
        <button className="btn-download-bottom" onClick={downloadFormAsPDF}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download Form as PDF
        </button>
      </div>

      {isGeneratingPdf && (
        <div className="loading-overlay" style={{ display: 'flex' }}>
          <div className="loading-spinner"></div>
          <p>Generating PDF, please wait...</p>
        </div>
      )}
    </div>
  );
}

// ------ IMAGE UPLOAD SHARED COMPONENT ------
function ImageUploadBox({ maxSize, placeholderText, isLarge, isSmall }: { maxSize: number, placeholderText?: string, isLarge?: boolean, isSmall?: boolean }) {
  const [preview, setPreview] = useState("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      alert(`File size exceeds limit of ${Math.round(maxSize / 1024)} KB.`);
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => setPreview(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPreview("");
  };

  if (isLarge) {
    return (
      <div className="upload-area">
        <input type="file" accept="image/*" onChange={handleUpload} className="file-input" />
        {!preview ? (
          <div className="upload-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
            </svg>
            <p>{placeholderText}</p>
            <span className="upload-hint">Max file size: 1 MB</span>
          </div>
        ) : (
          <>
            <img src={preview} alt="Preview" className="preview-image" />
            <button onClick={removeImage} className="remove-image-btn" title="Remove image">&times;</button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`photo-upload-box ${!isSmall ? "member-photo" : ""}`}>
      <input type="file" accept="image/*" onChange={handleUpload} className="file-input photo-input" />
      {!preview ? (
        <div className={`photo-placeholder ${!isSmall ? "member-placeholder" : ""}`}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
          </svg>
          {!isSmall && <span>Upload Photo</span>}
        </div>
      ) : (
        <img src={preview} alt="Preview" className={`photo-preview ${!isSmall ? "member-preview" : ""}`} style={{ display: 'block' }} />
      )}
    </div>
  );
}
