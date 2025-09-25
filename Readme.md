# 🧠 Health Risk Profiler 

## 📌 Description 
Health Risk Profiler is an **AI-powered health assessment system** that uses OCR and structured prompting to extract lifestyle information (age, smoking habits, exercise, diet) from text or images. The system then analyzes potential risk factors, classifies health risk levels, and generates short, actionable, **non-diagnostic** recommendations for improvement.

It leverages **Google Gemini AI** for text understanding and reasoning, combined with a **Node.js + Express backend** for API delivery.


## ✨ Features ##
* 📷 **OCR Extraction** – Extract structured survey data directly from uploaded images.

* 📝 **Text Input Support** – Accepts direct JSON/text survey responses.

* 🔎 **Factor Extraction** – Identifies lifestyle-related health risk factors.

* ⚖️ **Risk Classification** – Scores risks as low, medium, or high with rationale.

* ✅ **Recommendations** – Generates short, crisp, actionable suggestions.

* 🔐 **File Validation** – Only accepts supported image formats (PNG, JPEG, WEBP, HEIC, HEIF).

* ⚡ **Error Handling** – Handles missing data, incomplete profiles, and unsupported inputs gracefully.
  

## ⚙️ Setup Instructions
**1. Clone Repository**

```bash
git clone https://github.com/MukundAgarwal-code/Health-Risk-Profiler.git

cd Health-Risk-Profiler
```

**2. Install Dependencies**

```bash
npm install
```

**3. Configure Environment**
Create a `.env` file in the project root with:

```bash
PORT=3000
GOOGLE_API_KEY=your_google_gemini_api_key
```

**4. Run Development Server**

```bash
npm run dev
```

or for production:

```bash
npm start
```

The server will start on `http://localhost:3000`.


# 🏗️ Architecture
```bash
src/
 ├── controllers/
 │    └── controller.js        # Main business logic (OCR + pipeline steps)
 ├── middlewares/
 │    └── multer.middleware.js # File upload middleware
 ├── utils/
 │    ├── ApiResponse.js       # Standard API response wrapper
 │    ├── Prompts.js           # AI prompts for each step
 │    └── gemini.js            # Google Gemini API integration
 ├── app.js                    # Express app configuration
 └── index.js                  # Server entry point
```


## 🧠 Processing Pipeline
1. **Input (Image/Text)**

2. **OCR (Gemini) →** Extract text fields (age, smoker, exercise, diet).

3. **Factor Extraction (Gemini) →** Identify lifestyle-related risk factors.

4. **Risk Assessment (Gemini) →** Score risk and classify (low/medium/high).

5. **Recommendations (Gemini) →** Generate actionable guidance.

6. **Response (API) →** JSON response with results.

## 📬 Test With Postman

You can import this collection directly in Postman to test the API:

[Open Postman Collection](https://agarwalmukund1176-6887481.postman.co/workspace/1fbb6163-f387-451a-8b1c-6772c16254f5/collection/48791767-967a4e32-2513-4389-870c-186184ab82b8?action=share&source=copy-link&creator=48791767)

## 📡 API Usage Examples
### Endpoint

`POST /api/analyse`

### Request (Image Upload)

```bash
curl -X POST http://localhost:3000/api/analyse \
  -F "image=@/path/to/survey.jpg"
```

### Request (Raw JSON Input)

```bash
curl -X POST http://localhost:3000/api/analyse \
  -H "Content-Type: application/json" \
  -d '{
    "age": 28,
    "smoker": true,
    "exercise": "rarely",
    "diet": "high sugar"
  }'
```

### Example Response

```bash
{
  "status": 200,
  "message": "Response fetched successfully!",
  "data": {
    "risk_level": "high",
    "factors": ["smoking", "poor diet", "low exercise"],
    "recommendations": ["Quit smoking", "Reduce sugar", "Walk 30 mins daily"],
    "status": "ok"
  }
}
```

# 🧪 Testing
* Use **Postman** or **cURL** to test the API.

* Place test images in `./public/temp` for uploads.

* Logs will show intermediate JSON (parsed answers, extracted factors, risk scores).

# 👨‍💻 Made By
## Mukund Agarwal

💼 Backend Developer 

🔗 [GitHub](https://github.com/MukundAgarwal-code) | [LinkedIn](https://www.linkedin.com/in/mukund-agarwal-853790251/)