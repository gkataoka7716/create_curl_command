"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import methods from "@/config/method.json";
import http from "@/config/http.json";
import content from "@/config/content.json";
import accept from "@/config/accept.json";
import authorization from "@/config/auth.json";

import Select from "@/components/select";
import QueryParameters from "@/components/queryParameter";
import { generateCurl } from "@/lib/api/curl";

type QueryParameter = {
  key: string;
  value: string;
};

export default function CreatePage() {
  const router = useRouter();

  // =========================
  // State
  // =========================

  const [method, setMethod] = useState("POST");
  const [httpVersion, setHttpVersion] = useState("");
  const [contentType, setContentType] = useState("");
  const [acceptType, setAcceptType] = useState("");
  const [authorizationType, setAuthorizationType] = useState("");
  const [authorizationValue, setAuthorizationValue] = useState("");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [queryParameters, setQueryParameters] = useState<QueryParameter[]>([
    {
      key: "",
      value: "",
    },
  ]);

  // =========================
  // sessionStorageから入力内容を復元
  // =========================

  useEffect(() => {
    const savedData = sessionStorage.getItem("curlFormData");

    if (!savedData) {
      return;
    }

    try {
      const data = JSON.parse(savedData);

      setMethod(data.method ?? "POST");
      setHttpVersion(data.httpVersion ?? "");
      setContentType(data.contentType ?? "");
      setAcceptType(data.acceptType ?? "");
      setAuthorizationType(data.authorizationType ?? "");
      setAuthorizationValue(data.authorizationValue ?? "");
      setUrl(data.url ?? "");
      setBody(data.body ?? "");

      setQueryParameters(
        data.queryParameters ?? [
          {
            key: "",
            value: "",
          },
        ],
      );
    } catch (error) {
      console.error("フォームデータの復元に失敗しました", error);
    }
  }, []);

  // =========================
  // curl生成
  // =========================

  const handleGenerateCurl = async () => {
    setErrorMessage("");
    const request = {
      method,
      protocol: httpVersion,
      url,
      query_parameters: queryParameters,
      content_type: contentType,
      accept: acceptType,
      authorization_type: authorizationType,
      authorization_value: authorizationValue,
      body,
    };

    try {
      const result = await generateCurl(request);

      // =========================
      // 入力内容を保存
      // =========================

      sessionStorage.setItem(
        "curlFormData",
        JSON.stringify({
          method,
          httpVersion,
          contentType,
          acceptType,
          authorizationType,
          authorizationValue,
          url,
          body,
          queryParameters,
        }),
      );

      // =========================
      // 生成されたcurlを保存
      // =========================

      sessionStorage.setItem("curlCommand", result);

      router.push("/result");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "curlコマンドの生成に失敗しました。入力内容を確認してください。",
      );
    }
  };

  // =========================
  // すべてリセット
  // =========================

  const handleReset = () => {
    const confirmed = window.confirm("入力した内容をすべてリセットしますか？");

    if (!confirmed) {
      return;
    }

    // Stateを初期値に戻す
    setMethod("POST");
    setHttpVersion("");
    setContentType("");
    setAcceptType("");
    setAuthorizationType("");
    setAuthorizationValue("");
    setUrl("");
    setBody("");

    setQueryParameters([
      {
        key: "",
        value: "",
      },
    ]);

    // sessionStorageも削除
    sessionStorage.removeItem("curlFormData");
    sessionStorage.removeItem("curlCommand");
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 text-base">
      {/* タイトル */}

      <header className="mx-auto w-[80%]">
        <h1 className="bg-white text-center text-4xl font-bold text-gray-900">
          curlコマンド生成
        </h1>

        <p className="mt-3 text-center text-base text-gray-500">
          APIリクエストに必要な情報を入力してください
        </p>
      </header>

      {/* メインフォーム */}

      <div className="mx-auto mt-8 w-[80%] rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* リクエスト= */}

        <section>
          <h2 className="mb-4 border-b border-gray-200 pb-3 text-xl font-bold text-gray-800">
            リクエスト
          </h2>

          <div className="ml-2 w-[200px]">
            <label className="mb-2 block font-semibold text-gray-700">
              HTTPメソッド
            </label>

            <div className="h-11 rounded-lg border border-gray-300 bg-white">
              <Select options={methods} value={method} onChange={setMethod} />
            </div>
          </div>
        </section>

        {/* URL */}

        <section className="mt-8">
          <h2 className="mb-4 border-b border-gray-200 pb-3 text-xl font-bold text-gray-800">
            URL
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
            {/* プロトコル */}

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                プロトコル
              </label>

              <div className="h-11 rounded-lg border border-gray-300 bg-white">
                <Select
                  options={http}
                  value={httpVersion}
                  onChange={setHttpVersion}
                />
              </div>
            </div>

            {/* URL */}

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                URL
              </label>

              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={
                  httpVersion !== ""
                    ? "HTTP以降のURLを入力してください"
                    : "URLを入力してください"
                }
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </section>

        {/* =========================
            クエリーパラメータ
        ========================= */}

        <section className="mt-8">
          <h2 className="mb-4 border-b border-gray-200 pb-3 text-xl font-bold text-gray-800">
            クエリーパラメータ
          </h2>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <QueryParameters
              parameters={queryParameters}
              setParameters={setQueryParameters}
            />
          </div>
        </section>

        {/* =========================
            ヘッダー
        ========================= */}

        <section className="mt-8">
          <h2 className="mb-4 border-b border-gray-200 pb-3 text-xl font-bold text-gray-800">
            ヘッダー
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Content-Type */}

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Content-Type
              </label>

              <div className="h-11 rounded-lg border border-gray-300 bg-white">
                <Select
                  options={content}
                  value={contentType}
                  onChange={setContentType}
                />
              </div>
            </div>

            {/* Accept */}

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Accept
              </label>

              <div className="h-11 rounded-lg border border-gray-300 bg-white">
                <Select
                  options={accept}
                  value={acceptType}
                  onChange={setAcceptType}
                />
              </div>
            </div>

            {/* Authorization */}

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Authorization
              </label>

              <div className="h-11 rounded-lg border border-gray-300 bg-white">
                <Select
                  options={authorization}
                  value={authorizationType}
                  onChange={setAuthorizationType}
                />
              </div>
            </div>

            {/* Authorization Value */}

            {authorizationType !== "" && (
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Authorization Value
                </label>

                <input
                  type="text"
                  value={authorizationValue}
                  onChange={(e) => setAuthorizationValue(e.target.value)}
                  placeholder="Authorizationの値を入力してください"
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}
          </div>
        </section>

        {/* =========================
            Body
        ========================= */}

        <section className="mt-8">
          <h2 className="mb-4 border-b border-gray-200 pb-3 text-xl font-bold text-gray-800">
            Body
          </h2>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              リクエストボディ
            </label>

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={`{
  "name": "田中太郎",
  "email": "tanaka@example.com"
}`}
              rows={10}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </section>

        {/* =========================
            ボタン
        ========================= */}

        {/* エラーメッセージ */}
        {errorMessage && (
          <div className="mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
            {errorMessage}
          </div>
        )}

        {/* ボタン */}
        <div className="mt-10 flex justify-center gap-4">
          {/* リセット */}
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-base font-bold text-gray-700 shadow-sm transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            すべてリセット
          </button>

          {/* curl生成 */}
          <button
            type="button"
            onClick={handleGenerateCurl}
            className="rounded-lg bg-blue-600 px-8 py-3 text-base font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            curlコマンドを生成
          </button>
        </div>
      </div>
    </main>
  );
}
