import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

_client = None

def get_groq_client():
    global _client
    if _client is None:
        _client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    return _client

def generate_answer_groq(question: str, context: str, model: str = "llama-3.1-8b-instant") -> str:
    """
    Generate a context-aware answer using Groq API.
    """
    try:
        client = get_groq_client()
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that answers questions based on the provided context.",
                },
                {
                    "role": "user",
                    "content": f"Context:\n{context}\n\nQuestion:\n{question}\n\nAnswer:",
                },
            ],
            model=model,
        )
        return chat_completion.choices[0].message.content.strip()
    except Exception as e:
        return f"Error from Groq: {str(e)}"
