import LoginClient from "./login-client";

export const metadata = {
  title: "Login | GearGuard",
  description: "Access your GearGuard workspace to manage maintenance and assets.",
};

export default function LoginPage() {
  return <LoginClient />;
}
