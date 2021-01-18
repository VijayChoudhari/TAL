import React, { useEffect, useState } from "react";
import { Field, FormikContextType, useFormikContext } from "formik";
import { TextField, CircularProgress, FormHelperText } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TALDropDownOption } from "../types";

export type TALAutoCompleteProps = {
  required?: boolean;
  label: string;
  name: string;
  placeHolder?: string;
  helperText?: string;
  disabled?: boolean;
  optionFn: () => Promise<TALDropDownOption[]>;
  submitOnChange: (formikContext: FormikContextType<unknown>) => void;
};

const TALAutoComplete: React.FC<TALAutoCompleteProps> = ({
  required,
  label,
  name,
  placeHolder,
  disabled,
  optionFn,
  submitOnChange,
}) => {
  const formik = useFormikContext();
  const fieldMeta = formik.getFieldMeta(name);
  const actualFieldProps = formik.getFieldProps(name);
  const error = (fieldMeta.error && fieldMeta.touched) || false;
  const errorText = fieldMeta.error && fieldMeta.touched ? fieldMeta.error : "";
  const footerText = error ? errorText : FormHelperText;
  const [open, setOpen] = useState(false);
  const [optionsAvailable, setOptionAvilable] = useState(false);
  const [asyncDropdown, setAsyncDropdown] = useState<{
    isLoading: boolean;
    data: TALDropDownOption[];
  }>({ isLoading: false, data: [] as TALDropDownOption[] });
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (open === true && optionsAvailable === false) {
      setAsyncDropdown({
        ...asyncDropdown,
        isLoading: false,
      });

      optionFn()
        .then((result) => {
          const data = result.map<TALDropDownOption>((t) => ({
            label: t.label,
            value: t.value,
          }));
          setAsyncDropdown({
            isLoading: false,
            data: data,
          });
          setOptionAvilable(false);
        })
        .catch((e) => {
          setAsyncDropdown({
            ...asyncDropdown,
            data: [] as TALDropDownOption[],
            isLoading: false,
          });
          setOptionAvilable(false);
        });
    }
  }, [open, optionFn, optionsAvailable]);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setInputValue(input);
  };

  const valueChange = (e: React.ChangeEvent<{}>, newValue: any) => {
    formik.setFieldValue(name, newValue === null ? undefined : newValue);

    if (formik.isValid) {
      submitOnChange(formik);
    }
  };

  return (
    <div style={{ padding: 10 }}>
      <Field name={name}>
        {() => {
          return (
            <Autocomplete
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              getOptionLabel={(option: TALDropDownOption) => {
                return option.label as string;
              }}
              disabled={disabled}
              options={asyncDropdown.data}
              loading={asyncDropdown.isLoading}
              value={
                actualFieldProps.value === undefined
                  ? null
                  : actualFieldProps.value
              }
              onChange={valueChange}
              renderInput={(params) => (
                <TextField
                  required={required}
                  {...params}
                  onChange={inputChange}
                  label={label}
                  placeholder={placeHolder}
                  helperText={"Help Text"}
                  error={error}
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {asyncDropdown.isLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                ></TextField>
              )}
            />
          );
        }}
      </Field>
    </div>
  );
};

export default TALAutoComplete;
