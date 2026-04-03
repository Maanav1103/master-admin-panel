"use client";

import TooltipWrapper from "./TooltipWrapper";

type TableActionButtonProps = {
  label: string;
  color: string;
  Icon: any;
  onClick?: () => void;
};

export const TableActionButton = ({
  label,
  onClick,
  color,
  Icon,
}: TableActionButtonProps) => {
  const iconWrapper =
    "group rounded-md bg-muted p-2 border border-transparent transition hover:border-orange-600 hover:bg-accent";
  const iconStyle = "h-4 w-4 text-muted-foreground group-hover:text-violet-600";

  return (
    <TooltipWrapper content={label}>
      <button
        onClick={onClick}
        className={iconWrapper}
        aria-label={label}
        type="button"
      >
        <Icon className={`${iconStyle} ${color}`} />
      </button>
    </TooltipWrapper>
  );
};
