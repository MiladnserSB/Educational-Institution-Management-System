import { forwardRef, useId } from "react";
import { classNames, normalizeOptions } from "../../utils";

const Input = forwardRef(function Input(
  {
    label,
    id,
    name,
    error,
    hint,
    prefix,
    suffix,
    className = "",
    wrapperClassName = "",
    as = "input",
    options = [],
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const fieldId = id || name || generatedId;
  const { "aria-describedby": externalDescribedBy, ...inputProps } = props;
  const describedBy =
    [
      externalDescribedBy,
      error && `${fieldId}-error`,
      !error && hint && `${fieldId}-hint`,
    ]
      .filter(Boolean)
      .join(" ") || undefined;
  const common = {
    id: fieldId,
    name,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
    className: classNames("ui-input", error && "ui-input--error", className),
    ref,
    ...inputProps,
  };
  return (
    <div className={classNames("ui-field", wrapperClassName)}>
      {label && (
        <label className="ui-label" htmlFor={fieldId}>
          {label}
          {props.required && <span className="ui-required"> *</span>}
        </label>
      )}
      <div
        className={classNames(
          "ui-input-wrap",
          (prefix || suffix) && "ui-input-wrap--affix",
        )}
      >
        {prefix && <span className="ui-input-affix">{prefix}</span>}
        {as === "select" ? (
          <select {...common}>
            {normalizeOptions(options).map((option, index) => (
              <option
                key={option.value || `${option.label}-${index}`}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        ) : as === "textarea" ? (
          <textarea {...common} />
        ) : (
          <input {...common} />
        )}
        {suffix && <span className="ui-input-affix">{suffix}</span>}
      </div>
      {error && (
        <p className="ui-field-error" id={`${fieldId}-error`}>
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="ui-field-hint" id={`${fieldId}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
