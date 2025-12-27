export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const API_ROUTES = {
    LOGIN: `/login`,
    LOGOUT: `/logout`,
    SIGNUP: `/signup`,
    FORGOT_PASSWORD: `/forgot_password`,
    RESET_PASSWORD: `/reset_password`,
    DEPARTMENTS: `/departments`,
    EQUIPMENT: `/equipment`,
    MAINTENANCE_TEAMS: `/maintenance_teams`,
    MAINTENANCE_REQUESTS: `/maintenance_requests`,
}

export const PAGE_ROUTES = {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    SIGNUP: "/auth/signup",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    HOME: '/'
}

export const AUTH_CONTENT = {
    FORGOT_PASSWORD: {
        TITLE: "Forgot Password",
        DESCRIPTION: "Enter your email address and we'll send you a link to reset your password.",
        BUTTON: "Send Reset Link",
        BACK_TO_LOGIN: "Back to Login",
        SUCCESS_TITLE: "Check your email",
        SUCCESS_DESCRIPTION: "We have sent a password reset link to your email."
    },
    RESET_PASSWORD: {
        TITLE: "Reset Password",
        DESCRIPTION: "Enter your new password below.",
        BUTTON: "Reset Password",
        SUCCESS_TITLE: "Password Reset",
        SUCCESS_DESCRIPTION: "Your password has been successfully reset. You can now login.",
        BACK_TO_LOGIN: "Back to Login"
    }
}