"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, MapPin, User as UserIcon, Calendar, ShieldCheck, Zap, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Equipment, MaintenanceTeam } from "@/types";

interface EquipmentCardProps {
  equipment: Equipment;
  teams?: MaintenanceTeam[];
  onMaintenanceClick?: (id: string) => void;
}

export function EquipmentCard({ equipment, teams, onMaintenanceClick }: EquipmentCardProps) {
  const team = teams?.find((t) => String(t.id) === String(equipment.maintenanceTeamId));
  const isScrapped = equipment.status === "scrapped";

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:ring-2 hover:ring-primary/20",
        isScrapped && "opacity-60 grayscale"
      )}
    >
      <CardHeader className="p-5 pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <Badge
            variant={isScrapped ? "destructive" : "success"}
            className="rounded-md font-bold uppercase tracking-wider text-[9px]"
          >
            {equipment.status}
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
          {equipment.name}
        </CardTitle>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-tighter mt-1 opacity-70">
          <Tag className="w-3 h-3" />
          {equipment.serialNumber}
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-4">
        <div className="grid grid-cols-1 gap-2.5">
          <div className="flex items-center gap-2.5 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-muted-foreground/80">{equipment.location}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <UserIcon className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-muted-foreground/80">{equipment.ownerId}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <ShieldCheck className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-muted-foreground/80">{team?.name || "No Team"}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-40 mb-2">
            Equipment Category
          </p>
          <Badge variant="secondary" className="font-medium text-xs px-2.5">
            {equipment.category}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-0 border-t border-border/50">
        <Button
          variant="ghost"
          className="w-full h-12 rounded-none gap-2 text-primary font-bold hover:bg-primary/5 transition-all text-sm group/btn"
          disabled={isScrapped}
          onClick={() => onMaintenanceClick?.(equipment.id)}
        >
          <Settings className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-500" />
          Smart Maintenance
          <Badge className="ml-1 bg-primary/10 text-primary hover:bg-primary/10 border-none px-1.5 py-0">
            2
          </Badge>
        </Button>
      </CardFooter>
    </Card>
  );
}
