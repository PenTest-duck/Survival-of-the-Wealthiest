import os
from typing import Any, Dict, List
from crewai import LLM
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
import json
import asyncio
from stocks import get_current_stocks, get_portfolio_data, set_kickoff_callback

# Import the Agent model type for type hints
from agents_store import Agent as AgentModel, create_agent
from agents_store import AGENTS_STORE

@CrewBase
class SP500InvestmentTickAgentCrew:
    """SP500InvestmentTickAgent crew"""
    
    @agent
    def s_p_500_investment_decision_maker(self) -> Agent:
        
        return Agent(
            config=self.agents_config["s_p_500_investment_decision_maker"],
            tools=[

            ],
            reasoning=False,
            inject_date=True,
            llm=LLM(
                model="gpt-4o-mini",
                temperature=0.7,
            ),
        )

    @task
    def make_investment_decision(self) -> Task:
        return Task(
            config=self.tasks_config["make_investment_decision"],
        )

    @crew
    def crew(self) -> Crew:
        """Creates the SP500InvestmentTickAgent crew"""
        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,  # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
        )

async def kickoff(agent_id: str, input: Dict[str, Any]) -> None:
    print("KICKOFF")
    agent = AGENTS_STORE[agent_id]
    output = agent.crew.kickoff(inputs=input)
    print("XXX")
    raw = output.raw

    try:
        data = json.loads(raw)
        print("FINISHED AGENT", agent_id)
        print(data)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to decode JSON: {e}")
    
    new_portfolio = {}
    stocks = get_current_stocks()
    # Calculate the change in shares for each stock and update the bank accordingly
    old_portfolio = agent.portfolio.copy()
    new_portfolio = {}
    stocks = get_current_stocks()

    bank_delta = 0.0

    # Build a dict of new shares and prices from the new data
    for entry in data["new_portfolio_data"]:
        # entry is expected to be a dictionary: {"symbol": symbol, "shares": shares_owned, "price": current_price_per_share}
        symbol = entry["symbol"]
        shares_owned = entry["shares"]
        price = entry["price"]
        new_portfolio[symbol] = shares_owned

        old_shares = old_portfolio.get(symbol, 0)
        diff = shares_owned - old_shares
        if diff != 0:
            # If diff > 0, bought shares; if diff < 0, sold shares
            bank_delta -= diff * price  # Subtract for buys, add for sells (since diff is negative for sells)

    # Also handle stocks that were in the old portfolio but not in the new one (i.e., sold all shares)
    for symbol, old_shares in old_portfolio.items():
        if symbol not in new_portfolio:
            # All shares sold at current price
            price = None
            # Try to get price from stocks or fallback to 0
            for entry in data["new_portfolio_data"]:
                if entry["symbol"] == symbol:
                    price = entry["price"]
                    break
            if price is None:
                # Try to get price from stocks
                price = stocks.get(symbol, 0)
            bank_delta += old_shares * price

    agent.bank += bank_delta
    agent.portfolio = new_portfolio
    print(f"Updated agent {agent.id} with new portfolio {new_portfolio} and bank {agent.bank}")

async def kickoff_everyone(agents: List[AgentModel]) -> None:
    """Kickoff all alive agents with their respective crews in parallel (non-blocking)"""
    for agent in agents:
        if not agent.alive:
            continue
        asyncio.create_task(
            kickoff(agent.id, {
                "investment_strategy": agent.strategy,
                "wallet_money": agent.bank,
                "portfolio_data": get_portfolio_data(agent.portfolio),
            })
        )
    # Function returns immediately, does not block on tasks

# Set the callback function in stocks.py to break the circular import
set_kickoff_callback(kickoff_everyone)

if __name__ == "__main__":
    import asyncio
    agent = create_agent("buy_and_hold", SP500InvestmentTickAgentCrew().crew())
    asyncio.run(kickoff(agent.id, {
        "investment_strategy": "buy_and_hold",
        "wallet_money": 10000,
        "portfolio_data": [
            {"symbol": "AAPL", "shares": 10, "price": 150.75},
            {"symbol": "MSFT", "shares": 5, "price": 210.22}
        ],
    }))