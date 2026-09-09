"use client";

type QueryParameter = {
  key: string;
  value: string;
};

type Props = {
  parameters: QueryParameter[];
  setParameters: React.Dispatch<React.SetStateAction<QueryParameter[]>>;
};

export default function QueryParameters({ parameters, setParameters }: Props) {
  // =========================
  // パラメータ変更
  // =========================

  const handleChange = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    setParameters((prev) =>
      prev.map((parameter, i) =>
        i === index
          ? {
              ...parameter,
              [field]: value,
            }
          : parameter,
      ),
    );
  };

  // =========================
  // パラメータ追加
  // =========================

  const handleAdd = () => {
    setParameters((prev) => [
      ...prev,
      {
        key: "",
        value: "",
      },
    ]);
  };

  // =========================
  // パラメータ削除
  // =========================

  const handleDelete = (index: number) => {
    setParameters((prev) => {
      // 1行しかない場合は空行を残す
      if (prev.length === 1) {
        return [
          {
            key: "",
            value: "",
          },
        ];
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="space-y-3">
      {/* パラメータ一覧 */}

      {parameters.map((parameter, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]"
        >
          {/* Key */}

          <input
            type="text"
            value={parameter.key}
            onChange={(e) => handleChange(index, "key", e.target.value)}
            placeholder="キー"
            className="h-11 rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {/* Value */}

          <input
            type="text"
            value={parameter.value}
            onChange={(e) => handleChange(index, "value", e.target.value)}
            placeholder="値"
            className="h-11 rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {/* 削除 */}

          <button
            type="button"
            onClick={() => handleDelete(index)}
            className="h-11 rounded-lg border border-red-300 bg-white px-4 font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            削除
          </button>
        </div>
      ))}

      {/* パラメータ追加 */}

      <div className="pt-2">
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg border border-blue-300 bg-white px-5 py-2 font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          ＋ パラメータを追加
        </button>
      </div>
    </div>
  );
}
