'use client';

interface Agent {
  id: string;
  alive: boolean;
  name: string;
  strategy: string;
  bank: number;
  portfolio: Record<string, number>;
}

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onClick: (agent: Agent) => void;
}

const getStatusColor = (alive: boolean) => {
  return alive ? 'text-green-400' : 'text-red-400';
};

const getStatusIcon = (alive: boolean) => {
  return alive ? '●' : '✗';
};

// Calculate total portfolio value for display
const getTotalPortfolioValue = (portfolio: Record<string, number>) => {
  return Object.values(portfolio).reduce((sum, value) => sum + value, 0);
};

// Calculate total P&L (bank + portfolio - assuming initial bank was 10000)
const getTotalPnL = (agent: Agent) => {
  const initialBank = 10000; // Assuming initial bank amount
  const totalPortfolio = getTotalPortfolioValue(agent.portfolio);
  return (agent.bank + totalPortfolio) - initialBank;
};

export default function AgentCard({ agent, isSelected, onClick }: AgentCardProps) {
  return (
    <div
      onClick={() => onClick(agent)}
      className={`bg-black/60 border border-green-500/30 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:border-green-400 hover:bg-black/80 hover:scale-105 ${
        isSelected ? 'border-green-400 bg-black/80 ring-2 ring-green-400/50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-bold text-green-400">{agent.name}</div>
        <div className={`text-lg ${getStatusColor(agent.alive)}`}>
          {getStatusIcon(agent.alive)}
        </div>
      </div>
      <div className="text-sm text-green-300 mb-2">{agent.strategy}</div>
      <div className="flex justify-between items-center text-sm">
        <div>
          <span className="text-green-300">P&L:</span>
          <span className={`ml-1 font-bold ${getTotalPnL(agent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${getTotalPnL(agent).toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-green-300">Bank:</span>
          <span className="ml-1 font-bold text-green-400">${agent.bank.toFixed(0)}</span>
        </div>
      </div>
      <div className="text-xs text-green-400/60 mt-2">
        Portfolio: ${getTotalPortfolioValue(agent.portfolio).toFixed(0)}
      </div>
    </div>
  );
}
