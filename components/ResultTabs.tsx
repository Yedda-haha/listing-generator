"use client";

import { useState } from "react";
import { MARKETPLACES, type ListingResult } from "@/lib/constants";
import CopyButton from "./CopyButton";

interface ResultTabsProps {
  results: ListingResult[];
}

export default function ResultTabs({ results }: ResultTabsProps) {
  const [activeTab, setActiveTab] = useState(results[0]?.marketplace ?? "");

  const active = results.find((r) => r.marketplace === activeTab);
  const mpInfo = MARKETPLACES.find((m) => m.id === activeTab);

  const copyAllText = active
    ? `Title\n${active.title}\n\nBullet Points\n${active.bulletPoints.map((b, i) => `${i + 1}. ${b}`).join("\n")}\n\nDescription\n${active.description}\n\nSearch Terms\n${active.searchTerms.join(", ")}`
    : "";

  if (!active) return null;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        {results.map((r) => {
          const mp = MARKETPLACES.find((m) => m.id === r.marketplace);
          return (
            <button
              key={r.marketplace}
              onClick={() => setActiveTab(r.marketplace)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === r.marketplace
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {mp?.label ?? r.marketplace}
            </button>
          );
        })}
      </div>

      {/* Copy All */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {mpInfo?.label} — {mpInfo?.language}
        </h3>
        <CopyButton text={copyAllText} label="复制全部" />
      </div>

      {/* Title */}
      <Section title="Title" text={active.title}>
        <p className="font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
          {active.title}
        </p>
      </Section>

      {/* Bullet Points */}
      <Section title="Bullet Points" text={active.bulletPoints.map((b, i) => `${i + 1}. ${b}`).join("\n")}>
        <ol className="list-decimal list-inside space-y-2">
          {active.bulletPoints.map((bp, i) => (
            <li key={i} className="font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200">
              {bp}
            </li>
          ))}
        </ol>
      </Section>

      {/* Description */}
      <Section title="Description" text={active.description}>
        <p className="font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
          {active.description}
        </p>
      </Section>

      {/* Search Terms */}
      <Section title="Search Terms" text={active.searchTerms.join("\n")}>
        <div className="flex flex-wrap gap-2">
          {active.searchTerms.map((st, i) => (
            <span
              key={i}
              className="inline-block rounded-md bg-gray-100 px-3 py-1.5 font-mono text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {st}
            </span>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
        <CopyButton text={text} />
      </div>
      {children}
    </div>
  );
}
