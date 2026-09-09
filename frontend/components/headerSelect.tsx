import Select from "./select";

type Header = {
  name: string;
  values: string[];
};

type HeaderSelectProps = {
  header: Header;
  value: string;
  onChange: (value: string) => void;
};

export function HeaderSelect({ header, value, onChange }: HeaderSelectProps) {
  return (
    <div>
      <label>{header.name}</label>

      <div className="h-11 rounded-lg border border-gray-300 bg-white">
        <Select
          options={Object.fromEntries([
            ["", "未選択"],
            ...header.values.map((item) => [item, item]),
          ])}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
