import type { FullLoanApplicationInput } from "../loanApplication.types.js";

export async function createAddress(
  tx: any,
  customerId: string,
  addresses: FullLoanApplicationInput["addresses"],
) {
  await tx.address.create({
    data: {
      ...addresses.currentAddress,
      addressType: "CURRENT_RESIDENTIAL",
      customerId,
    },
  });

  if (addresses.permanentAddress) {
    await tx.address.create({
      data: {
        ...addresses.permanentAddress,
        addressType: "PERMANENT",
        customerId,
      },
    });
  }
}
