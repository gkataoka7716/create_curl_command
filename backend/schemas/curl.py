from pydantic import BaseModel


class QueryParameter(BaseModel):
    key: str
    value: str


class CurlGenerateRequest(BaseModel):
    method: str
    protocol: str | None = None
    url: str
    query_parameters: list[QueryParameter] | None = None
    content_type: str | None = None
    accept: str | None = None
    authorization_type: str | None = None
    authorization_value: str | None = None
    body: str | None = None
