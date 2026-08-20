"use client";

import { useState } from "react";
import AccordionBlockItem, {
  type AccordionItem,
} from "../accordionBlockItem";
import styles from "./styles.module.scss";

export type { AccordionItem };

type Props = {
  items: AccordionItem[];
  showNumbers: boolean;
  toggleIcon: "plusMinus" | "chevron";
  openFirstItem: boolean;
  allowMultipleOpen: boolean;
  headingLevel: "h2" | "h3";
};

export default function AccordionBlockList({
  items,
  showNumbers,
  toggleIcon,
  openFirstItem,
  allowMultipleOpen,
  headingLevel,
}: Props) {
  const firstKey = items[0]?._key ?? "";
  const [open, setOpen] = useState<string[]>(
    openFirstItem && firstKey ? [firstKey] : [],
  );

  const toggle = (key: string) =>
    setOpen((current) => {
      const isOpen = current.includes(key);
      if (!allowMultipleOpen) return isOpen ? [] : [key];
      return isOpen ? current.filter((k) => k !== key) : [...current, key];
    });

  return (
    <div className={styles.list}>
      {items.map((item, i) => (
        <AccordionBlockItem
          key={item._key || i}
          item={item}
          number={i + 1}
          showNumber={showNumbers}
          toggleIcon={toggleIcon}
          isOpen={open.includes(item._key)}
          onToggle={() => toggle(item._key)}
          headingLevel={headingLevel}
        />
      ))}
    </div>
  );
}
