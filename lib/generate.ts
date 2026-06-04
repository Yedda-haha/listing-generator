import { MARKETPLACES, type ListingResult } from "./constants";
import { buildUserPrompt } from "./prompts";

interface GenerateConfig {
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

async function generateOne(
  productInfo: string,
  mpId: string,
  apiKey: string,
  baseUrl: string,
  llmModel: string,
  systemPrompt: string,
  corsProxy: string
): Promise<ListingResult> {
  const mp = MARKETPLACES.find((m) => m.id === mpId);
  if (!mp) throw new Error(`Unknown marketplace: ${mpId}`);

  const userPrompt = buildUserPrompt(productInfo, mp.label, mp.language);
  const apiUrl = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;

  const apiBody = {
    model: llmModel,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
  };

  let response: Response;

  if (corsProxy) {
    // Use custom CORS proxy (Cloudflare Worker)
    response = await fetch(corsProxy.replace(/\/+$/, ""), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: apiUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: apiBody,
      }),
    });
  } else {
    // Direct call (for local dev)
    response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(apiBody),
    });
  }

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error (${mpId}): ${response.status} ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(`Empty response for ${mpId}`);
  }

  // Strip markdown code blocks if present
  let jsonStr = content.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  }
  // Extract JSON object if embedded in text
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }

  const parsed = JSON.parse(jsonStr);

  return {
    marketplace: mpId,
    title: parsed.title || "",
    bulletPoints: parsed.bulletPoints || [],
    description: parsed.description || "",
    searchTerms: parsed.searchTerms || [],
  };
}

export async function generateAll(config: GenerateConfig): Promise<ListingResult[]> {
  let productInfo = `产品型号：${config.model}\n产品参数：\n${config.specs}`;
  if (config.asins && config.asins.length > 0) {
    productInfo += `\n竞品 ASIN：${config.asins.join(", ")}`;
  }

  const promises = config.marketplaces.map((mpId) =>
    generateOne(productInfo, mpId, config.apiKey, config.baseUrl, config.llmModel, config.systemPrompt, config.corsProxy)
  );

  return Promise.all(promises);
}
