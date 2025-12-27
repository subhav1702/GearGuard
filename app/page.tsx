import MaintenanceClient from "./maintenance/maintenance-client";

export const metadata = {
  title: "Dashboard | GearGuard",
  description: "Manage and track your equipment service pipeline.",
};

export default function Home() {
  return <MaintenanceClient />;
}
