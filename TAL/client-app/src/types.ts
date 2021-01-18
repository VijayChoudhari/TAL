export enum Occupation {
  Cleaner = 1,
  Doctor,
  Author,
  Farmer,
  Mechanic,
  Florist,
}

export type TALDropDownOption = {
  label: string;
  value: string | number;
};

export type PersonalDetail = {
  name: string | undefined;
  age: number | undefined;
  dateOfBirth: Date | null;
  deathSumInsured: number | undefined;
  occupation: TALDropDownOption | undefined;
};
