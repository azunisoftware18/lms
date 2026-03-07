import React from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Send } from "lucide-react";
import Button from "../ui/Button";
import SelectField from "../ui/SelectField";
import InputField from "../ui/InputField";
import TextAreaField from "../ui/TextAreaField";
import { leadSchema } from "../../app/validations/LeadValidation";
import { zodResolver } from "@hookform/resolvers/zod";

function LeadForm({ onSuccess }) {
  // 1. Initialize useForm
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
    }
  });

  // 2. Submit Handler
  const onSubmit = async (data) => {
    const payload = {
      ...data,
      loanTypeId: String(data.loanTypeId),
      loanAmount: Number(data.loanAmount),
    };

    try {
      console.log("Saving locally:", payload);
      await new Promise((res) => setTimeout(res, 1500));
      alert("Lead created successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("Something went wrong");
    }
  };

  // Options for selects
  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" }
  ];

  const stateOptions = [
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Delhi", label: "Delhi" },
    { value: "Gujarat", label: "Gujarat" }
  ];

  const cityOptions = [
    { value: "Jaipur", label: "Jaipur" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Delhi", label: "Delhi" },
    { value: "Ahmedabad", label: "Ahmedabad" }
  ];

  const loanOptions = [
    { value: "1", label: "Personal Loan" },
    { value: "2", label: "Business Loan" },
    { value: "3", label: "Home Loan" }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        {/* Full Name */}
        <InputField
          label="Full Name *"
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
          label="Mobile Number *"
          type="tel"
          placeholder="9876543210"
          icon={Phone}
          error={errors.contactNumber?.message}
          {...register("contactNumber")}
        />

        {/* Date of Birth */}
        <InputField
          label="Date of Birth *"
          type="date"
          icon={Calendar}
          error={errors.dob?.message}
          {...register("dob")}
        />

        {/* Gender Select - FIXED */}
        <SelectField
          label="Gender *"
          placeholder="Select Gender"
          error={errors.gender?.message}
          value={watch("gender")}
          onChange={(value) => setValue("gender", value, { shouldValidate: true })}
          options={genderOptions}
          isRequired
        />

        {/* State Select */}
        <SelectField
          label="State *"
          placeholder="Select State"
          error={errors.state?.message}
          value={watch("state")}
          onChange={(value) => setValue("state", value, { shouldValidate: true })}
          options={stateOptions}
          isRequired
        />

        {/* City Select */}
        <SelectField
          label="City *"
          placeholder="Select City"
          error={errors.city?.message}
          value={watch("city")}
          onChange={(value) => setValue("city", value, { shouldValidate: true })}
          options={cityOptions}
          isRequired
        />

        {/* Pincode */}
        <InputField
          label="Pincode *"
          placeholder="302001"
          error={errors.pinCode?.message}
          {...register("pinCode")}
        />

        {/* Loan Type - FIXED: No icon in SelectField */}
        <SelectField
          label="Loan Type *"
          placeholder="Select Loan Type"
          error={errors.loanTypeId?.message}
          value={watch("loanTypeId")}
          onChange={(value) => setValue("loanTypeId", value, { shouldValidate: true })}
          options={loanOptions}
          isRequired
        />

        {/* Loan Amount */}
        <InputField
          label="Required Amount (₹) *"
          type="number"
          placeholder="e.g. 50000"
          icon={CreditCard}
          error={errors.loanAmount?.message}
          {...register("loanAmount")}
        />

        {/* Address */}
        <div className="md:col-span-2">
          <TextAreaField
            label="Full Address *"
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
          disabled={isSubmitting}
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

export default LeadForm;