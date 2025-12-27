import TeamsClient from "./teams-client";

export const metadata = {
    title: "Maintenance Teams | GearGuard",
    description: "Manage your maintenance teams and members.",
};

export default function TeamsPage() {
    return <TeamsClient />;
}
