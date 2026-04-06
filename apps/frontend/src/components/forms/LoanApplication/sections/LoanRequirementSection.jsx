import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { IndianRupee } from "lucide-react";

import InputField from "../../../ui/InputField";
import SelectField from "../../../ui/SelectField";
import { SectionCard, Grid } from "../sharedFields";

const INTEREST_OPTIONS = [
  { value: "FIXED", label: "Fixed" },
  { value: "VARIABLE", label: "Variable" },
];

const REST_FREQ_OPTIONS = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "HALF_YEARLY", label: "Half-Yearly" },
  { value: "YEARLY", label: "Yearly" },
];

const LOAN_PURPOSE_OPTIONS = [
  { value: "HOME", label: "Home Purchase" },
  { value: "HOME_IMPROVEMENT", label: "Home Improvement" },
  { value: "LAND_PURCHASE", label: "Land Purchase" },
  { value: "NRPL", label: "NRPL" },
  { value: "POST_DATED_CHEQUE", label: "Post Dated Cheque" },
  { value: "STANDING_INSTRUCTION", label: "Standing Instruction" },
];

export default function LoanRequirementSection({
  control,
  errors,
  watch,
  setValue,
  loanTypeOptions = [],
}) {
  const costs = watch([
    "loanRequirement.landCost",
    "loanRequirement.agreementValue",
    "loanRequirement.amenitiesAgreement",
    "loanRequirement.stampDuty",
    "loanRequirement.constructionCost",
    "loanRequirement.incidental",
  ]);

  const funds = watch([
    "loanRequirement.amountSpent",
    "loanRequirement.balanceFundSaving",
    "loanRequirement.balanceFundDisposal",
    "loanRequirement.balanceFundFamily",
    "loanRequirement.balanceFundOther",
  ]);

  useEffect(() => {
    setValue(
      "loanRequirement.totalRequirement",
      costs.reduce((s, v) => s + (Number(v) || 0), 0),
    );
  }, [costs, setValue]);

  useEffect(() => {
    setValue(
      "loanRequirement.totalBalanceFund",
      funds.reduce((s, v) => s + (Number(v) || 0), 0),
    );
  }, [funds, setValue]);

  const loanPurpose = watch("loanRequirement.loanPurpose");

  return (
    <div>
      <SectionCard title="Loan Requirement Details" icon={IndianRupee}>
        <div className="space-y-4">
          <Controller
            name="loanRequirement.restFrequency"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Rest Frequency"
                options={REST_FREQ_OPTIONS}
                {...field}
              />
            )}
          />

          <Controller
            name="loanRequirement.interestOption"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Interest Option"
                isRequired
                options={INTEREST_OPTIONS}
                {...field}
              />
            )}
          />

          <Grid>
            <Controller
              name="loanRequirement.tenure"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Tenure of Loan (Month/Years)"
                  isRequired
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  error={errors.loanRequirement?.tenure?.message}
                />
              )}
            />

            <Controller
              name="loanRequirement.loanAmount"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Loan Required (₹)"
                  type="number"
                  isRequired
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  error={errors.loanRequirement?.loanAmount?.message}
                />
              )}
            />
          </Grid>

          <Controller
            name="loanRequirement.loanPurpose"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Purpose of Loan"
                isRequired
                options={LOAN_PURPOSE_OPTIONS}
                value={field.value || ""}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />

          <Controller
            name="loanTypeId"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Loan Type"
                isRequired
                options={loanTypeOptions}
                value={field.value || ""}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />

          {loanPurpose === "OTHER" && (
            <Controller
              name="loanRequirement.loanPurposeOther"
              control={control}
              render={({ field }) => (
                <InputField label="Specify Other Purpose" {...field} />
              )}
            />
          )}

          <Controller
            name="loanRequirement.repaymentMethod"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Payment Method"
                isRequired
                options={[
                  { value: "SALARY_DEDUCTION", label: "Salary Deduction" },
                  { value: "CHEQUE", label: "Post Dated Cheque" },
                  { value: "ECS", label: "ECS" },
                ]}
                {...field}
              />
            )}
          />
        </div>
      </SectionCard>
    </div>
  );
}
