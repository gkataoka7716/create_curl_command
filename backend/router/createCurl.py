from fastapi import APIRouter, HTTPException

from schemas.curl import CurlGenerateRequest
from service.createCurlService import generate_curl as generate_curl_command

router = APIRouter()


@router.post("/create/curl")
def generate_curl(request: CurlGenerateRequest):
    try:
        response = generate_curl_command(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))