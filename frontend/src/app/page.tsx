'use client';

import { useState, useEffect } from 'react';
import AgentCard from '../components/AgentCard';
import { getAgents } from '../api/client';

interface Agent {
  id: string;
  alive: boolean;
  name: string;
  strategy: string;
  bank: number;
  portfolio: Record<string, number>;
}

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // Only set loading to true on initial load
        if (!hasInitialLoad) {
          setLoading(true);
        }
        const agentsData = await getAgents();
        setAgents(agentsData);
        setIsScanning(false);
        setHasInitialLoad(true);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
        setIsScanning(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
    
    // Set up polling to refresh agents data every 5 seconds
    const interval = setInterval(fetchAgents, 5000);

    return () => clearInterval(interval);
  }, [hasInitialLoad]);

  // Calculate total portfolio value for each agent
  const getTotalPortfolioValue = (portfolio: Record<string, number>) => {
    return Object.values(portfolio).reduce((sum, value) => sum + value, 0);
  };

  // Calculate total P&L (bank + portfolio - assuming initial bank was 10000)
  const getTotalPnL = (agent: Agent) => {
    const initialBank = 10000; // Assuming initial bank amount
    const totalPortfolio = getTotalPortfolioValue(agent.portfolio);
    return (agent.bank + totalPortfolio) - initialBank;
  };

  // Get total P&L across all agents
  const getTotalSystemPnL = () => {
    return agents.reduce((sum, agent) => sum + getTotalPnL(agent), 0);
  };

  // Get alive agents count
  const getAliveAgentsCount = () => {
    return agents.filter(agent => agent.alive).length;
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff00' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-green-500/30 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-green-400">
                <span className="animate-pulse">⚡</span> SURVIVAL OF THE WEALTHIEST
              </div>
              <div className="text-sm text-green-300">
                AI Investment Battle Royale
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-green-300">Alive Agents:</span>
                <span className="ml-2 text-green-400 font-bold">{getAliveAgentsCount()}</span>
              </div>
              <div className="text-sm">
                <span className="text-green-300">Total P&L:</span>
                <span className={`ml-2 font-bold ${getTotalSystemPnL() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${getTotalSystemPnL().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            AI AGENT BATTLE ROYALE
          </h1>
          <p className="text-xl text-green-300 mb-8 max-w-3xl mx-auto">
            {agents.length} specialized AI agents constantly monitoring and analyzing investment opportunities. 
            Only the most profitable strategies survive.
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="bg-black/50 border border-green-500/30 rounded-lg px-6 py-3">
              <div className="text-green-400 font-bold">{agents.length}</div>
              <div className="text-green-300">Total Agents</div>
            </div>
            <div className="bg-black/50 border border-green-500/30 rounded-lg px-6 py-3">
              <div className="text-green-400 font-bold">{getAliveAgentsCount()}</div>
              <div className="text-green-300">Alive Agents</div>
            </div>
            <div className="bg-black/50 border border-green-500/30 rounded-lg px-6 py-3">
              <div className="text-green-400 font-bold">24/7</div>
              <div className="text-green-300">Monitoring</div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-green-400 text-xl mb-4">Loading agents...</div>
            <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}

        {/* Agent Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isSelected={selectedAgent?.id === agent.id}
                onClick={setSelectedAgent}
              />
            ))}
          </div>
        )}

        {/* Agent Details Modal */}
        {selectedAgent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black border border-green-500/50 rounded-lg p-8 max-w-2xl w-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-green-400 mb-2">{selectedAgent.name}</h2>
                  <p className="text-xl text-green-300">{selectedAgent.strategy}</p>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-green-400 hover:text-green-300 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                  <div className="text-green-300 text-sm mb-1">Status</div>
                  <div className={`text-lg font-bold ${
                    selectedAgent.alive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {selectedAgent.alive ? 'ALIVE' : 'ELIMINATED'}
                  </div>
                </div>
                <div className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                  <div className="text-green-300 text-sm mb-1">Bank Balance</div>
                  <div className="text-lg font-bold text-green-400">
                    ${selectedAgent.bank.toFixed(2)}
                  </div>
                </div>
                <div className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                  <div className="text-green-300 text-sm mb-1">Portfolio Value</div>
                  <div className="text-lg font-bold text-green-400">
                    ${getTotalPortfolioValue(selectedAgent.portfolio).toFixed(2)}
                  </div>
                </div>
                <div className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                  <div className="text-green-300 text-sm mb-1">Total P&L</div>
                  <div className={`text-lg font-bold ${getTotalPnL(selectedAgent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${getTotalPnL(selectedAgent).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                <div className="text-green-300 text-sm mb-2">Portfolio Holdings</div>
                <div className="space-y-2 text-sm">
                  {Object.entries(selectedAgent.portfolio).map(([stock, shares]) => (
                    <div key={stock} className="flex justify-between">
                      <span className="text-green-400">{stock}</span>
                      <span className="text-green-300">{shares} shares</span>
                    </div>
                  ))}
                  {Object.keys(selectedAgent.portfolio).length === 0 && (
                    <div className="text-green-300 text-center py-2">No holdings</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scanning Animation */}
        {isScanning && (
          <div className="fixed bottom-4 right-4 bg-black/80 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">SCANNING MARKETS...</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
