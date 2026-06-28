import portfolioData from "@/data/portfolio.json";
import type { PortfolioData } from "@/data/types";
import { PortfolioShell } from "@/components/PortfolioShell";

const data = portfolioData as PortfolioData;

export default function Home() {
  return <PortfolioShell data={data} />;
}
