"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();

  const [curlCommand, setCurlCommand] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const command = sessionStorage.getItem("curlCommand");

    if (command) {
      setCurlCommand(command);
    }
  }, []);

  // curlコマンドをコピー
  const handleCopy = async () => {
    if (!curlCommand) {
      return;
    }

    await navigator.clipboard.writeText(curlCommand);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // 前のページに戻る
  const handleBack = () => {
    router.back();
  };

  // 最初からやり直す
  const handleRestart = () => {
    sessionStorage.removeItem("curlCommand");
    sessionStorage.removeItem("curlFormData");
    router.push("/create");
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 text-base">
      {/* タイトル */}
      <header className="mx-auto w-[80%] text-center">
        <div className="mb-4 text-5xl">⌨</div>

        <h1 className="text-4xl font-bold text-gray-900">
          curlコマンド生成結果
        </h1>

        <p className="mt-3 text-base text-gray-500">
          生成されたcurlコマンドをコピーして使用してください
        </p>
      </header>

      {/* 結果 */}
      <div className="mx-auto mt-8 w-[80%] rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* 見出し */}
        <h2 className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3 text-xl font-bold text-gray-800">
          <span className="rounded-full bg-blue-50 px-3 py-2 text-blue-600">
            &lt;/&gt;
          </span>
          生成結果
        </h2>

        {/* curlコマンド */}
        <div className="relative">
          <pre className="min-h-[120px] overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-gray-900 p-6 pr-28 font-mono text-sm leading-7 text-white">
            {curlCommand || "curlコマンドがありません"}
          </pre>

          {/* コピー */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!curlCommand}
            className="absolute right-3 top-3 rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? "✓ コピーしました" : "コピー"}
          </button>
        </div>

        {/* 補足 */}
        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-gray-600">
          <span className="mr-2 text-lg">💡</span>
          このcurlコマンドをコピーして、ターミナルなどで実行できます。
        </div>

        {/* ボタン */}
        <div className="mt-8 flex justify-center gap-4">
          {/* 戻る */}
          <button
            type="button"
            onClick={handleBack}
            className="rounded-lg border border-gray-300 bg-white px-8 py-3 font-bold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            ↩ 戻る
          </button>

          {/* 初めからやり直す */}
          <button
            type="button"
            onClick={handleRestart}
            className="rounded-lg bg-blue-600 px-8 py-3 font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            ↻ 初めからやり直す
          </button>
        </div>
      </div>
    </main>
  );
}
