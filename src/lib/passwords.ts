import type { UserRole } from "@/lib/domain";

const LETTER = /[A-Za-z]/;
const LOWERCASE = /[a-z]/;
const UPPERCASE = /[A-Z]/;
const NUMBER = /[0-9]/;
const SYMBOL = /[^A-Za-z0-9\s]/;

export function validatePassword(password: string, role: UserRole = "user") {
  const errors: string[] = [];

  if (role === "admin" && password.length < 12) {
    errors.push("Use at least 12 characters.");
  } else if (password.length < 8) {
    errors.push("Use at least 8 characters.");
  }

  if (role === "user") {
    const classes = [
      LETTER.test(password),
      NUMBER.test(password),
      SYMBOL.test(password),
    ].filter(Boolean).length;

    if (classes < 2) {
      errors.push("Use at least two of: letters, numbers, or symbols.");
    }
  } else {
    if (!LOWERCASE.test(password)) errors.push("Add a lowercase letter.");
    if (!UPPERCASE.test(password)) errors.push("Add an uppercase letter.");
    if (!NUMBER.test(password)) errors.push("Add a number.");
    if (!SYMBOL.test(password)) errors.push("Add a symbol.");
  }

  return errors;
}

export function passwordHelp(role: UserRole = "user") {
  if (role === "admin") {
    return "At least 12 characters with uppercase, lowercase, a number, and a symbol.";
  }

  if (role === "volunteer" || role === "staff") {
    return "At least 8 characters with uppercase, lowercase, a number, and a symbol.";
  }

  return "At least 8 characters using two of: letters, numbers, or symbols.";
}
