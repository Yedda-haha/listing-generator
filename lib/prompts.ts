export const SYSTEM_PROMPT = `你是资深 Amazon Listing 优化专家，精通新能源电池产品。
请根据产品信息生成高质量的 Listing 内容。
始终以 JSON 格式输出，不要包含任何其他文本。`;

export function buildUserPrompt(
  productInfo: string,
  marketplace: string,
  language: string
): string {
  return `产品信息：${productInfo}
目标站点：${marketplace}
目标语言：${language}

请生成：
1. Title（遵循 Amazon 字符限制，品牌名+核心关键词+产品特性+适用场景）
2. Bullet Points（5 条，每条突出一个卖点，包含技术参数）
3. Description（200-500 字，突出差异化优势）
4. Search Terms（5 组后台关键词）

输出 JSON 格式：
{
  "title": "...",
  "bulletPoints": ["...", "...", "...", "...", "..."],
  "description": "...",
  "searchTerms": ["...", "...", "...", "...", "..."]
}`;
}
