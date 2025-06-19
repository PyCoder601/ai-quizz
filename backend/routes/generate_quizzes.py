import json
import os
import re
from typing import Any
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
client = genai.GenerativeModel(model_name="gemini-1.5-flash")


def generate_challenge_with_ai(topic: str, difficulty: str, n: int) -> dict[str, Any]:
    system_prompt = f"""
Génère {n} questions de quiz sur {topic} avec une difficulté "{difficulty}". 
Le format de chaque question doit être le suivant (en JSON) :
{{
  "question": "Titre de la question",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct_option": 0,
  "point": 2,
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
        return {"error": str(e)}
