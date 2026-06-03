export interface Category {
  id: string;
  label: string;
  icon: string;
  systemPrompt: string;
  modelPlaceholder: string;
  specsPlaceholder: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "battery",
    label: "新能源电池",
    icon: "🔋",
    systemPrompt:
      "你是资深 Amazon Listing 优化专家，精通新能源电池产品（磷酸铁锂电池、太阳能储能电池、房车电池、船用电池等）。你熟悉电池行业的技术参数（容量、电压、循环寿命、BMS、放电倍率等）和认证标准（UN38.3、CE、UL1973等）。请根据产品信息生成高质量的 Listing 内容。始终以 JSON 格式输出。",
    modelPlaceholder: "例如：LiFePO4-12V100Ah",
    specsPlaceholder:
      "容量：100Ah\n电压：12.8V\n尺寸：330×172×215mm\n重量：10.5kg\n材质：磷酸铁锂（LiFePO4）\n循环寿命：4000+次\nBMS：内置智能BMS\n认证：UN38.3, CE, UL1973",
  },
  {
    id: "bbq",
    label: "烧烤烤盘",
    icon: "🔥",
    systemPrompt:
      "你是资深 Amazon Listing 优化专家，精通户外烧烤用品品类（烧烤烤盘、烤网、烤炉配件、铸铁烤盘、不锈钢烤盘等）。你熟悉烧烤用品的材质特性（铸铁、不锈钢、铝合金、陶瓷涂层）、工艺（压铸、冲压、手工锻造）、使用场景（露营、家庭BBQ、商用厨房）和安全认证（FDA、LFGB、SGS）。请根据产品信息生成高质量的 Listing 内容。始终以 JSON 格式输出。",
    modelPlaceholder: "例如：铸铁烧烤烤盘 35cm",
    specsPlaceholder:
      "材质：铸铁\n尺寸：直径35cm\n重量：3.2kg\n涂层：植物油养护层\n适用：燃气灶、烤炉、篝火\n特点：导热均匀、不粘、可拆卸手柄\n认证：FDA, LFGB",
  },
  {
    id: "fashion",
    label: "女装",
    icon: "👗",
    systemPrompt:
      "你是资深 Amazon Listing 优化专家，精通女装品类（连衣裙、上衣、裤装、外套、运动服等）。你熟悉女装的面料特性（棉、涤纶、莫代尔、天丝、真丝）、版型设计（修身、宽松、A字、直筒）、尺码体系（US/EU/UK/JP）、季节搭配和流行趋势。请根据产品信息生成高质量的 Listing 内容。始终以 JSON 格式输出。",
    modelPlaceholder: "例如：女装碎花连衣裙",
    specsPlaceholder:
      "面料：95%涤纶 + 5%弹性纤维\n版型：A字裙，修身收腰\n尺码：XS-XXL（美码）\n季节：春夏\n特点：V领、碎花印花、侧拉链、可机洗\n颜色：蓝色碎花、红色碎花、黑色",
  },
];

export interface Marketplace {
  id: string;
  label: string;
  domain: string;
  language: string;
  languageCode: string;
}

export const MARKETPLACES: Marketplace[] = [
  { id: "US", label: "Amazon US", domain: "amazon.com", language: "English", languageCode: "en" },
  { id: "DE", label: "Amazon DE", domain: "amazon.de", language: "German", languageCode: "de" },
  { id: "FR", label: "Amazon FR", domain: "amazon.fr", language: "French", languageCode: "fr" },
  { id: "IT", label: "Amazon IT", domain: "amazon.it", language: "Italian", languageCode: "it" },
  { id: "ES", label: "Amazon ES", domain: "amazon.es", language: "Spanish", languageCode: "es" },
  { id: "JP", label: "Amazon JP", domain: "amazon.co.jp", language: "Japanese", languageCode: "ja" },
];

export interface ListingResult {
  marketplace: string;
  title: string;
  bulletPoints: string[];
  description: string;
  searchTerms: string[];
}
