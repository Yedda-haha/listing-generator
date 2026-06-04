"use client";

import { useState, useEffect } from "react";
import { MARKETPLACES, CATEGORIES } from "@/lib/constants";

interface FormData {
  model: string;
  specs: string;
  marketplaces: string[];
  asins: string[];
  apiKey: string;
  baseUrl: string;
  llmModel: string;
  systemPrompt: string;
  corsProxy: string;
}

interface ProductFormProps {
  onGenerate: (data: FormData) => void;
  loading: boolean;
}

export default function ProductForm({ onGenerate, loading }: ProductFormProps) {
  const [category, setCategory] = useState("battery");
  const [model, setModel] = useState("");
  const [specs, setSpecs] = useState("");
  const [marketplaces, setMarketplaces] = useState<string[]>(["US"]);
  const [asinInputs, setAsinInputs] = useState<string[]>([""]);

  // API config
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://api.siliconflow.cn/v1");
  const [llmModel, setLlmModel] = useState("XiaomiMiMo/MiMo-7B-RL");
  const [corsProxy, setCorsProxy] = useState("https://corsproxy.io");
  const [showConfig, setShowConfig] = useState(false);

  const activeCategory = CATEGORIES.find((c) => c.id === category)!;

  // Load saved config from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("listing-gen-config");
    if (saved) {
      try {
        const cfg = JSON.parse(saved);
        if (cfg.apiKey) setApiKey(cfg.apiKey);
        if (cfg.baseUrl) setBaseUrl(cfg.baseUrl);
        if (cfg.llmModel) setLlmModel(cfg.llmModel);
        if (cfg.corsProxy !== undefined) setCorsProxy(cfg.corsProxy);
      } catch {}
    }
  }, []);

  const toggleMarketplace = (id: string) => {
    setMarketplaces((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const addAsin = () => {
    if (asinInputs.length < 3) {
      setAsinInputs([...asinInputs, ""]);
    }
  };

  const updateAsin = (index: number, value: string) => {
    const updated = [...asinInputs];
    updated[index] = value;
    setAsinInputs(updated);
  };

  const removeAsin = (index: number) => {
    setAsinInputs(asinInputs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      "listing-gen-config",
      JSON.stringify({ apiKey, baseUrl, llmModel, corsProxy })
    );
    onGenerate({
      model,
      specs,
      marketplaces,
      asins: asinInputs.filter((a) => a.trim()),
      apiKey,
      baseUrl,
      llmModel,
      systemPrompt: activeCategory.systemPrompt,
      corsProxy,
    });
  };

  const inputCls =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* API Config Toggle */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <button
          type="button"
          onClick={() => setShowConfig(!showConfig)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-amber-800 dark:text-amber-200 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            API 配置
            {apiKey ? (
              <span className="text-green-600 dark:text-green-400 text-xs">已配置</span>
            ) : (
              <span className="text-red-500 dark:text-red-400 text-xs">未配置</span>
            )}
          </span>
          <svg
            className={`h-4 w-4 transition-transform ${showConfig ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showConfig && (
          <div className="border-t border-amber-200 dark:border-amber-800 px-4 py-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-amber-800 dark:text-amber-200 mb-1">
                API Key <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className={inputCls}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-amber-800 dark:text-amber-200 mb-1">
                  Base URL
                </label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.openai.com/v1"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-amber-800 dark:text-amber-200 mb-1">
                  模型
                </label>
                <input
                  type="text"
                  value={llmModel}
                  onChange={(e) => setLlmModel(e.target.value)}
                  placeholder="gpt-4o"
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-amber-800 dark:text-amber-200 mb-1">
                CORS 代理 <span className="text-amber-500">（解决浏览器跨域问题）</span>
              </label>
              <input
                type="text"
                value={corsProxy}
                onChange={(e) => setCorsProxy(e.target.value)}
                placeholder="https://corsproxy.io"
                className={inputCls}
              />
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              配置保存在浏览器本地，不会上传到服务器。支持 OpenAI 兼容接口（硅基流动、DeepSeek、通义千问等）。
            </p>
          </div>
        )}
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          产品品类
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                category === cat.id
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/40 dark:text-blue-300"
                  : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500"
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Model */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          产品型号
        </label>
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder={activeCategory.modelPlaceholder}
          className={inputCls}
          required
        />
      </div>

      {/* Product Specs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          产品参数
        </label>
        <textarea
          value={specs}
          onChange={(e) => setSpecs(e.target.value)}
          placeholder={activeCategory.specsPlaceholder}
          rows={6}
          className={`${inputCls} font-mono`}
          required
        />
      </div>

      {/* Marketplace Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          目标站点
        </label>
        <div className="flex flex-wrap gap-2">
          {MARKETPLACES.map((mp) => (
            <button
              key={mp.id}
              type="button"
              onClick={() => toggleMarketplace(mp.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                marketplaces.includes(mp.id)
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/40 dark:text-blue-300"
                  : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500"
              }`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  marketplaces.includes(mp.id)
                    ? "bg-blue-500 dark:bg-blue-400"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
              {mp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Competitor ASINs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          竞品 ASIN{" "}
          <span className="text-gray-400 font-normal">（可选，最多 3 个）</span>
        </label>
        <div className="space-y-2">
          {asinInputs.map((asin, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={asin}
                onChange={(e) => updateAsin(i, e.target.value)}
                placeholder={`ASIN ${i + 1}`}
                className={`${inputCls} font-mono`}
              />
              {asinInputs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAsin(i)}
                  className="rounded-lg border border-gray-300 px-3 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors dark:border-gray-600 dark:hover:border-red-500 cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {asinInputs.length < 3 && (
            <button
              type="button"
              onClick={addAsin}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
            >
              + 添加 ASIN
            </button>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || marketplaces.length === 0 || !apiKey}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            正在生成...
          </>
        ) : !apiKey ? (
          "请先配置 API Key"
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            生成 Listing
          </>
        )}
      </button>
    </form>
  );
}
