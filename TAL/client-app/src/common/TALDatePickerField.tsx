import React, { ReactNode } from "react";
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { FieldAttributes, useField } from "formik";
import { WrapperVariant } from "@material-ui/pickers/wrappers/Wrapper";
import DateFnsUtils from "@date-io/date-fns";

export type TALDatePickerFieldProps = {
  required?: boolean;
  label: React.ReactNode;
  helperText: React.ReactNode;
  variant?: WrapperVariant;
  pickerProps: Partial<KeyboardDatePickerProps>;
} & FieldAttributes<{}>;

const TALDatePickerField: React.FC<TALDatePickerFieldProps> = ({
  label,
  name,
  disabled,
  required,
  variant = "dialog",
  pickerProps,
  helperText,
}) => {
  const [field, meta, helpers] = useField<Date | null | string>({ name });
  const error = (meta.error && meta.touched) || false;
  const errorText = error ? meta.error : "";
  const footerText = error ? errorText : helperText;

  return (
    <div style={{ padding: 10 }}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          required={required}
          variant={variant}
          name={name}
          format={"yyyy-MM-dd"}
          margin="dense"
          InputLabelProps={{ shrink: true }}
          label={label}
          {...pickerProps}
          helperText={footerText}
          error={error}
          disabled={disabled}
          value={field.name === undefined ? null : field.value}
          onChange={(newValue) => {
            helpers.setValue(newValue);
          }}
          onError={(error: ReactNode) => {
            if (error !== null && error !== errorText && error !== "") {
              helpers.setError(error as string);
            }
          }}
          views={["year", "month", "date"]}
        ></KeyboardDatePicker>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default TALDatePickerField;
