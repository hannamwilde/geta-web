"use client";

export default function BackButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <button className={className} onClick={() => history.back()}>
      {label}
    </button>
  );
}
