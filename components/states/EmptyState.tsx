"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { LucideIcon, ArrowRight, Coins, Star, FilterX, SearchX } from "lucide-react";

export type EmptyStateIconName = "coins" | "star" | "filter" | "search";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  icon?: LucideIcon;
}

interface EmptyStateProps {
  icon?: LucideIcon | EmptyStateIconName;
  iconName?: EmptyStateIconName;
  iconClassName?: string;
  iconTileClassName?: string;
  title: string;
  description: string | ReactNode;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
  minHeight?: string;
  isBorderless?: boolean;
}

export default function EmptyState({
  icon,
  iconName,
  iconClassName = "text-[#FF5446]",
  iconTileClassName = "bg-[#1B2536] border-[#232B3A]",
  title,
  description,
  action,
  secondaryAction,
  className = "",
  minHeight = "min-h-[320px]",
  isBorderless = false,
}: EmptyStateProps) {
  const resolvedIconName = iconName || (typeof icon === "string" ? icon : undefined);

  const renderIcon = () => {
    const cls = `w-7 h-7 md:w-8 md:h-8 ${iconClassName}`;
    if (resolvedIconName === "coins") return <Coins className={cls} />;
    if (resolvedIconName === "star") return <Star className={cls} />;
    if (resolvedIconName === "filter") return <FilterX className={cls} />;
    if (resolvedIconName === "search") return <SearchX className={cls} />;
    if (typeof icon === "function") {
      const CustomIcon = icon;
      return <CustomIcon className={cls} />;
    }
    return <FilterX className={cls} />;
  };
  const renderAction = (act: EmptyStateAction, isSecondary = false) => {
    const ActionIcon = act.icon || (isSecondary ? undefined : ArrowRight);
    const variantStyle =
      act.variant === "secondary" || isSecondary
        ? "bg-[#1B2536] hover:bg-[#232B3A] text-[#F5F6F8] border border-[#232B3A] hover:border-[#374151]"
        : "bg-[#FF5446] hover:bg-[#D63A2F] text-white shadow-md";

    const commonClasses = `h-10 px-6 font-bold text-sm rounded-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95 group ${variantStyle}`;

    if (act.href) {
      return (
        <Link key={act.label} href={act.href} className={commonClasses}>
          <span>{act.label}</span>
          {ActionIcon && (
            <ActionIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </Link>
      );
    }

    return (
      <button
        key={act.label}
        type="button"
        onClick={act.onClick}
        className={commonClasses}
      >
        <span>{act.label}</span>
        {ActionIcon && (
          <ActionIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        )}
      </button>
    );
  };

  return (
    <div
      className={`relative overflow-hidden flex flex-col items-center justify-center text-center p-8 md:p-12 ${minHeight} ${
        isBorderless
          ? "bg-transparent"
          : "bg-[#111827] border border-[#232B3A] rounded-[10px] shadow-lg"
      } ${className}`}
    >
      {/* Centered Icon Tile */}
      <div
        className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border flex items-center justify-center mb-4 md:mb-5 shadow-sm relative ${iconTileClassName}`}
      >
        {renderIcon()}
      </div>

      {/* Heading */}
      <h3 className="text-lg md:text-xl font-bold text-white mb-2 tracking-tight">
        {title}
      </h3>

      {/* Supporting Text */}
      <div className="text-xs md:text-sm text-[#9AA4B2] max-w-sm mb-6 leading-relaxed">
        {typeof description === "string" ? <p>{description}</p> : description}
      </div>

      {/* Primary & Secondary Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {action && renderAction(action, false)}
          {secondaryAction && renderAction(secondaryAction, true)}
        </div>
      )}
    </div>
  );
}
