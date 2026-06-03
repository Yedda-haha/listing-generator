import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/listing-generator", // 改成你的仓库名；如果是 用户名.github.io 则删掉这行
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
