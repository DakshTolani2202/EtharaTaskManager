const Input = ({ label, error, className = "", ...rest }) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-300">{label}</label>
    )}
    <input className={`input ${className}`} {...rest} />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

export default Input;
