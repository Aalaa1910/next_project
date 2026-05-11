"use client";

import { useState } from "react";

type DescriptionToggleProps = {
  text: string;
  maxLength?: number;
  className?: string;
};

export default function DescriptionToggle({
  text,
  maxLength = 110,
  className = "text-sm text-gray-600 leading-relaxed",
}: DescriptionToggleProps) {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <p className={className}>{text}</p>;
  }

  const visibleText = expanded ? text : `${text.slice(0, maxLength).trim()}...`;

  return (
    <div className="space-y-2">
      <p className={className}>{visibleText}</p>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="text-sm font-medium text-brand hover:text-brand-hover transition"
      >
        {expanded ? "See less" : "See more"}
      </button>
    </div>
  );
}
