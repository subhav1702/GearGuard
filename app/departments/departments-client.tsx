"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Plus, Building2, Loader2, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsApi, Department } from "@/lib/api/departments";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateDepartmentDialog } from "@/components/departments/CreateDepartmentDialog";

export function DepartmentsClient() {
    const [search, setSearch] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const queryClient = useQueryClient();

    const { data: departments = [], isLoading } = useQuery<Department[]>({
        queryKey: ["departments"],
        queryFn: () => departmentsApi.getAll(),
    });

    const deleteMutation = useMutation({
        mutationFn: departmentsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["departments"] });
            toast.success("Department deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete department");
        },
    });

    const filteredDepartments = departments.filter((dept) =>
        dept.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (dept: Department) => {
        setEditingDepartment(dept);
        setIsCreateDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this department? This may affect associated teams and equipment.")) {
            deleteMutation.mutate(id);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsCreateDialogOpen(open);
        if (!open) setEditingDepartment(null);
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
                        Departments
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">
                        Manage and organize your organization's structural units.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => {
                            setEditingDepartment(null);
                            setIsCreateDialogOpen(true);
                        }}
                        className="rounded-xl px-4 gap-2 h-11 bg-slate-900 hover:bg-slate-800 text-white premium-shadow"
                    >
                        <Plus className="w-4 h-4" />
                        Add Department
                    </Button>
                </div>
            </div>

            <CreateDepartmentDialog
                open={isCreateDialogOpen}
                onOpenChange={handleOpenChange}
                department={editingDepartment}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ["departments"] })}
            />

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search departments..."
                        className="pl-10 h-11 border-border/60 bg-white/50 focus-visible:ring-primary/10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDepartments.map((dept) => (
                    <div
                        key={dept.id}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl">
                                    <DropdownMenuItem className="gap-2" onClick={() => handleEdit(dept)}>
                                        <Edit className="w-4 h-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="gap-2 text-destructive focus:text-destructive"
                                        onClick={() => handleDelete(dept.id)}
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900">{dept.name}</h3>
                            <p className="text-xs font-medium text-slate-400">ID: {dept.id}</p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                            <Badge variant="secondary" className="bg-slate-50 text-slate-600 border-none font-bold">
                                Active
                            </Badge>
                            <Button variant="link" className="text-xs font-bold text-slate-400 hover:text-slate-900 p-0 h-auto">
                                View Teams →
                            </Button>
                        </div>
                    </div>
                ))}

                {filteredDepartments.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                        <p className="text-slate-400 font-bold">No departments found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
