
import { DepartmentsClient } from "./departments-client";

export const metadata = {
    title: "Departments | GearGuard",
    description: "Manage your organization's departments.",
};

export default function DepartmentsPage() {
    return <DepartmentsClient />;
}
