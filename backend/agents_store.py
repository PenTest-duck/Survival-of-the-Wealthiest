from typing import Dict
from crewai import Crew
from pydantic import BaseModel, ConfigDict
from ulid import ULID
from faker import Faker
import threading
import time

class Agent(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: str
    alive: bool
    name: str
    strategy: str
    bank: float
    portfolio: Dict[str, int]
    crew: Crew

# === Agents store ===
AGENTS_STORE: Dict[str, Agent] = {}
DEFAULT_BANK = 10000
fake = Faker()

def create_agent(strategy: str, crew: Crew) -> Agent:
    agent = Agent(
        id=str(ULID()),
        alive=True,
        name=fake.name(),
        strategy=strategy,
        bank=DEFAULT_BANK,
        portfolio={},
        crew=crew
    )
    AGENTS_STORE[agent.id] = agent
    return agent
# === End of agents store ===



if __name__ == "__main__":
    # This will be handled by the main app now
    print("Agents store module loaded")