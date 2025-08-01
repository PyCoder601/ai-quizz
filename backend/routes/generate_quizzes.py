import json
import os
import re
from typing import Any
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import UploadFile, HTTPException
import fitz  # PyMuPDF

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
client = genai.GenerativeModel(model_name="gemini-1.5-flash")

MAX_FILE_SIZE = 15 * 1024 * 1024  # 15 MB


def generate_quiz_from_text_with_ai(
    text_content: str, difficulty: str, n: int
) -> dict[str, Any]:
    system_prompt = f"""
En te basant sur le texte suivant :
---
{text_content}
---
Génère {n} questions de quiz avec une difficulté "{difficulty}".
Le format de chaque question doit être le suivant (en JSON) :
{{
  "question": "Titre de la question",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct_option": 0,
  "point": 2 (dépend du difficulté de chaque question) ,
  "explanation": "Explication détaillée de la bonne réponse"
}}

- Assure-toi que chaque question a exactement 4 options.
- La bonne réponse doit correspondre à l’index correct_answer_id.
- Le point est un nombre entier positif.
- L’explication doit être claire et pédagogique.
- La sortie doit être un tableau JSON uniquement contenant tous les objets question.
""".strip()
    try:
        response = client.generate_content(system_prompt)
        raw_text = response.text.strip()

        cleaned_text = re.sub(
            r"^```json\s*|\s*```$", "", raw_text, flags=re.DOTALL
        ).strip()

        cleaned_text = cleaned_text.replace("\xa0", " ")

        try:
            quizzes = json.loads(cleaned_text)
            return {"quizzes": quizzes}
        except json.JSONDecodeError as e:
            return {"error": f"Erreur JSON: {str(e)}", "raw_text": cleaned_text}
    except Exception as e:
        print(e)
        return {"error": str(e)}


async def extract_text_from_pdf(file: UploadFile) -> str:
    if file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Le fichier PDF est trop volumineux. La limite est de 5 Mo.",
        )

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Type de fichier invalide. Seuls les PDF sont acceptés.",
        )

    try:
        pdf_content = await file.read()
        doc = fitz.open(stream=pdf_content, filetype="pdf")
        text_content = ""
        for page in doc:
            text_content += page.get_text()
        doc.close()

        if not text_content.strip():
            raise HTTPException(
                status_code=400, detail="Le PDF ne contient aucun texte extractible."
            )

        return text_content
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erreur lors du traitement du PDF: {str(e)}"
        )
