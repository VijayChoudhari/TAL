import React from "react";
import { useField, useFormikContext } from "formik";
import FormControl from "@material-ui/core/FormControl";
import { InputProps } from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import { TALTextFieldProps } from "./TALTextField";
import { FormatNumberOptions } from "react-intl";
import NumberFormat from "react-number-format";

export type TALNumberFieldProps = {
  inputType?: "number" | "currency";
  currency?: string;
  formatNumberProps?: FormatNumberOptions;
  inputProps?: Partial<InputProps>;
  placeHolder?: string;
} & TALTextFieldProps;

const TALNumberField: React.FC<TALNumberFieldProps> = ({
  label,
  name,
  disabled,
  required,
  helperText,
  formatNumberProps,
  formControlProps,
  inputType = "number",
  currency = "AUD",
  inputProps,
  placeHolder = "",
}) => {
  const [{ onBlur: onFieldBlur, ...otherFieldProps }, meta] = useField<{}>({
    name,
  });
  const formik = useFormikContext();
  const error = (meta.error && meta.touched) || false;
  const errorText = error ? meta.error : "";
  const footerText = error ? errorText : helperText;

  return (
    <div style={{ padding: 10 }}>
      <FormControl disabled={disabled} fullWidth {...formControlProps}>
        <NumberFormat
          placeholder={placeHolder}
          aria-describedby="standard-weight-helper-text"
          isNumericString={true}
          thousandSeparator={true}
          onValueChange={(val) => formik.setFieldValue(name, val.floatValue)}
          className="input"
        />
        <FormHelperText disabled={disabled} error={error}>
          {footerText}
        </FormHelperText>
      </FormControl>
    </div>
  );
};

export default TALNumberField;
