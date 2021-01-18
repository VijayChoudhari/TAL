import React from "react";
import { FieldAttributes, useField } from "formik";
import FormControl, { FormControlTypeMap } from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input, { InputProps } from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";

export type TALTextFieldProps = {
  label: React.ReactNode;
  helperText: React.ReactNode;
  formControlProps?: Partial<
    OverridableComponent<FormControlTypeMap<{}, "div">>
  >;
  inputProps?: Partial<InputProps>;
} & FieldAttributes<{}>;

const TALTextField: React.FC<TALTextFieldProps> = ({
  label,
  name,
  disabled,
  required,
  helperText,
  formControlProps,
  inputProps,
}) => {
  const [field, meta] = useField<{}>({ name });
  const error = (meta.error && meta.touched) || false;
  const errorText = error ? meta.error : "";
  const footerText = error ? errorText : helperText;

  return (
    <div style={{ padding: 10 }}>
      <FormControl disabled={disabled} fullWidth {...formControlProps}>
        <InputLabel
          shrink
          disabled={disabled}
          required={required}
          error={error}
        >
          {label}
        </InputLabel>
        <Input
          {...inputProps}
          {...field}
          name={name}
          id={`${name}-input`}
          fullWidth
          autoComplete="off"
          error={error}
          disabled={disabled}
          value={field.value === undefined ? "" : field.value}
        ></Input>
        <FormHelperText disabled={disabled} error={error}>
          {footerText}
        </FormHelperText>
      </FormControl>
    </div>
  );
};

export default TALTextField;
