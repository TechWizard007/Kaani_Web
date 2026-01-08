// Learning Hub JavaScript for learning.html
const API_URL = 'http://localhost:5000/api';

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.style.display = 'none');

            // Add active class to clicked button and show corresponding content
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).style.display = 'block';

            // Load modules when browse tab is opened
            if (targetTab === 'browse') {
                loadModules();
            }
        });
    });

    // Load modules on page load
    loadModules();

    // Handle upload form
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
    }

    // Check auth status
    checkAuthStatus();
});

// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const authStatus = document.getElementById('auth-status');
    const authStatusText = document.getElementById('auth-status-text');
    const loginPrompt = document.getElementById('login-prompt');
    const uploadForm = document.getElementById('upload-form');

    if (token) {
        // Try to decode token to get user info (basic check)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            authStatus.style.background = '#d4edda';
            authStatus.style.color = '#155724';
            authStatusText.textContent = 'Logged in';
            loginPrompt.style.display = 'none';
            uploadForm.style.display = 'flex';
        } catch (e) {
            // Invalid token
            localStorage.removeItem('token');
            showNotLoggedIn();
        }
    } else {
        showNotLoggedIn();
    }
}

function showNotLoggedIn() {
    const authStatus = document.getElementById('auth-status');
    const authStatusText = document.getElementById('auth-status-text');
    const loginPrompt = document.getElementById('login-prompt');
    const uploadForm = document.getElementById('upload-form');

    authStatus.style.background = '#fff3cd';
    authStatus.style.color = '#856404';
    authStatusText.textContent = 'Not logged in';
    loginPrompt.style.display = 'block';
    uploadForm.style.display = 'none';
}

// Load modules from API
async function loadModules() {
    const container = document.getElementById('modules-container');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666; grid-column: 1 / -1;">
            <div class="spinner" style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #4caf50; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
            <p>Loading modules...</p>
        </div>
    `;

    try {
        const response = await fetch(`${API_URL}/modules`);
        if (!response.ok) throw new Error('Failed to fetch modules');

        const modules = await response.json();

        if (modules.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666; grid-column: 1 / -1;">
                    <p style="font-size: 1.2rem; margin-bottom: 20px;">No modules available yet.</p>
                    <p>Check back later or contact an admin to upload modules.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = modules.map(module => `
            <div class="module-card">
                <div style="display: flex; align-items: start; justify-content: space-between; margin-bottom: 12px;">
                    <div style="font-size: 32px; margin-right: 12px;">
                        ${module.contentType === 'pdf' ? '📄' : module.contentType === 'video' ? '🎥' : '📚'}
                    </div>
                    <span style="font-size: 0.85rem; color: #999;">
                        ${new Date(module.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <h3>${escapeHtml(module.title)}</h3>
                <p>${escapeHtml(module.description)}</p>
                <div class="module-actions">
                    ${module.fileUrl ? `
                        <a href="${API_URL.replace('/api', '')}${module.fileUrl}" 
                           download 
                           class="download-btn">
                            📥 Download PDF
                        </a>
                    ` : `
                        <span style="color: #999; font-size: 0.9rem;">Text-only module</span>
                    `}
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading modules:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #d32f2f; grid-column: 1 / -1;">
                <p style="font-size: 1.2rem; margin-bottom: 10px;">Error loading modules</p>
                <p style="font-size: 0.9rem;">${error.message}</p>
                <p style="font-size: 0.85rem; margin-top: 15px; color: #666;">
                    Make sure the backend server is running on <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 4px;">http://localhost:5000</code>
                </p>
            </div>
        `;
    }
}

// Handle module upload
async function handleUpload(e) {
    e.preventDefault();
    
    const messageDiv = document.getElementById('upload-message');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Get form data
    const title = document.getElementById('module-title').value;
    const description = document.getElementById('module-description').value;
    const contentType = document.getElementById('module-type').value;
    const fileInput = document.getElementById('module-file');
    const file = fileInput.files[0];

    // Validate
    if (!title || !description) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }

    // Check for authentication token
    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('Please login first. Go to http://localhost:3000/login to authenticate.', 'error');
        checkAuthStatus(); // Update UI
        return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('contentType', contentType);
    if (file) {
        formData.append('file', file);
    }

    // Show loading state
    submitBtn.textContent = 'Uploading...';
    submitBtn.disabled = true;
    messageDiv.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/modules`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Upload failed');
        }

        // Success
        showMessage('Module uploaded successfully!', 'success');
        e.target.reset();
        
        // Reload modules if on browse tab
        const browseTab = document.getElementById('browse-tab');
        if (browseTab.style.display !== 'none') {
            loadModules();
        }

    } catch (error) {
        console.error('Upload error:', error);
        showMessage(error.message || 'Failed to upload module. Please try again.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Show message
function showMessage(message, type) {
    const messageDiv = document.getElementById('upload-message');
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    messageDiv.style.padding = '12px';
    messageDiv.style.borderRadius = '8px';
    
    if (type === 'success') {
        messageDiv.style.background = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else {
        messageDiv.style.background = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }

    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

