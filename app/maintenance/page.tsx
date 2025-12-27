import MaintenanceClient from "./maintenance-client";

export const metadata = {
  title: "Maintenance Records | GearGuard",
  description: "Detailed log of all service activities and equipment status.",
};

export default function MaintenancePage() {
  return <MaintenanceClient />;
}
