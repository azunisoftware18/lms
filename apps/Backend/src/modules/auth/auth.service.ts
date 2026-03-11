import { prisma } from "../../db/prismaService.js";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "../../common/utils/utils.js";
import { AppError } from "../../common/utils/apiError.js";
import { logAction } from "../../audit/audit.helper.js";

type LoginAttemptState = {
  failedAttempts: number;
  lockedUntil: number | null;
};

const loginAttempts = new Map<string, LoginAttemptState>();
const MAX_FAILED_LOGIN_ATTEMPTS = Number(process.env.MAX_FAILED_LOGIN_ATTEMPTS || 5);
const ACCOUNT_LOCK_MS = Number(process.env.ACCOUNT_LOCK_MS || 15 * 60 * 1000);

function getState(key: string): LoginAttemptState {
  return loginAttempts.get(key) ?? { failedAttempts: 0, lockedUntil: null };
}

function clearState(key: string) {
  loginAttempts.delete(key);
}

function registerFailure(key: string) {
  const state = getState(key);
  const nextFailedAttempts = state.failedAttempts + 1;
  const shouldLock = nextFailedAttempts >= MAX_FAILED_LOGIN_ATTEMPTS;

  loginAttempts.set(key, {
    failedAttempts: shouldLock ? 0 : nextFailedAttempts,
    lockedUntil: shouldLock ? Date.now() + ACCOUNT_LOCK_MS : null,
  });
}

function ensureNotLocked(key: string) {
  const state = getState(key);
  if (!state.lockedUntil) return;

  if (Date.now() >= state.lockedUntil) {
    clearState(key);
    return;
  }

  const retryInSeconds = Math.ceil((state.lockedUntil - Date.now()) / 1000);
  throw new AppError(
    `Account temporarily locked due to failed login attempts. Try again in ${retryInSeconds} seconds.`,
    423,
  );
}

export async function loginService(identifier: string, password: string) {
  const identifierKey = identifier.trim().toLowerCase();
  ensureNotLocked(identifierKey);

  // Find by email OR userName
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { userName: identifier }],
    },
  });

  if (!user) {
    registerFailure(identifierKey);
    throw AppError.unauthorized("Invalid credentials");
  }

  const userLockKey = user.id;
  ensureNotLocked(userLockKey);

  if (!user.isActive) {
    throw AppError.forbidden("User account is inactive");
  }
  // if (user.kycStatus !== "VERIFIED") {
  //   throw new Error("User KYC is not verified cannot login");
  // }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    registerFailure(userLockKey);
    registerFailure(identifierKey);
    throw AppError.unauthorized("Invalid credentials");
  }

  clearState(identifierKey);
  clearState(userLockKey);

  //TODO remonve the undefined branchId from token if the user does not have a branchId

  const accessToken = generateAccessToken(
    user.id,
    user.email,
    user.role,
    user.branchId ?? undefined,
  );
  const refreshToken = generateRefreshToken(
    user.id,
    user.email,
    user.role,
    user.branchId ?? undefined,
  );

  await logAction({
    entityType: "USER",
    entityId: user.id,
    action: "LOGIN_SUCCESS",
    performedBy: user.id,
    branchId: user.branchId,
    oldValue: null,
    newValue: { loggedInAt: new Date().toISOString() },
    remarks: "User login successful",
  });

  return { user, accessToken, refreshToken };
}


export async function logoutService() {
  // For stateless JWT, logout is handled on the client by deleting tokens.
  // Optionally, you can implement token blacklisting here if needed.
  return { success: true, message: "Logout successful" };
}