from dotenv import load_dotenv
from flask import Flask, request, render_template
import os
import pathlib
from google import genai
from google.genai import types
import markdown

# Load environment variables from .env
load_dotenv()
app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

# Gemini API Key
API_KEY = os.getenv("API")
client = genai.Client(api_key=API_KEY)

# Check file type
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Analyze file with Gemini
def analyze_file_with_gemini(filepath, prompt):
    file_ext = pathlib.Path(filepath).suffix.lower()
    mime_type = 'application/pdf' if file_ext == '.pdf' else 'image/png' if file_ext == '.png' else 'image/jpeg'

    # Upload file
    gemini_file = client.files.upload(
        file=filepath,
        config={'mime_type': mime_type}
    )

    # Send request to Gemini
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[gemini_file, prompt],
        config=types.GenerateContentConfig(
            system_instruction="""
You are a helpful, empathetic, and friendly medical assistant. Your job is to read and interpret medical reports (from PDF or images) and explain them in clear, everyday language suitable for someone with no medical background.

Always aim to educate, clarify, and comfort. Avoid using technical terms unless you explain them. Your tone should be conversational, respectful, and supportive — like a trusted friend explaining a medical result.

Do not diagnose or recommend any medication. Instead, help the user understand what the test results mean and whether they are within normal ranges.

            """
        )
    )
    return response.text


# Home route and file upload
@app.route("/", methods=["GET", "POST"])
def upload_file():
    if request.method == "POST":
        if "file" not in request.files:
            return "No file uploaded", 400
        file = request.files["file"]
        if file.filename == "" or not allowed_file(file.filename):
            return "Invalid file type", 400
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        # Prompt for Gemini
        prompt = """
Please analyze this health report and provide a summary in simple, easy-to-understand language. Organize the explanation into the following sections (if relevant):

- ✅ Blood Group
- 🩸 Complete Blood Count (CBC)
- 🧪 Blood Sugar / Glucose
- 💧 Kidney / Liver Function Tests
- 🧠 Thyroid Function
- 🧬 Cholesterol / Lipid Profile
- 💊 Vitamin & Mineral Levels
- 📋 Other Findings

For each test, clearly explain:
- What the test is for
- What the result means
- Whether it is normal, high, or low (based on the reference range)

Then, conclude with a short summary:
- ✅ What’s normal
- ⚠️ What needs attention
- 📝 Reminder to consult a doctor for medical advice

Use bullet points or tables where helpful. Avoid medical jargon. Be clear, calm, and friendly.

        """

        result = analyze_file_with_gemini(filepath, prompt)
        # Convert markdown Gemini output to HTML
        result_html = markdown.markdown(result, extensions=['tables', 'fenced_code'])
        return render_template("result.html", result=result_html)
    return render_template("home.html")


if __name__ == "__main__":
    app.run(debug=True)
