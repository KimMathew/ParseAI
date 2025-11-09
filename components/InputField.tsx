interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  helperLink?: {
    text: string;
    href: string;
  };
}

export default function InputField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  helperLink,
}: InputFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="block text-sm font-medium">
          {label}
        </label>
        {helperLink && (
          <a
            href={helperLink.href}
            className="text-sm text-[#6366F1] hover:text-[#6366F1]/80 transition-colors"
          >
            {helperLink.text}
          </a>
        )}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/30 transition-all duration-200"
        placeholder={placeholder}
      />
    </div>
  );
}
