import React, { useCallback } from "react";
import { Controller } from "react-hook-form";
import { Check, Home, MapPin } from "lucide-react";

import InputField from "../../../ui/InputField";
import SelectField from "../../../ui/SelectField";
import { SectionCard, Grid } from "../sharedFields";
import { INDIAN_STATES } from "../constants";

export default function AddressSection({
  control,
  errors,
  watch,
  setValue,
  isAadhaarLocked = false,
}) {
  const sameAddress = watch("sameAsCurrent");

  const copyCurrent = useCallback(() => {
    [
      "addressLine1",
      "addressLine2",
      "city",
      "district",
      "state",
      "pinCode",
      "landmark",
      "phoneNumber",
    ].forEach((f) => {
      setValue(
        `addresses.permanentAddress.${f}`,
        watch(`addresses.currentAddress.${f}`) || "",
      );
    });
  }, [watch, setValue]);

  return (
    <div>
      <SectionCard title="Current Residential Address" icon={Home}>
        <div className="space-y-4">
          <Controller
            name="addresses.currentAddress.addressLine1"
            control={control}
            render={({ field }) => (
              <InputField
                label="Address Line 1"
                isRequired
                {...field}
                error={errors.addresses?.currentAddress?.addressLine1?.message}
              />
            )}
          />
          <Controller
            name="addresses.currentAddress.addressLine2"
            control={control}
            render={({ field }) => (
              <InputField
                label="Address Line 2"
                {...field}
              />
            )}
          />
          <Grid>
            <Controller
              name="addresses.currentAddress.city"
              control={control}
              render={({ field }) => (
                <InputField
                  label="City / Town"
                  isRequired
                  {...field}
                  error={errors.addresses?.currentAddress?.city?.message}
                />
              )}
            />
            <Controller
              name="addresses.currentAddress.district"
              control={control}
              render={({ field }) => (
                <InputField
                  label="District"
                  isRequired
                  {...field}
                  error={errors.addresses?.currentAddress?.district?.message}
                />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name="addresses.currentAddress.state"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="State"
                  isRequired
                  isSearchable
                  options={INDIAN_STATES}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.addresses?.currentAddress?.state?.message}
                />
              )}
            />
            <Controller
              name="addresses.currentAddress.pinCode"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Pin Code"
                  isRequired
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  error={errors.addresses?.currentAddress?.pinCode?.message}
                />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name="addresses.currentAddress.landmark"
              control={control}
              render={({ field }) => (
                  <InputField
                    label="Land Mark"
                    {...field}
                  />
              )}
            />
            <Controller
              name="addresses.currentAddress.phoneNumber"
              control={control}
              render={({ field }) => (
                  <InputField
                    label="Phone No. (With STD Code)"
                    {...field}
                  />
              )}
            />
          </Grid>
        </div>
      </SectionCard>

      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border mb-6 ${
          isAadhaarLocked
            ? "bg-slate-100 border-slate-200 cursor-not-allowed"
            : "bg-blue-50 border-blue-100 cursor-pointer"
        }`}
        onClick={() => {
          if (isAadhaarLocked) return;
          const next = !sameAddress;
          setValue("sameAsCurrent", next);
          if (next) copyCurrent();
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

      <SectionCard title="Permanent Address" icon={MapPin}>
        <div className="space-y-4">
          <Controller
            name="addresses.permanentAddress.addressLine1"
            control={control}
            render={({ field }) => (
                <InputField
                  label="Address Line 1"
                  isRequired
                  isDisabled={isAadhaarLocked && Boolean(field.value)}
                  {...field}
                  error={
                    errors?.addresses?.permanentAddress?.addressLine1?.message
                  }
                />
            )}
          />
          <Controller
            name="addresses.permanentAddress.addressLine2"
            control={control}
            render={({ field }) => (
                <InputField
                  label="Address Line 2"
                  isDisabled={isAadhaarLocked && Boolean(field.value)}
                  {...field}
                />
            )}
          />
          <Grid>
            <Controller
              name="addresses.permanentAddress.city"
              control={control}
              render={({ field }) => (
                <InputField
                  label="City / Town"
                  isDisabled={isAadhaarLocked && Boolean(field.value)}
                  {...field}
                />
              )}
            />
            <Controller
              name="addresses.permanentAddress.district"
              control={control}
              render={({ field }) => (
                <InputField
                  label="District"
                  isDisabled={isAadhaarLocked && Boolean(field.value)}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name="addresses.permanentAddress.state"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="State"
                  isSearchable
                  isDisabled={isAadhaarLocked && Boolean(field.value)}
                  options={INDIAN_STATES}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="addresses.permanentAddress.pinCode"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Pin Code"
                  isDisabled={isAadhaarLocked && Boolean(field.value)}
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                />
              )}
            />
          </Grid>
          <Controller
            name="addresses.permanentAddress.landmark"
            control={control}
            render={({ field }) => (
              <InputField
                label="Land Mark"
                isDisabled={isAadhaarLocked && Boolean(field.value)}
                {...field}
              />
            )}
          />
        </div>
      </SectionCard>
    </div>
  );
}
