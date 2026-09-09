from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from schemas.curl import CurlGenerateRequest
import json


def generate_curl(request: CurlGenerateRequest) -> str:
    # =========================
    # URLを作成
    # =========================
    if request.protocol:
        url = f"{request.protocol}{request.url}"
    else:
        url = request.url

    # =========================
    # クエリパラメータを追加
    # =========================
    query_parameters = [
        (parameter.key, parameter.value)
        for parameter in request.query_parameters
        if parameter.key
    ]

    if query_parameters:
        parsed_url = urlsplit(url)

        # 既存のクエリパラメータを取得
        existing_parameters = parse_qsl(
            parsed_url.query,
            keep_blank_values=True,
        )

        # 既存 + 新規のクエリパラメータ
        all_parameters = existing_parameters + query_parameters

        # クエリパラメータを再構築
        new_query = urlencode(all_parameters)

        url = urlunsplit(
            (
                parsed_url.scheme,
                parsed_url.netloc,
                parsed_url.path,
                new_query,
                parsed_url.fragment,
            )
        )

    # =========================
    # curlコマンドを作成
    # =========================
    curl_parts = [
        "curl",
        f"-X {request.method}",
        f'"{url}"',
    ]

    # =========================
    # Content-Type
    # =========================
    if request.content_type:
        curl_parts.append(
            f'-H "Content-Type: {request.content_type}"'
        )

    # =========================
    # Accept
    # =========================
    if request.accept:
        curl_parts.append(
            f'-H "Accept: {request.accept}"'
        )

    # =========================
    # Authorization
    # =========================
    if request.authorization_type and request.authorization_value:
        curl_parts.append(
            f'-H "Authorization: {request.authorization_type} '
            f'{request.authorization_value}"'
        )

	# =========================
    # Body
	# =========================
    if request.body:
        body = json.dumps(json.loads(request.body), ensure_ascii=False)
        curl_parts.append(f"-d '{body}'")

    return " ".join(curl_parts)
