import os

LLM_CONFIG = {
    "primary": os.getenv("LLM_PRIMARY_PROVIDER", "groq"),
    "fallback_chain": ["groq", "openai", "anthropic", "gemini"],
    "temperature": 0.1,
    "max_tokens": 900,
    "providers": {
        "gemini": {
            "model": "gemini-3.8-flash",
            "base_url": "https://generativelanguage.googleapis.com/v1beta/openai/",
            "api_key_env": "GEMINI_API_KEY"
        },
        "groq": {
            "model": "llama3-8b-8192",
            "base_url": "https://api.groq.com/openai/v1",
            "api_key_env": "GROQ_API_KEY"
        },
    }
}
