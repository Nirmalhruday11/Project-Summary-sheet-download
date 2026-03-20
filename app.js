/* ==========================================
   VBIT Project Summary Sheet - JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // =====================
    // Department Mappings
    // =====================
    const deptFullNames = {
        'MECH': 'Mechanical Engineering',
        'ECE': 'Electronics and Communication Engineering',
        'EEE': 'Electrical and Electronics Engineering',
        'CIVIL': 'Civil Engineering',
        'CSE': 'Computer Science and Engineering',
        'IT': 'Information Technology',
        'CSM': 'Computer Science and Engineering (Artificial Intelligence & Machine Learning)',
        'CSD': 'Computer Science and Engineering (Data Science)',
        'CSB': 'Computer Science and Business Systems'
    };

    // =====================
    // Page Navigation
    // =====================
    function showPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(pageId);
        if (target) {
            target.classList.add('active');
            window.scrollTo(0, 0);
        }
    }

    // =====================
    // LOGIN FORM
    // =====================
    const loginForm = document.getElementById('login-form');
    const loginEmail = document.getElementById('login-email');
    const emailError = document.getElementById('email-error');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginEmail.value.trim().toLowerCase();
        const domain = '@vbithyd.ac.in';

        // Validate domain
        if (!email.endsWith(domain)) {
            emailError.textContent = 'Only @vbithyd.ac.in email addresses are allowed!';
            loginEmail.style.borderColor = '#E53935';
            shakeElement(loginEmail);
            return;
        }

        // Simple email format check
        const emailRegex = /^[a-zA-Z0-9._]+@vbithyd\.ac\.in$/;
        if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid college email address.';
            loginEmail.style.borderColor = '#E53935';
            shakeElement(loginEmail);
            return;
        }

        emailError.textContent = '';
        loginEmail.style.borderColor = '';

        // Success - go to selection page
        showPage('selection-page');
    });

    loginEmail.addEventListener('input', () => {
        emailError.textContent = '';
        loginEmail.style.borderColor = '';
    });

    // Shake animation for invalid input
    function shakeElement(el) {
        el.style.animation = 'none';
        el.offsetHeight; // trigger reflow
        el.style.animation = 'shake 0.4s ease';
        setTimeout(() => { el.style.animation = ''; }, 400);
    }

    // Add shake keyframes dynamically
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    // =====================
    // GOOGLE SIGN-IN (Modal)
    // =====================
    const googleModal = document.getElementById('google-modal-overlay');
    const googleEmailInput = document.getElementById('google-email-input');
    const googleModalError = document.getElementById('google-modal-error');
    const googleError = document.getElementById('google-error');

    // Open modal when Google button clicked
    document.getElementById('btn-google-signin').addEventListener('click', () => {
        googleModal.style.display = 'flex';
        googleEmailInput.value = '';
        googleModalError.textContent = '';
        googleError.textContent = '';
        setTimeout(() => googleEmailInput.focus(), 100);
    });

    // Close modal
    function closeGoogleModal() {
        googleModal.style.display = 'none';
        googleEmailInput.value = '';
        googleModalError.textContent = '';
    }

    document.getElementById('google-modal-close').addEventListener('click', closeGoogleModal);
    document.getElementById('google-btn-cancel').addEventListener('click', closeGoogleModal);

    // Close on overlay click
    googleModal.addEventListener('click', (e) => {
        if (e.target === googleModal) closeGoogleModal();
    });

    // Handle Google sign-in form submit
    document.getElementById('google-signin-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = googleEmailInput.value.trim().toLowerCase();
        const domain = '@vbithyd.ac.in';

        if (!email.endsWith(domain)) {
            googleModalError.textContent = 'Only @vbithyd.ac.in email addresses are allowed!';
            googleEmailInput.style.borderColor = '#EA4335';
            shakeElement(googleEmailInput);
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._]+@vbithyd\.ac\.in$/;
        if (!emailRegex.test(email)) {
            googleModalError.textContent = 'Please enter a valid college email.';
            googleEmailInput.style.borderColor = '#EA4335';
            shakeElement(googleEmailInput);
            return;
        }

        // Success
        closeGoogleModal();
        showPage('selection-page');
    });

    googleEmailInput.addEventListener('input', () => {
        googleModalError.textContent = '';
        googleEmailInput.style.borderColor = '';
    });

    // =====================
    // SELECTION FORM
    // =====================
    const selectionForm = document.getElementById('selection-form');

    selectionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const year = document.getElementById('select-year').value;
        const semester = document.getElementById('select-semester').value;
        const dept = document.getElementById('select-department').value;

        if (!year || !semester || !dept) {
            alert('Please select all fields before proceeding.');
            return;
        }

        // Update form header with selected values
        const deptFull = deptFullNames[dept] || dept;
        document.getElementById('header-department').textContent = deptFull;
        document.getElementById('header-info').textContent =
            `${year} B.Tech ${semester} Semester Major Project Individual Summary Sheet`;

        // Show form page
        showPage('form-page');
    });

    // =====================
    // BACK BUTTON
    // =====================
    document.getElementById('btn-back').addEventListener('click', () => {
        showPage('selection-page');
    });

    // =====================
    // IMAGE UPLOADS
    // =====================

    // Architecture Diagram Upload
    setupImageUpload(
        'arch-upload',
        'arch-preview',
        'arch-placeholder',
        'arch-remove',
        1048576 // 1MB
    );

    // Guide Photo Upload
    setupPhotoUpload('guide-photo-upload', 'guide-photo-preview', 'guide-photo-placeholder');

    // Batch Member Photo Uploads
    for (let i = 1; i <= 4; i++) {
        setupPhotoUpload(`member${i}-photo`, `member${i}-preview`, `member${i}-placeholder`);
    }

    function setupImageUpload(inputId, previewId, placeholderId, removeBtnId, maxSize) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        const placeholder = document.getElementById(placeholderId);
        const removeBtn = document.getElementById(removeBtnId);

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > maxSize) {
                alert(`File size exceeds the maximum limit of ${Math.round(maxSize / 1024)} KB. Please choose a smaller file.`);
                input.value = '';
                return;
            }

            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file.');
                input.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                preview.src = event.target.result;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
                if (removeBtn) removeBtn.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        });

        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                preview.src = '';
                preview.style.display = 'none';
                placeholder.style.display = 'block';
                removeBtn.style.display = 'none';
                input.value = '';
            });
        }
    }

    function setupPhotoUpload(inputId, previewId, placeholderId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        const placeholder = document.getElementById(placeholderId);

        if (!input || !preview || !placeholder) return;

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 1048576) {
                alert('File size exceeds 1 MB. Please choose a smaller file.');
                input.value = '';
                return;
            }

            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file.');
                input.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                preview.src = event.target.result;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        });
    }

    // =====================
    // DOWNLOAD AS PDF
    // =====================
    function downloadFormAsPDF() {
        const formPaper = document.getElementById('form-paper');
        const loadingOverlay = document.getElementById('loading-overlay');

        // Show loading
        loadingOverlay.style.display = 'flex';

        // Add download mode class (hides controls, cleans up styling)
        formPaper.classList.add('download-mode');

        // Auto-resize all textareas to fit content for proper capture
        const textareas = formPaper.querySelectorAll('textarea');
        const originalHeights = [];
        textareas.forEach((ta, i) => {
            originalHeights[i] = ta.style.height;
            ta.style.height = 'auto';
            ta.style.height = ta.scrollHeight + 'px';
            ta.style.overflow = 'hidden';
        });

        // Small delay to let browser render
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
                const { jsPDF } = window.jspdf;

                // A4 dimensions in mm
                const pdfWidth = 210;
                const pdfHeight = 297;
                const margin = 10;
                const contentWidth = pdfWidth - (margin * 2);

                const imgWidth = contentWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                const pdf = new jsPDF('p', 'mm', 'a4');
                const pageContentHeight = pdfHeight - (margin * 2);

                let finalImgWidth = imgWidth;
                let finalImgHeight = imgHeight;

                // Scale down to fit exactly on one page
                if (finalImgHeight > pageContentHeight) {
                    const ratio = pageContentHeight / finalImgHeight;
                    finalImgHeight = pageContentHeight;
                    finalImgWidth = imgWidth * ratio;
                }

                // Center horizontally if scaled down
                const xOffset = margin + (imgWidth - finalImgWidth) / 2;

                pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', xOffset, margin, finalImgWidth, finalImgHeight);

                // Get project title for filename
                const projectTitle = document.getElementById('project-title').value.trim() || 'Summary_Sheet';
                const sanitizedTitle = projectTitle.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50);

                pdf.save(`${sanitizedTitle}_Summary_Sheet.pdf`);

                // Cleanup
                formPaper.classList.remove('download-mode');
                textareas.forEach((ta, i) => {
                    ta.style.height = originalHeights[i] || '';
                    ta.style.overflow = '';
                });
                loadingOverlay.style.display = 'none';

            }).catch((err) => {
                console.error('PDF generation error:', err);
                alert('There was an error generating the PDF. Please try again.');
                formPaper.classList.remove('download-mode');
                textareas.forEach((ta, i) => {
                    ta.style.height = originalHeights[i] || '';
                    ta.style.overflow = '';
                });
                loadingOverlay.style.display = 'none';
            });
        }, 300);
    }

    // Download buttons
    document.getElementById('btn-download').addEventListener('click', downloadFormAsPDF);
    document.getElementById('btn-download-bottom').addEventListener('click', downloadFormAsPDF);

    // =====================
    // LOGO ERROR HANDLING
    // =====================
    // If logo image fails to load, show a text fallback
    const logoImages = document.querySelectorAll('img[src="vbit_logo.png"]');
    logoImages.forEach(img => {
        img.addEventListener('error', () => {
            img.style.display = 'none';
            // Create a text-based fallback
            const fallback = document.createElement('div');
            fallback.style.cssText = `
                width: 72px; height: 72px; border-radius: 50%;
                background: linear-gradient(135deg, #C62828, #D32F2F);
                display: flex; align-items: center; justify-content: center;
                color: #fff; font-weight: 700; font-size: 1.2rem;
                font-family: 'Merriweather', serif; margin: 0 auto;
            `;
            fallback.textContent = 'VBIT';
            img.parentNode.insertBefore(fallback, img);
        });
    });

});
