import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from openai import AsyncOpenAI

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4321"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

# ---------------------------------------------------------
# Data Parsing Logic
# ---------------------------------------------------------
def load_portfolio_context():
    projects_dir = Path("../src/pages/projects")
    context_parts = []
    
    if not projects_dir.exists():
        return "No portfolio context available."

    for filepath in projects_dir.glob("**/*.*"):
        if filepath.suffix in ['.md', '.mdx']:
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
                filename = filepath.name
                context_parts.append(f"--- Project Document: {filename} ---\n{content}\n")
    
    return "\n".join(context_parts)

PORTFOLIO_CONTEXT = load_portfolio_context()

# ---------------------------------------------------------
# AI Client Setup
# ---------------------------------------------------------
# PASTE YOUR KEY HERE (In a production environment, you'd use a .env file for this)
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

# We use the OpenAI client, but point the base_url to OpenRouter
client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

# ---------------------------------------------------------
# The API Endpoint
# ---------------------------------------------------------
@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    print(f"Incoming message: {request.message}")
    
    # This is the "System Prompt" that tells the AI who it is and gives it your data
    system_prompt = f"""
    You are a helpful AI assistant for Gilberto Romero-Cano's portfolio website. 
    Your job is to answer questions about his projects, skills, and background using ONLY the context provided below.
    If the answer is not in the context, politely say you don't have that specific information but encourage them to reach out to Gilberto directly.
    Keep your answers concise, professional, and friendly.
    
    CONTEXT:
    {PORTFOLIO_CONTEXT}
    """

    try:
        # Send the request to OpenRouter using a free LFM or Llama model
        response = await client.chat.completions.create(
            model="liquid/lfm-2.5-1.2b-thinking:free", # You can swap this string for other free models on OpenRouter
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ],
        )
        
        reply_text = response.choices[0].message.content
        return {"reply": reply_text}
        
    except Exception as e:
        print(f"API Error: {e}")
        return {"reply": "Sorry, I ran into an error connecting to my brain. Please try again!"}