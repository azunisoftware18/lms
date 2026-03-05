import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Send } from "lucide-react";
// Aapke reusable components
import Button from "../ui/Button";
import SelectField from "../ui/SelectField";
import InputField from "../ui/InputField";
import TextAreaField from "../ui/TextAreaField";

function LeadForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "", email: "", contactNumber: "", dob: "", gender: "",
    state: "", city: "", pinCode: "", address: "", loanTypeId: "", loanAmount: "",
  });

  const [isPending, setIsPending] = useState(false);

  // Mock Data
  const loanTypes = [
    { id: "1", name: "Personal Loan" },
    { id: "2", name: "Business Loan" },
    { id: "3", name: "Home Loan" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    const payload = {
      ...formData,
      loanTypeId: String(formData.loanTypeId),
      loanAmount: Number(formData.loanAmount),
    };

    try {
      console.log("Saving locally:", payload);
      await new Promise((res) => setTimeout(res, 1500));
      alert("Lead created successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        
        {/* Full Name */}
        <InputField
          label="Full Name *"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          placeholder=""
          icon={User}
        />

        {/* Email */}
        <InputField
          label="Email Address *"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder=""
          icon={Mail}
        />

        {/* Contact */}
        <InputField
          label="Mobile Number *"
          type="tel"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          required
          maxLength="10"
          placeholder=""
          icon={Phone}
        />

        {/* Date of Birth */}
        <InputField
          label="Date of Birth *"
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
          icon={Calendar}
        />

        {/* Gender Select */}
        <SelectField
          label="Gender *"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
          <option value="OTHER">OTHER</option>
        </SelectField>

        {/* State Select */}
        <SelectField
          label="State *"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
          options={[
            { value: "", label: "Select State" },
            { value: "Rajasthan", label: "Rajasthan" },
            { value: "Maharashtra", label: "Maharashtra" },
            { value: "Delhi", label: "Delhi" },
            { value: "Gujarat", label: "Gujarat" }
          ]}
        />

        {/* City */}
        <SelectField
          label="City *"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          placeholder="Select City"
          options={[
            { value: "", label: "Select City" },
            { value: "Rajasthan", label: "Jaipur" },
            { value: "Maharashtra", label: "Mumbai" },
            { value: "Delhi", label: "Delhi" },
            { value: "Gujarat", label: "Ahmedabad" }
          ]}
        />

        {/* Pincode */}
        <InputField
          label="Pincode *"
          name="pinCode"
          value={formData.pinCode}
          onChange={handleChange}
          required
          maxLength="6"
          placeholder="302001"
        />

        {/* Loan Type */}
        <SelectField
          label="Loan Type *"
          name="loanTypeId"
          value={formData.loanTypeId}
          onChange={handleChange}
          required
          icon={<CreditCard size={18} />}
        >
          <option value="">Select Loan Type</option>
          {loanTypes.map((loan) => (
            <option key={loan.id} value={loan.id}>
              {loan.name}
            </option>
          ))}
        </SelectField>

        {/* Loan Amount */}
        <InputField
          label="Required Amount *"
          type="number"
          name="loanAmount"
          value={formData.loanAmount}
          onChange={handleChange}
          required
          min="1000"
          placeholder="e.g. 50000"
        />

        {/* Address - Full Width */}
        <div className="md:col-span-2">
          <TextAreaField
            label="Full Address *"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
            placeholder="House No, Street, Landmark..."
            icon={<MapPin size={18} />}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          variant="primary" // Agar aapne Button mein variants banaye hain
          className="w-full py-4 flex items-center justify-center gap-2"
        >
          {isPending ? (
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