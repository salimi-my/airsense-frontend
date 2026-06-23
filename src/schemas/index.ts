import { isValidPhoneNumber } from "react-phone-number-input";
import * as z from "zod";

export const RegisterSchema = z
  .object({
    name: z.string().min(1, { message: "Please enter your name." }),
    email: z.string().email({ message: "Please enter valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[a-z]/, {
        message: "Password must contain at least 1 lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least 1 uppercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least 1 number." })
      .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
        message: "Password must contain at least 1 special character.",
      }),
    password_confirmation: z.string().min(1, {
      message: "Please confirm your password.",
    }),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms of Service and Privacy Policy.",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords does not match.",
    path: ["password_confirmation"],
  });

export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter valid email address." }),
  password: z.string().min(1, { message: "Please enter password." }),
  remember: z.boolean().optional(),
});

export const VerifyCodeSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Please enter authentication code or recovery code." }),
  email: z.string().email({ message: "Please enter valid email address." }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter valid email address." }),
});

export const PasswordResetSchema = z
  .object({
    email: z.string().email({ message: "Email address must be valid." }),
    token: z.string().min(1, { message: "Token is required." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[a-z]/, {
        message: "Password must contain at least 1 lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least 1 uppercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least 1 number." })
      .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
        message: "Password must contain at least 1 special character.",
      }),
    password_confirmation: z.string().min(1, {
      message: "Please confirm your password.",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords does not match.",
    path: ["password_confirmation"],
  });

export const ProfileSchema = z.object({
  name: z.string().min(1, { message: "Please enter name." }),
  phone: z
    .string()
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "Invalid phone number.",
    })
    .optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
});

export const EmailChangeRequestSchema = z.object({
  new_email: z.string().email({ message: "Please enter valid email address." }),
  password: z
    .string()
    .min(1, { message: "Please enter your current password." }),
});

export const CreatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[a-z]/, {
        message: "Password must contain at least 1 lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least 1 uppercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least 1 number." })
      .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
        message: "Password must contain at least 1 special character.",
      }),
    password_confirmation: z.string().min(1, {
      message: "Please confirm your password.",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords does not match.",
    path: ["password_confirmation"],
  });

export const UpdatePasswordSchema = z
  .object({
    old_password: z.string().min(1, {
      message: "Please enter your current password.",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[a-z]/, {
        message: "Password must contain at least 1 lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least 1 uppercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least 1 number." })
      .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
        message: "Password must contain at least 1 special character.",
      }),
    password_confirmation: z.string().min(1, {
      message: "Please confirm your password.",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords does not match.",
    path: ["password_confirmation"],
  });

export const EnableTwoFactorSchema = z.object({
  code: z
    .string()
    .min(6, { message: "Please enter valid authentication code." }),
});

export const ConfirmTwoFactorDisableSchema = z.object({
  confirmDisable: z.boolean().refine((val) => val === true, {
    message:
      "Please confirm that you want to disable two-factor authentication.",
  }),
});

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Please enter name." }),
  email: z.string().email({ message: "Please enter valid email address." }),
  phone: z
    .string()
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "Invalid phone number.",
    })
    .optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  role_id: z
    .number({ error: "Please select role." })
    .min(1, { message: "Please select role." }),
});
