import { createContext } from "react";

export type FieldInputValidities = Record<
  string, // field name
  boolean // validity status
>;

export type FieldInputValues = Record<string, string>;

export const WizardContext = createContext<{
  userId: number | null;
  setUserId: (v: number) => void;
  wizardStepIndex: number | null;
  setWizardStepIndex: (v: number) => void;
  fieldInputValues: FieldInputValues;
  setFieldInputValues: (values: FieldInputValues) => void;
  fieldInputValidities: FieldInputValidities;
  setFieldInputValidities: (validities: FieldInputValidities) => void;
} | null>(null);
