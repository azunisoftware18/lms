export const loanTypeValidation = (getValues) => ({
  loanName: {
    required: "Loan name is required"
  },

  loanCategory: {
    required: "Loan category is required"
  },

  description: {
    maxLength: {
      value: 500,
      message: "Description cannot exceed 500 characters"
    }
  },

  minLoanAmount: {
    required: "Minimum amount is required",
    validate: (value) =>
      parseFloat(value) > 0 || "Amount must be positive"
  },

  maxLoanAmount: {
    required: "Maximum amount is required",
    validate: (value) => {
      if (parseFloat(value) <= 0) return "Amount must be positive";

      const minAmount = getValues("minLoanAmount");

      if (minAmount && parseFloat(value) <= parseFloat(minAmount)) {
        return "Must be greater than minimum amount";
      }

      return true;
    }
  },

  minTenure: {
    required: "Minimum tenure is required",
    validate: (value) =>
      parseInt(value) > 0 || "Tenure must be positive"
  },

  maxTenure: {
    required: "Maximum tenure is required",
    validate: (value) => {
      if (parseInt(value) <= 0) return "Tenure must be positive";

      const minTenure = getValues("minTenure");

      if (minTenure && parseInt(value) <= parseInt(minTenure)) {
        return "Must be greater than minimum tenure";
      }

      return true;
    }
  },

  minAge: {
    required: "Minimum age is required",
    validate: (value) =>
      parseInt(value) >= 18 || "Minimum age must be at least 18"
  },

  maxAge: {
    required: "Maximum age is required",
    validate: (value) => {
      if (parseInt(value) > 100) return "Maximum age is too high";

      const minAge = getValues("minAge");

      if (minAge && parseInt(value) <= parseInt(minAge)) {
        return "Must be greater than minimum age";
      }

      return true;
    }
  }
});