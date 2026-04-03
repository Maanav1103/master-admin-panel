import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

function TooltipWrapper({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        // className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm shadow-md animate-fade-in"
        className="max-w-sm bg-gray-800 text-white text-xs px-3 py-1 rounded-md shadow-md whitespace-normal"
        sideOffset={4}
      >
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default TooltipWrapper;

{/* <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
  <div className="max-w-xs bg-gray-800 text-white text-xs px-3 py-1 rounded-md shadow-md whitespace-normal text-center">
    {group?.description}
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
  </div>
</div> */}