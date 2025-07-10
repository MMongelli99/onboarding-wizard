import { createContext } from "react";

export const WizardContext = createContext<{
  userId: number | null;
  setUserId: (v: number) => void;
  wizardStepIndex: number;
  setWizardStepIndex: (v: number) => void;
  // fieldInputValidities: Record<
  //   string, // field name
  //   boolean // validity status
  // >;
  // setFieldInputValidities: (
  //   validities: Record<
  //     string, // field name
  //     boolean // validity status
  //   >,
  // ) => void;
} | null>(null);
