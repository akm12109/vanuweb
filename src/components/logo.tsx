import Link from "next/link";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoProps = {
  isFooter?: boolean;
}

export function Logo({ isFooter = false }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Vanu Organic Home">
      <Leaf className={cn("h-7 w-7", isFooter ? "text-accent" : "text-primary")} />
      <span className={cn(
        "font-headline text-xl font-bold",
        isFooter ? "text-primary-foreground" : "text-foreground"
      )}>
        Vanu Organic
      </span>
    </Link>
  );
}
