import type { LucideIcon } from "lucide-react";
import type { NavItem } from "@/types";
import { TextLink } from "@/components/common";

export function EditorialRow({
  index,
  icon: Icon,
  title,
  description,
  cta,
  to,
}: {
  index: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  to: NavItem["to"];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 border-t py-10 md:grid-cols-12 md:gap-8">
      <div className="flex items-center gap-4 md:col-span-1">
        <span className="font-serif text-xl text-muted-foreground">{index}</span>
      </div>
      <div className="flex items-start gap-4 md:col-span-4">
        <Icon className="mt-2 h-5 w-5 shrink-0 text-accent" aria-hidden />
        <h3 className="text-3xl leading-tight">{title}</h3>
      </div>
      <p className="text-muted-foreground md:col-span-5">{description}</p>
      <div className="md:col-span-2 md:text-right">
        <TextLink to={to}>{cta}</TextLink>
      </div>
    </div>
  );
}
