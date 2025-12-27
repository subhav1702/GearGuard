"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Plus, Users, Loader2, MoreVertical, Edit, Trash2, UserPlus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamsApi, MaintenanceTeam } from "@/lib/api/teams";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreateTeamDialog } from "@/components/teams/CreateTeamDialog";
import { AddMemberDialog } from "@/components/teams/AddMemberDialog";

export default function TeamsClient() {
    const [search, setSearch] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<MaintenanceTeam | null>(null);
    const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data: teams = [], isLoading } = useQuery<MaintenanceTeam[]>({
        queryKey: ["teams"],
        queryFn: () => teamsApi.getAll(),
    });

    const deleteMutation = useMutation({
        mutationFn: teamsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
            toast.success("Team deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete team");
        },
    });

    const removeMemberMutation = useMutation({
        mutationFn: ({ teamId, userId }: { teamId: string; userId: number }) =>
            teamsApi.removeMember(teamId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
            toast.success("Member removed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to remove member");
        },
    });

    const filteredTeams = teams.filter((team) =>
        team.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (team: MaintenanceTeam) => {
        setEditingTeam(team);
        setIsCreateDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this maintenance team?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleAddMember = (teamId: string) => {
        setActiveTeamId(teamId);
        setIsAddMemberDialogOpen(true);
    };

    const handleRemoveMember = (teamId: string, userId: number, name: string) => {
        if (confirm(`Are you sure you want to remove ${name} from this team?`)) {
            removeMemberMutation.mutate({ teamId, userId });
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsCreateDialogOpen(open);
        if (!open) setEditingTeam(null);
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Maintenance Teams
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">
                        Manage your specialized maintenance groups and their members.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => {
                            setEditingTeam(null);
                            setIsCreateDialogOpen(true);
                        }}
                        className="rounded-xl px-4 gap-2 h-11 bg-slate-900 hover:bg-slate-800 text-white premium-shadow"
                    >
                        <Plus className="w-4 h-4" />
                        Create Team
                    </Button>
                </div>
            </div>

            <CreateTeamDialog
                open={isCreateDialogOpen}
                onOpenChange={handleOpenChange}
                team={editingTeam}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ["teams"] })}
            />

            <AddMemberDialog
                open={isAddMemberDialogOpen}
                onOpenChange={setIsAddMemberDialogOpen}
                teamId={activeTeamId}
            />

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search teams by name..."
                        className="pl-10 h-11 border-border/60 bg-white/50 focus-visible:ring-primary/10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeams.map((team) => (
                    <div
                        key={team.id}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Users className="w-6 h-6" />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl">
                                    <DropdownMenuItem className="gap-2" onClick={() => handleEdit(team)}>
                                        <Edit className="w-4 h-4" /> Edit Team
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2" onClick={() => handleAddMember(team.id)}>
                                        <UserPlus className="w-4 h-4" /> Add Member
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="gap-2 text-destructive focus:text-destructive"
                                        onClick={() => handleDelete(team.id)}
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete Team
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900">{team.name}</h3>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                <Building2 className="w-3.5 h-3.5" />
                                Department ID: {team.department_id}
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Members ({team.members?.length || 0})</span>
                                <Button
                                    variant="link"
                                    className="text-[10px] font-bold text-blue-600 p-0 h-auto uppercase"
                                    onClick={() => handleAddMember(team.id)}
                                >
                                    Add
                                </Button>
                            </div>

                            <div className="flex -space-x-2 overflow-hidden">
                                {team.members?.slice(0, 5).map((member) => (
                                    <div
                                        key={member.id}
                                        className="relative group/member"
                                        onClick={() => handleRemoveMember(team.id, member.id, member.name)}
                                    >
                                        <Avatar className="border-2 border-white w-8 h-8 cursor-pointer hover:border-red-500 transition-colors">
                                            <AvatarFallback className="text-[10px] font-bold bg-slate-100 text-slate-600 group-hover/member:bg-red-50 group-hover/member:text-red-600">
                                                {member.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                ))}
                                {(team.members?.length || 0) > 5 && (
                                    <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                                        +{(team.members?.length || 0) - 5}
                                    </div>
                                )}
                                {(team.members?.length || 0) === 0 && (
                                    <span className="text-xs text-slate-400 italic">No members yet</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredTeams.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                        <p className="text-slate-400 font-bold">No maintenance teams found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
