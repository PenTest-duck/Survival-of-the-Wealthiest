from fastapi import FastAPI
from crewai import Agent, Crew
from dotenv import load_dotenv
from agents_store import AGENTS_STORE, create_agent
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from crew import kickoff_everyone, SP500InvestmentTickAgentCrew

# List of 100 potential stock trading strategies
TRADING_STRATEGIES = [
    "Go all in on Apple. Buy as many Apple stocks as possible.",
    "Focus on tech companies, buy and hold.",
    "Invest 80% in health companies, with 20% in sustainability companies. Be aggressive",
    "Dollar-cost average into S&P 500 index funds monthly",
    "Buy low, sell high on blue-chip dividend stocks",
    "Momentum trading on high-volume tech stocks",
    "Value investing in undervalued financial sector stocks",
    "Swing trading with 5-10% stop losses",
    "Dividend growth strategy focusing on utilities",
    "Growth investing in emerging market ETFs",
    "Contrarian approach during market corrections",
    "Sector rotation based on economic cycles",
    "Options trading with covered calls on stable stocks",
    "Small-cap value stock hunting",
    "REITs for consistent income generation",
    "ESG-focused sustainable investing",
    "Meme stock momentum trading",
    "Defensive stocks during market volatility",
    "Cyclical stocks during economic expansion",
    "International diversification with ADRs",
    "Penny stock speculation with strict risk management",
    "Blue-chip defensive stocks for retirement",
    "High-frequency algorithmic trading",
    "Pairs trading with correlated stocks",
    "Arbitrage opportunities between exchanges",
    "IPO and SPAC speculation",
    "Biotech breakthrough stock hunting",
    "Energy sector contrarian investing",
    "Consumer staples during recessions",
    "Merger and acquisition arbitrage",
    "Short selling overvalued stocks",
    "Long-short market neutral strategy",
    "Event-driven trading around earnings",
    "Seasonal trading patterns",
    "Technical analysis with moving averages",
    "Fundamental analysis with P/E ratios",
    "Quantitative factor-based investing",
    "Risk parity portfolio allocation",
    "Tactical asset allocation",
    "Core-satellite portfolio approach",
    "Barbell strategy: safe bonds + growth stocks",
    "Ladder strategy with bond ETFs",
    "Barbell approach: 50% cash, 50% aggressive growth",
    "Dogs of the Dow strategy",
    "CAN SLIM growth stock methodology",
    "GARP: Growth at a Reasonable Price",
    "Deep value investing in distressed companies",
    "Quality factor investing",
    "Low volatility factor strategy",
    "High beta momentum trading",
    "Dividend aristocrats focus",
    "Small-cap growth stock hunting",
    "Mid-cap balanced approach",
    "Large-cap stability focus",
    "Micro-cap speculation",
    "Emerging market growth stocks",
    "Frontier market exploration",
    "Developed market value stocks",
    "Commodity-linked equity exposure",
    "Currency-hedged international stocks",
    "Sector-specific thematic investing",
    "Climate change adaptation stocks",
    "Digital transformation beneficiaries",
    "E-commerce disruption plays",
    "Fintech innovation stocks",
    "Healthcare technology revolution",
    "Electric vehicle ecosystem stocks",
    "Renewable energy transition plays",
    "Space exploration and satellite stocks",
    "Artificial intelligence and machine learning",
    "Blockchain and cryptocurrency related",
    "Cybersecurity growth stocks",
    "Cloud computing infrastructure",
    "5G network expansion beneficiaries",
    "Internet of Things (IoT) stocks",
    "Robotics and automation companies",
    "Genetic medicine breakthroughs",
    "Precision agriculture technology",
    "Smart city infrastructure stocks",
    "Electric grid modernization",
    "Water technology and conservation",
    "Waste management innovation",
    "Sustainable packaging solutions",
    "Plant-based food alternatives",
    "Vertical farming technology",
    "Alternative protein sources",
    "Mental health and wellness apps",
    "Telemedicine platform providers",
    "Digital fitness and wellness",
    "Remote work technology solutions",
    "E-learning platform providers",
    "Digital entertainment streaming",
    "Gaming and esports companies",
    "Social media platform stocks",
    "Digital advertising technology",
    "E-commerce logistics and delivery",
    "Supply chain technology solutions",
    "Digital payment processors",
    "Cryptocurrency exchange platforms",
    "Decentralized finance (DeFi)",
    "Non-fungible token (NFT) platforms",
    "Metaverse and virtual reality",
    "Augmented reality applications",
    "Quantum computing companies",
    "Edge computing infrastructure",
    "Data center real estate",
    "Semiconductor manufacturing",
    "Advanced materials science",
    "Nanotechnology applications",
    "Biotechnology research tools",
    "Pharmaceutical innovation",
    "Medical device manufacturers",
    "Diagnostic testing companies",
    "Preventive healthcare technology",
    "Personalized medicine platforms",
    "Gene therapy companies",
    "Cell therapy innovations",
    "Regenerative medicine stocks",
    "Anti-aging biotechnology",
    "Longevity research companies",
    "Mental health pharmaceuticals",
    "Addiction treatment solutions",
    "Pain management alternatives",
    "Sleep technology companies",
    "Fitness tracking and wearables",
    "Nutrition and supplement science",
    "Alternative medicine platforms",
    "Holistic wellness companies"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/agents")
async def get_agents():
    all_agents = list(AGENTS_STORE.values())
    # filtered_agents = [agent for agent in all_agents if agent.alive]
    sorted_agents = sorted(all_agents, key=lambda agent: agent.id)
    return [{
        "id": agent.id,
        "alive": agent.alive,
        "name": agent.name,
        "strategy": agent.strategy,
        "bank": agent.bank,
        "portfolio": agent.portfolio
    } for agent in sorted_agents]


if __name__ == "__main__":
    # Create crews first to avoid circular imports
    crew_factory = SP500InvestmentTickAgentCrew()
    
    for strategy in TRADING_STRATEGIES[:1]:
        crew = crew_factory.crew()
        create_agent(strategy, crew)
    
    # # Get all agents and pass them to kickoff_everyone
    # all_agents = list(AGENTS_STORE.values())
    # kickoff_everyone(all_agents)
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
