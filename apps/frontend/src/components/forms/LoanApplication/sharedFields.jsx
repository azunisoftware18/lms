import React, { useCallback, useEffect } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { Check, Briefcase, Plus, Trash2 } from "lucide-react";

import Button from "../../ui/Button";
import InputField from "../../ui/InputField";
import SelectField from "../../ui/SelectField";
import { showSuccess, showError } from "../../../lib/utils/toastService";
import {
  TITLE_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_OPTIONS,
  EMPLOYMENT_OPTIONS,
  CATEGORY_OPTIONS,
  ACCOMMODATION_OPTIONS,
  RELATION_OPTIONS,
  CORRESPONDENCE_OPTIONS,
  SALARIED_WORKING_FOR,
  PROFESSIONAL_OPTIONS,
  BUSINESS_OPTIONS,
  INDIAN_STATES,
} from "./constants";

export const SectionCard = React.memo(({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 mb-6">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-200">
        {Icon && <Icon size={18} className="text-slate-600 shrink-0" />}
        <h3 className="font-semibold text-sm text-slate-700 tracking-normal">
          {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
});

export const Grid = React.memo(({ cols = 2, children }) => (
  <div
    className={`grid grid-cols-1 gap-4 ${cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : ""}`}
  >
    {children}
  </div>
));

export const Divider = React.memo(({ label }) => (
  <div className="flex items-center gap-3 my-5">
    <div className="flex-1 h-px bg-slate-100" />
    {label && (
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        {label}
      </span>
    )}
    <div className="flex-1 h-px bg-slate-100" />
  </div>
));

const RadioGroup = React.memo(({ label }) => {
  return (
    <div>
      {label && (
        <p className="text-xs font-semibold text-slate-600 mb-2">{label}</p>
      )}
    </div>
  );
});

export const PersonPersonalFields = ({ control, prefix, watch, setValue }) => {
  const presentAccommodation = watch(`${prefix}.presentAccommodation`);
  const accommodationType = watch(`${prefix}.accommodationType`);
  const sameAddress = watch(`${prefix}.sameAsCurrent`) ?? false;
  const isCoApplicant = prefix.startsWith("coApplicants.");
  const isGuarantor = prefix.startsWith("guarantors.");

  const copyCurrentAddress = useCallback(() => {
    [
      "addressLine1",
      "addressLine2",
      "city",
      "district",
      "state",
      "pinCode",
      "landmark",
      "phoneWithStd",
    ].forEach((fieldName) => {
      setValue(
        `${prefix}.permanentAddress.${fieldName}`,
        watch(`${prefix}.currentAddress.${fieldName}`) || "",
      );
    });
  }, [prefix, setValue, watch]);

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Fields marked <span className="text-red-500">*</span> are required.
      </p>
      <Grid cols={3}>
        <Controller
          name={`${prefix}.firstName`}
          control={control}
          render={({ field }) => (
            <InputField label="First Name" isRequired {...field} />
          )}
        />
        <Controller
          name={`${prefix}.middleName`}
          control={control}
          render={({ field }) => <InputField label="Middle Name" {...field} />}
        />
        <Controller
          name={`${prefix}.lastName`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Last Name"
              isRequired={isCoApplicant || isGuarantor}
              {...field}
            />
          )}
        />
      </Grid>

      <Grid cols={3}>
        <Controller
          name={`${prefix}.fatherName`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Father's Name"
              isRequired={isCoApplicant || isGuarantor}
              {...field}
            />
          )}
        />
        <Controller
          name={`${prefix}.motherName`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Mother's Name"
              isRequired={isCoApplicant || isGuarantor}
              {...field}
            />
          )}
        />
        <Controller
          name={`${prefix}.woname`}
          control={control}
          render={({ field }) => <InputField label="W/o" {...field} />}
        />
      </Grid>

      <Grid cols={3}>
        <Controller
          name={`${prefix}.qualification`}
          control={control}
          render={({ field }) => (
            <SelectField
              label="Qualification"
              isRequired={false}
              options={[
                { value: "MATRIC", label: "Matriculation" },
                { value: "INTERMEDIATE", label: "Intermediate" },
                { value: "GRADUATE", label: "Graduate" },
                { value: "POSTGRADUATE", label: "Post Graduate" },
                { value: "DOCTORATE", label: "Doctorate" },
                { value: "OTHER", label: "Other" },
              ]}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          name={`${prefix}.email`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Email Address"
              type="email"
              isRequired={false}
              {...field}
              onBlur={() => {
                // Only validate/show toasts for co-applicants (not guarantors or applicants)
                if (!isCoApplicant || isGuarantor) return;
                const v = field.value || "";
                if (!v) return;
                const ok = /^\S+@\S+\.\S+$/.test(v);
                if (ok) showSuccess("Co-applicant email looks valid");
                else showError("Please enter a valid email address");
              }}
            />
          )}
        />
        <Controller
          name={`${prefix}.passportNumber`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Passport Number"
              isRequired={isCoApplicant || isGuarantor}
              {...field}
            />
          )}
        />
        <Controller
          name={`${prefix}.panNumber`}
          control={control}
          render={({ field }) => (
            <InputField
              label="PAN No."
              isRequired={isCoApplicant || isGuarantor}
              {...field}
            />
          )}
        />
      </Grid>

      <Grid cols={3}>
        <Controller
          name={`${prefix}.dob`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Date of Birth"
              isRequired={isCoApplicant || isGuarantor}
              type="date"
              value={
                field.value
                  ? new Date(field.value).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                field.onChange(
                  e.target.value ? new Date(e.target.value) : undefined,
                )
              }
            />
          )}
        />
        <Controller
          name={`${prefix}.category`}
          control={control}
          render={({ field }) => (
            <SelectField
              label="Category"
              isRequired
              options={CATEGORY_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name={`${prefix}.maritalStatus`}
          control={control}
          render={({ field }) => (
            <SelectField
              label="Marital Status"
              isRequired
              options={MARITAL_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name={`${prefix}.contactNumber`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Mobile Number"
              type="tel"
              isRequired={isCoApplicant || isGuarantor}
              {...field}
              onChange={(e) =>
                field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
            />
          )}
        />
      </Grid>

      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
        No. of Family Dependents
      </p>
      <Grid>
        <Controller
          name={`${prefix}.noOfDependents`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Total Dependents"
              type="number"
              placeholder="0"
              {...field}
            />
          )}
        />
        <Controller
          name={`${prefix}.noOfChildren`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Children"
              type="number"
              placeholder="0"
              {...field}
            />
          )}
        />
      </Grid>

      <Grid cols={3}>
        <Controller
          name={`${prefix}.drivingLicenceNo`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Driving Licence No."
              isRequired={isCoApplicant || isGuarantor}
              {...field}
            />
          )}
        />
        <Controller
          name={`${prefix}.voterId`}
          control={control}
          render={({ field }) => <InputField label="Voter Id" {...field} />}
        />
        <Controller
          name={`${prefix}.aadhaarNumber`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Aadhaar Card No."
              isRequired={isCoApplicant || isGuarantor}
              {...field}
            />
          )}
        />
      </Grid>

      <Grid cols={3}>
        <Controller
          name={`${prefix}.employmentType`}
          control={control}
          render={({ field }) => (
            <SelectField
              label="Employment Type"
              isRequired={isCoApplicant || isGuarantor}
              options={EMPLOYMENT_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name={
            isGuarantor
              ? `${prefix}.relationshipWithApplicant`
              : `${prefix}.relation`
          }
          control={control}
          render={({ field }) => (
            <SelectField
              label="Relationship with Applicant"
              isRequired={isCoApplicant || isGuarantor}
              options={RELATION_OPTIONS}
              value={field.value}
              onChange={(val) => field.onChange(val)}
            />
          )}
        />
        <Controller
          name={
            isGuarantor
              ? `${prefix}.accommodationType`
              : `${prefix}.presentAccommodation`
          }
          control={control}
          render={({ field }) => (
            <SelectField
              label="Present Accommodation"
              options={ACCOMMODATION_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name={`${prefix}.periodOfStay`}
          control={control}
          render={({ field }) => (
            <InputField label="Period of Stay" {...field} />
          )}
        />
        {(isGuarantor ? accommodationType : presentAccommodation) ===
          "RENTED" && (
          <Controller
            name={`${prefix}.rentPerMonth`}
            control={control}
            render={({ field }) => (
              <InputField label="Rent per Month" type="number" {...field} />
            )}
          />
        )}
      </Grid>

      <Controller
        name={`${prefix}.currentAddress.addressLine1`}
        control={control}
        render={({ field }) => <InputField label="Address Line 1" {...field} />}
      />

      <Grid cols={3}>
        <Controller
          name={`${prefix}.currentAddress.city`}
          control={control}
          render={({ field }) => <InputField label="City / Town" {...field} />}
        />
        <Controller
          name={`${prefix}.currentAddress.district`}
          control={control}
          render={({ field }) => <InputField label="District" {...field} />}
        />
        <Controller
          name={`${prefix}.currentAddress.state`}
          control={control}
          render={({ field }) => (
            <SelectField
              label="State"
              isSearchable
              options={INDIAN_STATES}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Grid>

      <Grid cols={3}>
        <Controller
          name={`${prefix}.currentAddress.pinCode`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Pin Code"
              {...field}
              onChange={(e) =>
                field.onChange(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />
          )}
        />
        <Controller
          name={`${prefix}.currentAddress.landmark`}
          control={control}
          render={({ field }) => <InputField label="Land Mark" {...field} />}
        />
        <Controller
          name={`${prefix}.currentAddress.phoneWithStd`}
          control={control}
          render={({ field }) => (
            <InputField label="Phone No. (With STD Code)" {...field} />
          )}
        />
      </Grid>

      <div
        className="flex items-center gap-3 px-5 py-3.5 bg-blue-50 rounded-2xl border border-blue-100 cursor-pointer"
        onClick={() => {
          const next = !sameAddress;
          setValue(`${prefix}.sameAsCurrent`, next);
          if (next) copyCurrentAddress();
        }}
      >
        <div
          className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0 ${sameAddress ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"}`}
        >
          {sameAddress && (
            <Check size={11} strokeWidth={3} className="text-white" />
          )}
        </div>
        <label className="text-sm font-semibold text-blue-700 cursor-pointer select-none flex-1">
          Permanent address same as current address
        </label>
      </div>

      <Divider label="Permanent Address" />
      <Controller
        name={`${prefix}.permanentAddress.addressLine1`}
        control={control}
        render={({ field }) => <InputField label="Address Line 1" {...field} />}
      />
      <Grid cols={3}>
        <Controller
          name={`${prefix}.permanentAddress.city`}
          control={control}
          render={({ field }) => <InputField label="City / Town" {...field} />}
        />
        <Controller
          name={`${prefix}.permanentAddress.district`}
          control={control}
          render={({ field }) => <InputField label="District" {...field} />}
        />
        <Controller
          name={`${prefix}.permanentAddress.state`}
          control={control}
          render={({ field }) => (
            <SelectField
              label="State"
              isSearchable
              options={INDIAN_STATES}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Grid>
      <Grid cols={3}>
        <Controller
          name={`${prefix}.permanentAddress.pinCode`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Pin Code"
              {...field}
              onChange={(e) =>
                field.onChange(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />
          )}
        />
        <Controller
          name={`${prefix}.permanentAddress.landmark`}
          control={control}
          render={({ field }) => <InputField label="Land Mark" {...field} />}
        />
      </Grid>

      <Controller
        name={`${prefix}.correspondenceAddressType`}
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Correspondence Address"
            options={CORRESPONDENCE_OPTIONS}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );
};

const occupationDefaults = () => ({
  employmentType: undefined,
  professionalType: undefined,
  professionalTypeOther: "",
  businessType: undefined,
  businessTypeOther: "",
  salariedWorkingFor: undefined,
  salariedWorkingForOther: "",
  designation: "",
  department: "",
  dateOfJoining: undefined,
  dateOfRetirement: undefined,
  companyName: "",
  companyAddress: "",
  companyCity: "",
  companyDistrict: "",
  companyState: "",
  companyPinCode: "",
  companyLandMark: "",
  companyPhone: "",
  companyExtNo: "",
  workExperience: "",
  noOfEmployees: "",
});

const OccupationalDetailFields = ({ control, watch, prefix, setValue }) => {
  const occDetails = watch(`${prefix}.occupationalDetails`) || {};
  const employmentType =
    watch(`${prefix}.employmentType`) || occDetails.occupationalCategory;
  const professionalType =
    watch(`${prefix}.professionalType`) || occDetails.professionalType;
  const businessType =
    watch(`${prefix}.businessType`) || occDetails.businessType;
  const salariedWorkingFor =
    watch(`${prefix}.salariedWorkingFor`) || occDetails.salariedWorkingFor;

  // keep occupationalDetails.occupationalCategory synchronized with employmentType
  React.useEffect(() => {
    if (!setValue) return;
    setValue(
      `${prefix}.occupationalDetails.occupationalCategory`,
      employmentType || undefined,
    );
  }, [employmentType, prefix, setValue]);

  return (
    <div className="space-y-4">
      <Controller
        name={`${prefix}.employmentType`}
        control={control}
        render={({ field }) => (
          <SelectField
            label="Occupational Category"
            isRequired
            options={EMPLOYMENT_OPTIONS}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {(employmentType === "SALARIED" ||
        employmentType === "BUSINESS" ||
        employmentType === "PROFESSIONAL" ||
        employmentType === "OTHER") && (
        <div className="space-y-4 border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {employmentType === "SALARIED"
              ? "Company Details"
              : employmentType === "BUSINESS"
                ? "Business Details"
                : employmentType === "PROFESSIONAL"
                  ? "Professional Details"
                  : "Other Occupation Details"}
          </p>
          {employmentType === "PROFESSIONAL" && (
            <>
              <Controller
                name={`${prefix}.professionalType`}
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Working for"
                    options={PROFESSIONAL_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {professionalType === "OTHER" && (
                <Controller
                  name={`${prefix}.professionalTypeOther`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Specify Other Profession" {...field} />
                  )}
                />
              )}
            </>
          )}
          {employmentType === "BUSINESS" && (
            <>
              <Controller
                name={`${prefix}.businessType`}
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Working for"
                    options={BUSINESS_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {businessType === "OTHER" && (
                <Controller
                  name={`${prefix}.businessTypeOther`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Specify Other Business" {...field} />
                  )}
                />
              )}
            </>
          )}
          {employmentType === "SALARIED" && (
            <>
              <Controller
                name={`${prefix}.salariedWorkingFor`}
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Working for"
                    options={SALARIED_WORKING_FOR}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {salariedWorkingFor === "OTHER" && (
                <Controller
                  name={`${prefix}.salariedWorkingForOther`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Specify Other Employer" {...field} />
                  )}
                />
              )}
              <Grid>
                <Controller
                  name={`${prefix}.designation`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Designation" {...field} />
                  )}
                />
                <Controller
                  name={`${prefix}.department`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Department" {...field} />
                  )}
                />
              </Grid>
            </>
          )}
        </div>
      )}

      {/* New: occupationalDetails object fields to match backend shape */}
      <div className="mt-4 p-4 border border-slate-100 rounded-lg ">
        <Grid cols={1}>
          <div />
          <Controller
            name={`${prefix}.occupationalDetails.companyBusinessName`}
            control={control}
            render={({ field }) => (
              <InputField label="Company / Business Name" {...field} />
            )}
          />
        </Grid>

        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-3">
          Company / Business Address
        </p>
        <Controller
          name={`${prefix}.occupationalDetails.address.addressLine1`}
          control={control}
          render={({ field }) => (
            <InputField label="Address Line 1" {...field} />
          )}
        />
        <Controller
          name={`${prefix}.occupationalDetails.address.addressLine2`}
          control={control}
          render={({ field }) => (
            <InputField label="Address Line 2" {...field} />
          )}
        />
        <Grid cols={3}>
          <Controller
            name={`${prefix}.occupationalDetails.address.city`}
            control={control}
            render={({ field }) => (
              <InputField label="City / Town" {...field} />
            )}
          />
          <Controller
            name={`${prefix}.occupationalDetails.address.district`}
            control={control}
            render={({ field }) => <InputField label="District" {...field} />}
          />
          <Controller
            name={`${prefix}.occupationalDetails.address.state`}
            control={control}
            render={({ field }) => (
              <SelectField
                label="State"
                isSearchable
                options={INDIAN_STATES}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Grid>
        <Grid cols={3}>
          <Controller
            name={`${prefix}.occupationalDetails.address.pinCode`}
            control={control}
            render={({ field }) => (
              <InputField
                label="Pin Code"
                {...field}
                onChange={(e) =>
                  field.onChange(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
            )}
          />
          <Controller
            name={`${prefix}.occupationalDetails.address.landmark`}
            control={control}
            render={({ field }) => <InputField label="Land Mark" {...field} />}
          />
          <Controller
            name={`${prefix}.occupationalDetails.address.phoneNumber`}
            control={control}
            render={({ field }) => (
              <InputField label="Phone No. (With Std Code)" {...field} />
            )}
          />
        </Grid>

        <Grid cols={3}>
          <Controller
            name={`${prefix}.occupationalDetails.phoneNumber`}
            control={control}
            render={({ field }) => <InputField label="Phone No." {...field} />}
          />
          <Controller
            name={`${prefix}.occupationalDetails.extensionNumber`}
            control={control}
            render={({ field }) => (
              <InputField label="Extension No." {...field} />
            )}
          />
          <Controller
            name={`${prefix}.occupationalDetails.totalWorkExperience`}
            control={control}
            render={({ field }) => (
              <InputField
                label="Total Work Experience (Years)"
                type="number"
                {...field}
              />
            )}
          />
        </Grid>

        <Grid cols={2}>
          <Controller
            name={`${prefix}.occupationalDetails.noOfEmployees`}
            control={control}
            render={({ field }) => (
              <InputField label="No. of Employees" type="number" {...field} />
            )}
          />
          <Controller
            name={`${prefix}.occupationalDetails.commencementDate`}
            control={control}
            render={({ field }) => (
              <InputField label="Date of Commencement" type="date" {...field} />
            )}
          />
          {/* <Controller
                name={`${prefix}.occupationalDetails.businessType`}
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Business Type"
                    options={[
                      { value: "TRADER", label: "Trader" },
                      { value: "MANUFACTURER", label: "Manufacturer" },
                      { value: "WHOLESALER", label: "Wholeseller" },
                      { value: "OTHER", label: "Other" },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              /> */}
        </Grid>
        <Controller
          name={`${prefix}.occupationalDetails.businessTypeOther`}
          control={control}
          render={({ field }) => (
            <InputField label="If Other, specify Business Type" {...field} />
          )}
        />

        {/* Employment details block (separate object) */}
        <Divider label="Employment Details" />
        <Grid cols={2}>
          {/* <Controller
                name={`${prefix}.employmentDetails.employerType`}
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Employer Type"
                    options={SALARIED_WORKING_FOR}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              /> */}
          <Controller
            name={`${prefix}.employmentDetails.designation`}
            control={control}
            render={({ field }) => (
              <InputField label="Designation" {...field} />
            )}
          />
          <Controller
            name={`${prefix}.employmentDetails.department`}
            control={control}
            render={({ field }) => <InputField label="Department" {...field} />}
          />
        </Grid>
        <Grid cols={2}>
          <Controller
            name={`${prefix}.employmentDetails.dateOfJoining`}
            control={control}
            render={({ field }) => (
              <InputField label="Date of Joining" type="date" {...field} />
            )}
          />
          <Controller
            name={`${prefix}.employmentDetails.dateOfRetirement`}
            control={control}
            render={({ field }) => (
              <InputField label="Date of Retirement" type="date" {...field} />
            )}
          />
        </Grid>
      </div>
    </div>
  );
};

export const PersonEmploymentFields = ({
  control,
  watch,
  prefix,
  setValue,
  requiredPaths = new Set(),
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${prefix}.additionalOccupationalDetails`,
  });

  const occPath = `${prefix}.occupationalDetails`;
  const isOccRequired = Array.from(requiredPaths).some(
    (p) => p === occPath || p.startsWith(`${occPath}`),
  );

  return (
    <SectionCard
      title={isOccRequired ? "Occupational Details *" : "Occupational Details"}
      icon={Briefcase}
    >
      <div className="space-y-6">
        <p className="text-xs text-slate-400 mb-1">
          Add additional occupational details if the applicant, co-applicant, or
          guarantor has more than one occupation.
        </p>

        <div className="p-4 border border-slate-200 rounded-xl bg-white">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-700 text-sm">
              Occupational Detail 1
            </h4>
          </div>
          <OccupationalDetailFields
            control={control}
            watch={watch}
            prefix={prefix}
            setValue={setValue}
          />
        </div>

        {fields.map((field, index) => {
          const itemPrefix = `${prefix}.additionalOccupationalDetails.${index}`;
          return (
            <div
              key={field.id}
              className="p-4 border border-slate-200 rounded-xl bg-white"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-700 text-sm">
                  Occupational Detail {index + 2}
                </h4>
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-red-50! text-red-600! border border-red-200 shadow-none! py-1.5! px-3! text-xs!"
                >
                  <Trash2 size={13} /> Remove
                </Button>
              </div>
              <OccupationalDetailFields
                control={control}
                watch={watch}
                prefix={itemPrefix}
                setValue={setValue}
              />
            </div>
          );
        })}

        <Button
          type="button"
          onClick={() => append(occupationDefaults())}
          className="mt-4 px-3 py-2 text-sm bg-blue-600 rounded"
        >
          <Plus size={13} /> Add Another Occupational Details
        </Button>
      </div>
    </SectionCard>
  );
};

export const PersonFinancialFields = ({ control, watch, setValue, prefix }) => {
  const assets = watch([
    `${prefix}.savingBankBalance`,
    `${prefix}.valueOfImmovableProperty`,
    `${prefix}.currentBalanceInPF`,
    `${prefix}.valueOfSharesSecurities`,
    `${prefix}.fixedDeposits`,
    `${prefix}.otherAssets`,
  ]);
  const liabilities = watch([
    `${prefix}.creditSocietyLoan`,
    `${prefix}.employerLoan`,
    `${prefix}.homeLoan`,
    `${prefix}.pfLoan`,
    `${prefix}.vehicleLoan`,
    `${prefix}.personalLoan`,
    `${prefix}.otherLoan`,
  ]);

  useEffect(() => {
    setValue(
      `${prefix}.totalAssets`,
      assets.reduce((s, v) => s + (Number(v) || 0), 0),
    );
  }, [assets, prefix, setValue]);

  useEffect(() => {
    setValue(
      `${prefix}.totalLiabilities`,
      liabilities.reduce((s, v) => s + (Number(v) || 0), 0),
    );
  }, [liabilities, prefix, setValue]);

  return (
    <div className="space-y-4">
      <Grid>
        <Controller
          name={`${prefix}.grossMonthlyIncome`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Gross Monthly Income (₹)"
              type="number"
              isRequired
              {...field}
              onChange={(e) =>
                field.onChange(
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          )}
        />
        <Controller
          name={`${prefix}.netMonthlyIncome`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Net Monthly Income (₹)"
              type="number"
              isRequired
              {...field}
              onChange={(e) =>
                field.onChange(
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          )}
        />
      </Grid>

      <Controller
        name={`${prefix}.averageMonthlyExpenses`}
        control={control}
        render={({ field }) => (
          <InputField
            label="Average Monthly Expenses (₹)"
            type="number"
            isRequired
            {...field}
            onChange={(e) =>
              field.onChange(
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        )}
      />

      <Divider label="Assets" />

      <Grid>
        <Controller
          name={`${prefix}.savingBankBalance`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Saving Bank A/c (₹)"
              type="number"
              isRequired
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name={`${prefix}.valueOfImmovableProperty`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Value of Immovable Property (₹)"
              type="number"
              isRequired
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </Grid>

      <Grid>
        <Controller
          name={`${prefix}.currentBalanceInPF`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Current Balance in PF (₹)"
              type="number"
              isRequired
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name={`${prefix}.valueOfSharesSecurities`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Value of Shares / Securities (₹)"
              type="number"
              isRequired
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </Grid>

      <Grid>
        <Controller
          name={`${prefix}.fixedDeposits`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Fixed Deposits (₹)"
              type="number"
              isRequired
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name={`${prefix}.otherAssets`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Other Assets (₹)"
              type="number"
              isRequired
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </Grid>

      <Controller
        name={`${prefix}.totalAssets`}
        control={control}
        render={({ field }) => (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-800">
              Total Assets Rs.
            </span>
            <span className="text-lg font-black text-emerald-700">
              ₹{Number(field.value || 0).toLocaleString("en-IN")}
            </span>
          </div>
        )}
      />

      <Divider label="Liabilities" />

      <Grid>
        <Controller
          name={`${prefix}.creditSocietyLoan`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Credit Society Loan (₹)"
              type="number"
              isRequired
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name={`${prefix}.employerLoan`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Employer Loan (₹)"
              type="number"
              isRequired
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </Grid>

      <Grid>
        <Controller
          name={`${prefix}.homeLoan`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Home Loan (₹)"
              type="number"
              isRequired
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name={`${prefix}.pfLoan`}
          control={control}
          render={({ field }) => (
            <InputField
              label="PF Loan (₹)"
              type="number"
              isRequired
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </Grid>

      <Grid>
        <Controller
          name={`${prefix}.vehicleLoan`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Vehicle Loan (₹)"
              type="number"
              isRequired
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name={`${prefix}.personalLoan`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Personal Loan (₹)"
              type="number"
              isRequired
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </Grid>

      <Controller
        name={`${prefix}.otherLoan`}
        control={control}
        render={({ field }) => (
          <InputField
            label="Other Loans (₹)"
            type="number"
            isRequired
            {...field}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />

      <Controller
        name={`${prefix}.totalLiabilities`}
        control={control}
        render={({ field }) => (
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between">
            <span className="text-sm font-bold text-rose-800">
              Total Liabilities Rs.
            </span>
            <span className="text-lg font-black text-rose-700">
              ₹{Number(field.value || 0).toLocaleString("en-IN")}
            </span>
          </div>
        )}
      />
    </div>
  );
};
