"use client";

type SelectProps = {
  options: Record<string, string>;
  value: string;
  onChange: (value: string) => void;
};

export default function Select({ options, value, onChange }: SelectProps) {
  return (
    <div className="relative h-full w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full appearance-none rounded-lg bg-white px-3 pr-10 text-base text-gray-900 outline-none transition focus:ring-2 focus:ring-blue-100"
      >
        {Object.entries(options).map(([label, value]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-b-2 border-r-2 border-gray-700"
      />
    </div>
  );
}
