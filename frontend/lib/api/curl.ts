import type { QueryParameter } from "@/components/queryParameter";

type CurlGenerateRequest = {
  method: string;
  protocol: string;
  url: string;
  query_parameters: QueryParameter[];
  content_type: string;
  accept: string;
  authorization_type: string;
  authorization_value: string;
};

export async function generateCurl(
  request: CurlGenerateRequest,
): Promise<string> {
  const response = await fetch("http://localhost:8000/create/curl", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("curlコマンドの生成に失敗しました");
  }

  return response.json();
}
