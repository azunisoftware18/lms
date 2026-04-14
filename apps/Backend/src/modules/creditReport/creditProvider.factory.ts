import { CreditProvider } from "./providers/creditProvider.interface.js";
import { mockCreditProvider } from "./providers/mockCreditProvider.js";
import { cibilCreditProvider } from "./providers/cibilCreditProvider.js";
import ENV from "../../common/config/env.js";
export function getCreditProvider(): CreditProvider {
  switch (ENV.CREDIT_PROVIDER) {
    case "CIBIL":
      return cibilCreditProvider;
    case "MOCK":
      return mockCreditProvider;
    default:
      throw new Error(`Unknown CREDIT_PROVIDER: ${ENV.CREDIT_PROVIDER}`);
  }
}
