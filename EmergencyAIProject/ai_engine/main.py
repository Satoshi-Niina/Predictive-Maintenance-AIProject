from fastapi import FastAPI
from pydantic import BaseModel
from predict_response import generate_response

app = FastAPI()

class Query(BaseModel):
    query: str

@app.post("/predict")
def predict(query: Query):
    answer = generate_response(query.query)
    return {"answer": answer}
