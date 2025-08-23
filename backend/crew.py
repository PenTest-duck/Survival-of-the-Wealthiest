import os
from typing import Any, Dict, List
from crewai import LLM
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
import json

from stocks import get_portfolio_data

# Import the Agent model type for type hints
from agents_store import Agent as AgentModel

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

def kickoff(crew: Crew, input: Dict[str, Any]) -> Dict[str, Any]:
    output = crew.kickoff(inputs=input)
    raw = output.raw

    try:
        data = json.loads(raw)
        return data
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to decode JSON: {e}")

def kickoff_everyone(agents: List[AgentModel]) -> None:
    """Kickoff all alive agents with their respective crews"""
    for agent in agents:
        if not agent.alive:
            continue
        kickoff(agent.crew, {
            "investment_strategy": agent.strategy,
            "wallet_money": agent.bank,
            "portfolio_data": get_portfolio_data(agent.portfolio),
        })

if __name__ == "__main__":
    crew = SP500InvestmentTickAgentCrew().crew()
    kickoff(crew, {
        "investment_strategy": "buy_and_hold",
        "wallet_money": 10000,
        "portfolio_data": [
            {"symbol": "AAPL", "shares": 10, "price": 150.75},
            {"symbol": "MSFT", "shares": 5, "price": 210.22}
        ],
    })