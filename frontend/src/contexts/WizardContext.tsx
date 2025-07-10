import { createContext } from "react";

export type FieldInputValidities = Record<
  string, // field name
  boolean // validity status
>;

export const WizardContext = createContext<{
  userId: number | null;
  setUserId: (v: number) => void;
  wizardStepIndex: number;
  setWizardStepIndex: (v: number) => void;
  fieldInputValidities: FieldInputValidities;
  setFieldInputValidities: (validities: FieldInputValidities) => void;
} | null>(null);
