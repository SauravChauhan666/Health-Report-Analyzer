# Health Report Analyzer

A Flask-based web application that analyzes health reports (PDFs and images) using Google's Gemini AI to provide clear, easy-to-understand explanations suitable for anyone without medical background.

## Features

-  **Upload Support**: Supports PDF and image files (PNG, JPG, JPEG)
- **AI-Powered Analysis**: Uses Google Gemini API for intelligent report analysis
-  **Simplified Explanations**: Converts complex medical terminology into simple, conversational language
-  **Organized Output**: Structures results by health categories:
  - Blood Group
  - Complete Blood Count (CBC)
  - Blood Sugar / Glucose
  - Kidney / Liver Function Tests
  - Thyroid Function
  - Cholesterol / Lipid Profile
  - Vitamin & Mineral Levels
  - Other Findings

## Installation

### Prerequisites
- Python 3.7+
- pip (Python package manager)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd Health-Report-Analyzer
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory and add your Google Gemini API key:
```
API=your-api-key-here
```

## Usage

1. Run the Flask application:
```bash
python app.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

3. Upload a health report (PDF or image)

4. View the AI-generated analysis in simple, easy-to-understand language

## Project Structure

```
Health-Report-Analyzer/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── static/
│   ├── styles.css       # CSS styling
│   └── script.js        # Client-side JavaScript
├── templates/
│   ├── home.html        # Upload page
│   └── result.html      # Results display page
└── uploads/             # Uploaded files (auto-created)
```

## Requirements

- Flask==2.3.3
- python-dotenv==1.0.0
- google-genai==0.3.0
- markdown==3.5.1

## API Key Setup

To use this application, you need a Google Gemini API key:

1. Visit [Google AI Studio](https://ai.google.dev)
2. Generate an API key
3. Add it to your `.env` file as `API=your-key-here`

## Features Explained

### File Validation
- Accepts: `.pdf`, `.png`, `.jpg`, `.jpeg`
- Automatically validates file extensions

### AI Analysis
- Uses Google Gemini 2.5 Flash model
- Provides empathetic and friendly medical assistance
- Explains test results in everyday language
- Indicates whether results are normal, high, or low

### Output Formatting
- Converts Markdown to HTML for better presentation
- Supports tables and formatted code blocks
- Clear, organized sections for easy reading

## Safety & Disclaimer

⚠️ **Important**: This tool is for educational purposes only. It explains medical reports in simple language but does NOT:
- Provide medical diagnoses
- Recommend medications
- Replace professional medical advice

Always consult a healthcare professional for medical guidance.


