# PlantGuard AI 🌿
> **Smart Crop Disease & Pest Damage Diagnostic Platform**  
> *Built with Python, Flask, Pillow, the official `google-genai` SDK, and Botanical Pathology Science.*

---

## 📖 Overview

**PlantGuard AI** is a portfolio-grade, multilingual web application engineered to assist farmers, agricultural students, and agronomists in identifying plant leaf diseases, diagnosing pest damage, and generating problem-specific remedies.

The application features a **Real AI & Graceful Fallback Hybrid Architecture**:
1. **Real Multimodal AI Vision & Diagnostic Reasoning (Google Gemini 3.8 Flash)**: When an API key is configured, analyzes leaf imagery for fungal/bacterial diseases, chewing holes, leaf miners, stippling, and nutritional chlorosis, synthesizing user field context into honest, problem-specific treatments.
2. **Validated Botanical Heuristic Fallback Engine**: If no API key is present or quota is exhausted, automatically falls back to morphological leaf perforation and botanical colorimetric analysis.
3. **Strict AI Model Honesty**: Transparent status badges in the UI and JSON payload clearly distinguish real AI inferences from fallback/demo calculations.
4. **Trilingual Support**: Full localized interface available in **English**, **Odia (ଓଡ଼ିଆ)**, and **Hindi (हिन्दी)** with persistent `localStorage` selection.

---

## ✨ Key Features

- **Real Multimodal Vision Analysis**:
  - Leverages Google Gemini multimodal vision via the official `google-genai` Python SDK.
  - Identifies crop species, visible lesions, insect defoliation, wilting, and discoloration.
  - Formulates honest uncertainty assessments, clarifying visual ambiguities.
- **Dynamic Field Context & Follow-Up Q&A**:
  - Optional field inputs (Plant name, watering frequency, visible insects) refine AI diagnostic reasoning.
  - Displays dynamic follow-up questions from the AI when visual evidence warrants further investigation.
- **Dual Disease & Pest Separation**:
  - Independent physical pest damage evaluation (caterpillar chewing, leafminer galleries, spider mite stippling) distinct from cellular microbial blights.
- **Actionable Agronomic Solutions**:
  - Immediate cultural measures (pruning, irrigation adjustments).
  - Eco-friendly organic options (Neem oil, Bacillus subtilis, copper).
  - Chemical treatments strictly coupled with precaution alerts and pre-harvest intervals (PHI).
- **Trilingual Localization (EN / OR / HI)**:
  - Odia and Hindi Unicode font rendering with system fallbacks (`Nirmala UI`, `Kalinga`, `Mangal`).
- **File Validation & Safety**:
  - Strict 5MB file payload limit.
  - Pillow magic byte verification and out-of-distribution non-foliage detection.
  - Zero hardcoded secrets (`.env` excluded from Git via `.gitignore`).

---

## 🏗️ Project Architecture

```
plantguard-ai/
│
├── app.py                         # Flask application & API routes
├── generate_sample_images.py      # Demo leaf image synthesis script
├── test_pipeline.py               # Automated test suite (9 comprehensive tests)
├── requirements.txt               # Dependencies (Flask, Pillow, google-genai, python-dotenv)
├── .env.example                   # Environment configuration template
├── .gitignore                     # Git secret exclusions (.env, .venv)
├── README.md                      # Documentation
│
├── services/
│   ├── __init__.py
│   ├── gemini_vision_service.py   # Real AI vision & reasoning via google-genai SDK
│   ├── disease_engine.py          # Botanical heuristic & feature classifier (fallback)
│   ├── disease_data.py            # Botanical pathology knowledge base
│   ├── pest_engine.py             # Validated pest perforation & IPM analyzer
│   └── image_validator.py         # File integrity & clarity validation
│
├── static/
│   ├── css/
│   │   └── style.css              # Agricultural dashboard design system
│   ├── js/
│   │   ├── translations.js        # Multilingual dictionary (EN, OR, HI)
│   │   └── app.js                 # Drag-drop, context capture & dynamic UI controller
│   └── samples/                   # Generated sample leaf images for instant demo
│
└── templates/
    └── index.html                 # Semantic HTML5 dashboard layout
```

---

## 🔑 Setting Up Your Free Google AI Studio API Key

PlantGuard AI runs completely free with zero financial cost:

1. **Get your free key**:
   - Visit [Google AI Studio](https://aistudio.google.com/).
   - Sign in with your standard Google Account.
   - Click **"Get API key"** -> **"Create API key in new project"**.
2. **Add the key to PlantGuard AI**:
   - In the `plantguard-ai` folder, create a `.env` file (or copy `.env.example` to `.env`):
   ```bash
   GEMINI_API_KEY=AIzaSy...YourRealKeyHere...
   ```
3. **Free Tier Limits**:
   - **Rate Limit**: 15 Requests Per Minute (RPM) — ample for personal testing, farming assistance, and portfolio demos.
   - **Cost**: **$0.00** (No credit card required).

---

## 🚀 Running the Application

### 1. Activate Environment
```powershell
# In Windows PowerShell:
.\.venv\Scripts\Activate.ps1
```

### 2. Run Verification Tests
```powershell
.\.venv\Scripts\python.exe test_pipeline.py -v
```

### 3. Start the Server
```powershell
.\.venv\Scripts\python.exe app.py
```
Open your browser and navigate to:
```
http://127.0.0.1:5000
```
