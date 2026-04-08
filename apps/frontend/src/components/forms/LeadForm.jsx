import React, { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  User,
  
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Send,
} from "lucide-react";
import Button from "../ui/Button";
import SelectField from "../ui/SelectField";
import InputField from "../ui/InputField";
import TextAreaField from "../ui/TextAreaField";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema } from "../../validations/LeadValidation";
import { useCreateLead } from "../../hooks/useLead";
import { useLoanTypes } from "../../hooks/useLoanType"; // Import the loan types hook
import { toast } from "react-hot-toast";

export default function LeadForm({ onSuccess }) {
  const createLeadMutation = useCreateLead();
  
  // Fetch loan types from database
  const { loanTypes, loading: loanTypesLoading } = useLoanTypes();

  // Transform loan types to options format
  const loanOptions = useMemo(() => {
    if (!loanTypes || !Array.isArray(loanTypes)) return [];
    
    return loanTypes
      .filter(loan => loan.isActive === true) // Only show active loan types
      .map(loan => ({
        value: String(loan.id), // Use loan ID as value
        label: loan.name, // Use loan name as label
      }));
  }, [loanTypes]);

  // 1. Initialize useForm
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: "",
      email: "",
      contactNumber: "",
      dob: "",
      gender: "",
      state: "",
      city: "",
      pinCode: "",
      address: "",
      loanTypeId: "",
      loanAmount: "",
    },
  });

  // Use useWatch for React Compiler compatibility
  const genderValue = useWatch({ control, name: "gender" });
  const stateValue = useWatch({ control, name: "state" });
  const cityValue = useWatch({ control, name: "city" });
  const loanTypeIdValue = useWatch({ control, name: "loanTypeId" });

  // 2. Submit Handler
  const onSubmit = async (data) => {
    const payload = {
      ...data,
      loanTypeId: String(data.loanTypeId),
      loanAmount: Number(data.loanAmount),
    };

    try {
      await createLeadMutation.mutateAsync(payload);
      toast.success("Lead created successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create lead");
    }
  };

  // Options for selects (static ones remain)
  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
  ];

  const stateOptions = [
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Delhi", label: "Delhi" },
    { value: "Gujarat", label: "Gujarat" },
  ];

  const cityOptions = [
    { value: "Jaipur", label: "Jaipur" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Delhi", label: "Delhi" },
    { value: "Ahmedabad", label: "Ahmedabad" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Full Name */}
        <InputField
          label="Full Name "
          placeholder="John Doe"
          icon={User}
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        {/* Email */}
        <InputField
          label="Email Address *"
          type="email"
          placeholder="john@example.com"
          icon={Mail}
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Contact */}
        <InputField
          label="Mobile Number "
          type="tel"
          placeholder="9876543210"
          icon={Phone}
          error={errors.contactNumber?.message}
          {...register("contactNumber")}
        />

        {/* Date of Birth */}
        <InputField
          label="Date of Birth "
          type="date"
          icon={Calendar}
          error={errors.dob?.message}
          {...register("dob")}
        />

        {/* Gender Select */}
        <SelectField
          label="Gender "
          placeholder="Select Gender"
          error={errors.gender?.message}
          value={genderValue}
          onChange={(value) =>
            setValue("gender", value, { shouldValidate: true })
          }
          options={genderOptions}
          isRequired
        />

        {/* State Select */}
        <SelectField
          label="State "
          placeholder="Select State"
          error={errors.state?.message}
          value={stateValue}
          onChange={(value) =>
            setValue("state", value, { shouldValidate: true })
          }
          options={stateOptions}
          isRequired
        />

        {/* City Select */}
        <SelectField
          label="City "
          placeholder="Select City"
          error={errors.city?.message}
          value={cityValue}
          onChange={(value) =>
            setValue("city", value, { shouldValidate: true })
          }
          options={cityOptions}
          isRequired
        />

        {/* Pincode */}
        <InputField
          label="Pincode "
          placeholder="302001"
          error={errors.pinCode?.message}
          {...register("pinCode")}
        />

        {/* Loan Type - Dynamic from Database */}
        <SelectField
          label="Loan Type "
          placeholder={loanTypesLoading ? "Loading loan types..." : "Select Loan Type"}
          error={errors.loanTypeId?.message}
          value={loanTypeIdValue}
          onChange={(value) =>
            setValue("loanTypeId", value, { shouldValidate: true })
          }
          options={loanOptions}
          isRequired
          disabled={loanTypesLoading || loanOptions.length === 0}
        />

        {/* Show message if no loan types available */}
        {!loanTypesLoading && loanOptions.length === 0 && (
          <div className="text-amber-600 text-sm mt-1">
            No active loan types available. Please contact administrator.
          </div>
        )}

        {/* Loan Amount */}
        <InputField
          label="Required Amount (₹) "
          type="number"
          placeholder="e.g. 50000"
          icon={CreditCard}
          error={errors.loanAmount?.message}
          {...register("loanAmount")}
        />

        {/* Address */}
        <div className="md:col-span-2">
          <TextAreaField
            label="Full Address "
            rows={3}
            placeholder="House No, Street, Landmark..."
            error={errors.address?.message}
            {...register("address")}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting || loanTypesLoading}
          className="w-full py-4 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send size={18} />
              <span>Submit Application</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}