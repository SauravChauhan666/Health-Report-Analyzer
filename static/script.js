document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFile = document.getElementById('removeFile');
    const submitBtn = document.getElementById('submitBtn');
    const uploadForm = document.getElementById('uploadForm');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // File input change event
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('dragleave', handleDragLeave);
    fileUploadArea.addEventListener('drop', handleDrop);
    
    // Remove file event
    removeFile.addEventListener('click', clearFile);
    
    // Form submit event
    uploadForm.addEventListener('submit', (e) => {
        const file = fileInput.files[0];
        if (!file || !validateFile(file)) {
            e.preventDefault();
            showError('Please choose a valid file first.');
            return;
        }

        loadingOverlay.style.display = 'flex'; // Show “Analyzing…” overlay
        });


    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            if (validateFile(file)) {
                displayFileInfo(file);
                enableSubmitButton();
            } else {
                clearFile();
                showError('Please select a valid PDF or PNG file.');
            }
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
        fileUploadArea.classList.add('dragover');
    }

    function handleDragLeave(event) {
        event.preventDefault();
        fileUploadArea.classList.remove('dragover');
    }

    function handleDrop(event) {
        event.preventDefault();
        fileUploadArea.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (validateFile(file)) {
                fileInput.files = files;
                displayFileInfo(file);
                enableSubmitButton();
            } else {
                showError('Please drop a valid PDF or PNG file.');
            }
        }
    }

    function validateFile(file) {
        const allowedTypes = ['application/pdf', 'image/png'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
            return false;
        }

        if (file.size > maxSize) {
            showError('File size must be less than 10MB.');
            return false;
        }

        return true;
    }

    function displayFileInfo(file) {
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.style.display = 'block';
        fileUploadArea.style.display = 'none';
    }

    function clearFile() {
        fileInput.value = '';
        fileInfo.style.display = 'none';
        fileUploadArea.style.display = 'block';
        disableSubmitButton();
    }

    function enableSubmitButton() {
        submitBtn.disabled = false;
    }

    function disableSubmitButton() {
        submitBtn.disabled = true;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
            z-index: 1000;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Animate in
        setTimeout(() => {
            errorDiv.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            errorDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(errorDiv)) {
                    document.body.removeChild(errorDiv);
                }
            }, 300);
        }, 4000);
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        
        const file = fileInput.files[0];
        if (!file) {
            showError('Please select a file first.');
            return;
        }

        if (!validateFile(file)) {
            return;
        }

        // Show loading overlay
        loadingOverlay.style.display = 'flex';
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);

        // Submit form using fetch API
        fetch('/', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Hide loading overlay
            loadingOverlay.style.display = 'none';
            
            // Handle successful response
            console.log('Analysis result:', data);
            showSuccess('Report analyzed successfully!');
            
            // Display analysis result
            displayAnalysisResult(data.analysis);
        })
        .catch(error => {
            // Hide loading overlay
            loadingOverlay.style.display = 'none';
            
            console.error('Error:', error);
            showError('Failed to analyze report. Please try again.');
        });
    }

    function showSuccess(message) {
        // Create success notification
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
            z-index: 1000;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(successDiv);
        
        // Animate in
        setTimeout(() => {
            successDiv.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            successDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(successDiv)) {
                    document.body.removeChild(successDiv);
                }
            }, 300);
        }, 4000);
    }

    function displayAnalysisResult(analysis) {
        // Create results section
        const resultsSection = document.createElement('div');
        resultsSection.className = 'results-section';
        resultsSection.innerHTML = `
            <div class="results-card">
                <div class="results-header">
                    <h2>Analysis Results</h2>
                    <button class="close-results" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="results-content">
                    <div class="analysis-text">
                        ${analysis.replace(/\n/g, '<br>')}
                    </div>
                </div>
                <div class="results-actions">
                    <button class="analyze-another" onclick="location.reload()">Analyze Another Report</button>
                </div>
            </div>
        `;

        // Add styles for results
        const resultStyles = `
            .results-section {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                padding: 20px;
                animation: fadeIn 0.3s ease;
            }
            
            .results-card {
                background: white;
                border-radius: 20px;
                max-width: 800px;
                max-height: 80vh;
                width: 100%;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            }
            
            .results-header {
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                color: white;
                padding: 20px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .results-header h2 {
                margin: 0;
                font-size: 1.5rem;
            }
            
            .close-results {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                font-size: 20px;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            .close-results:hover {
                background: rgba(255,255,255,0.3);
            }
            
            .results-content {
                padding: 30px;
                max-height: 60vh;
                overflow-y: auto;
            }
            
            .analysis-text {
                line-height: 1.8;
                font-size: 1rem;
                color: #2c3e50;
            }
            
            .results-actions {
                padding: 20px 30px;
                border-top: 1px solid #eee;
                text-align: center;
            }
            
            .analyze-another {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
                transition: transform 0.2s;
            }
            
            .analyze-another:hover {
                transform: translateY(-2px);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;

        // Add styles to document
        const styleSheet = document.createElement('style');
        styleSheet.textContent = resultStyles;
        document.head.appendChild(styleSheet);

        // Add to document
        document.body.appendChild(resultsSection);
    }

    // Add click event to upload area
    fileUploadArea.addEventListener('click', function(e) {
        if (e.target !== fileInput) {
            fileInput.click();
        }
    });
});