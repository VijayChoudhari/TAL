import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, FormikContextType } from "formik";
import * as Yup from "yup";
import TALTextField from "./common/TALTextField";
import TALDatePickerField from "./common/TALDatePickerField";
import TALAutoComplete from "./common/TALAutoComplete";
import React from "react";
import TALNumberField from "./common/TALNumberField";
import { Card, CardHeader, FormGroup, IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import { Occupation, PersonalDetail, TALDropDownOption } from "./types";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "25%",
    marginTop: theme.spacing(1),
  },
  reset: {
    width: "60%",
    margin: theme.spacing(3, 0, 2),
  },
  card: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "30%",
  },
  cardHeader: { height: "72px" },
  cardContent: {
    padding: 50,
    marginTop: theme.spacing(2),
  },
}));

const getOccupationOptions = () => {
  const occupations: TALDropDownOption[] = [
    {
      label: "Cleaner",
      value: Occupation.Cleaner,
    },
    {
      label: "Doctor",
      value: Occupation.Doctor,
    },
    {
      label: "Author",
      value: Occupation.Author,
    },
    {
      label: "Farmer",
      value: Occupation.Farmer,
    },
    {
      label: "Mechanic",
      value: Occupation.Mechanic,
    },
    {
      label: "Florist",
      value: Occupation.Florist,
    },
  ];

  return Promise.resolve(occupations);
};

const PersonalDetails: React.FC<{}> = () => {
  const classes = useStyles();
  const [monthlyPremium, setMonthlyPremium] = React.useState<string>();
  const [serverErrorMsg, setServerErrorMsg] = React.useState<string>();

  const initialValues: PersonalDetail = {
    name: "",
    age: undefined,
    dateOfBirth: null,
    deathSumInsured: undefined,
    occupation: undefined,
  };

  const submitOnChange = (formikContext: FormikContextType<unknown>) => {
    formikContext.submitForm();
  };

  const getErrorMessage = () => {
    return serverErrorMsg === ""
      ? "Please enter required details"
      : serverErrorMsg;
  };

  return (
    <div className={classes.paper}>
      <Formik
        initialValues={initialValues}
        validateOnChange={true}
        onSubmit={(values, { setSubmitting }) => {
          const request = {
            name: values.name,
            age: values.age,
            dateOfBirth: values.dateOfBirth,
            deathSumInsured: values.deathSumInsured,
            occupationId: values.occupation?.value,
          };
          fetch("insurancepremimum", {
            method: "post",
            headers: {
              Accept: "application/json, text/plain",
              "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(request),
          })
            .then((response) => response.json())
            .then((data) => {
              setMonthlyPremium("$ " + data);
              setServerErrorMsg("");
            })
            .catch((err) => {
              setServerErrorMsg(err.Message);
            });
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("Name is required"),
          age: Yup.number()
            .required("Age is required")
            .max(80, "Age cannot be greater than 80")
            .min(0, "Age cannot be less than zero"),
          dateOfBirth: Yup.date()
            .nullable()
            .required("Date of birth is required")
            .min("1900-01-01")
            .max(new Date()),
          deathSumInsured: Yup.number().required(
            "Death sum insured is required"
          ),
        })}
      >
        {(props) => {
          return (
            <Card className={classes.card}>
              <CardHeader
                className={classes.cardHeader}
                title={
                  <Typography
                    component="h1"
                    variant="h5"
                    style={{ position: "static" }}
                  >
                    Calculate Monthly Premium
                  </Typography>
                }
                action={
                  props.dirty ? (
                    <React.Fragment>
                      <IconButton aria-label={"Reset"}>
                        <ClearIcon
                          data-testid="reset-btn"
                          type="reset"
                          color="primary"
                          onClick={() => {
                            props.resetForm();
                            setMonthlyPremium(undefined);
                          }}
                        ></ClearIcon>
                      </IconButton>
                    </React.Fragment>
                  ) : (
                    <React.Fragment></React.Fragment>
                  )
                }
              ></CardHeader>
              <FormGroup className={classes.cardContent}>
                <TALTextField
                  name="name"
                  required
                  label={"Name"}
                  helperText={"Enter full name"}
                />
                <TALDatePickerField
                  pickerProps={{
                    autoOk: true,
                    fullWidth: true,
                    maxDate: new Date(),
                  }}
                  required
                  name="dateOfBirth"
                  label={"Date of birth"}
                  placeholder={"Enter Date of birth"}
                  helperText={"Please enter your date of birth here"}
                ></TALDatePickerField>
                <TALNumberField
                  name="age"
                  required
                  label={"Age"}
                  helperText={"Enter age"}
                  placeHolder={"Enter age"}
                />
                <TALNumberField
                  name="deathSumInsured"
                  required
                  label={"Death – Sum Insured"}
                  helperText={"Death – Sum Insured in AUD"}
                  placeHolder={"Enter Death – Sum Insured"}
                  inputType="currency"
                />
                <TALAutoComplete
                  label={"Occupation"}
                  required
                  name={"occupation"}
                  placeHolder={"Select Occupation"}
                  optionFn={getOccupationOptions}
                  helperText={"Select your profession"}
                  disabled={!props.isValid || !props.dirty}
                  submitOnChange={submitOnChange}
                ></TALAutoComplete>
              </FormGroup>
            </Card>
          );
        }}
      </Formik>
      <div style={{ margin: "50px" }}>
        <Typography noWrap variant="body1">
          Calculated monthly premium :{" "}
          {monthlyPremium === undefined ? getErrorMessage() : monthlyPremium}
        </Typography>
      </div>
    </div>
  );
};

export default PersonalDetails;
