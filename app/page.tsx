"use client";

import { useState } from "react";
import ProductForm from "@/components/ProductForm";
import ResultTabs from "@/components/ResultTabs";
import ThemeToggle from "@/components/ThemeToggle";
import { generateAll } from "@/lib/generate";
import type { ListingResult } from "@/lib/constants";

export default function Home() {
  const [results, setResults] = useState<ListingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: {
    model: string;
    specs: string;
    marketplaces: string[];
    asins: string[];
    apiKey: string;
    baseUrl: string;
    llmModel: string;
    systemPrompt: string;
    corsProxy: string;
  }) => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const results = await generateAll(data);
      setResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Amazon Listing Generator
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Form Section */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
            产品信息
          </h2>
          <ProductForm onGenerate={handleGenerate} loading={loading} />
        </section>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            <strong>错误：</strong> {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-12 dark:border-gray-800 dark:bg-gray-900">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              正在为各站点生成 Listing，请稍候...
            </p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && !loading && (
          <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
              生成结果
            </h2>
            <ResultTabs results={results} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400 dark:border-gray-800 dark:text-gray-600">
        Amazon Listing Generator — Powered by LLM
      </footer>
    </div>
  );
}
