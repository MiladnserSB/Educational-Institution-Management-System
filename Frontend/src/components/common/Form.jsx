import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import {
  classNames,
  getFieldElementType,
  getInitialFormValues,
  validateFormValues,
} from "../../utils";

const Form = ({
  fields = [],
  initialValues = {},
  values: controlledValues,
  onValuesChange,
  onSubmit,
  submitLabel = "Save",
  cancelLabel,
  onCancel,
  columns = 2,
  className = "",
  validate,
  requiredMessage,
  ...formProps
}) => {
  const [internalValues, setInternalValues] = useState(() =>
    getInitialFormValues(fields, initialValues),
  );
  const values = controlledValues ?? internalValues;
  const isControlled = controlledValues !== undefined;
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const change = (name, value) => {
    const nextValues = { ...values, [name]: value };
    if (!isControlled) setInternalValues(nextValues);
    onValuesChange?.(nextValues);
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateFormValues(
      values,
      fields,
      validate,
      requiredMessage,
    );
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    try {
      await onSubmit?.(values);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className={classNames(
        "ui-form",
        `ui-form--columns-${columns}`,
        className,
      )}
      {...formProps}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="ui-form-grid">
        {fields.map((field) => {
          // Field-schema-only keys must not reach the DOM <input>.
          const {
            render,
            fullWidth,
            validate: fieldValidate,
            requiredMessage: fieldRequiredMessage,
            ...inputField
          } = field;

          return (
            <div
              key={field.name}
              className={fullWidth ? "ui-form-field--full" : ""}
            >
              {render ? (
                render({
                  field,
                  value: values[field.name] ?? "",
                  error: errors[field.name],
                  onChange: (value) => change(field.name, value),
                })
              ) : (
                <Input
                  {...inputField}
                  value={values[field.name] ?? ""}
                  checked={
                    field.type === "checkbox"
                      ? Boolean(values[field.name])
                      : undefined
                  }
                  onChange={(event) =>
                    change(
                      field.name,
                      field.type === "checkbox"
                        ? event.target.checked
                        : event.target.value,
                    )
                  }
                  error={errors[field.name]}
                  as={getFieldElementType(field)}
                  options={field.options || []}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="ui-form-actions">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel || "Cancel"}
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default Form;
