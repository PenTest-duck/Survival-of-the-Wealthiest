'use client';

import { useState, useEffect } from 'react';

interface Agent {
  id: number;
  name: string;
  industry: string;
  status: 'active' | 'analyzing' | 'alert';
  profitLoss: number;
  lastUpdate: string;
  performance: number;
}

const industries = [
  'Military & Defense', 'Artificial Intelligence', 'Cybersecurity', 'Biotechnology',
  'Renewable Energy', 'Space Technology', 'Quantum Computing', 'Blockchain',
  'Autonomous Vehicles', 'Robotics', 'Nanotechnology', 'Clean Energy',
  'Digital Health', 'Fintech', 'E-commerce', 'Cloud Computing',
  'Semiconductors', 'Telecommunications', 'Entertainment', 'Real Estate'
];

const generateAgents = (): Agent[] => {
  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Agent-${String(i + 1).padStart(3, '0')}`,
    industry: industries[i % industries.length],
    status: ['active', 'analyzing', 'alert'][Math.floor(Math.random() * 3)] as 'active' | 'analyzing' | 'alert',
    profitLoss: (Math.random() - 0.5) * 10000,
    lastUpdate: new Date(Date.now() - Math.random() * 60000).toLocaleTimeString(),
    performance: Math.random() * 100
  }));
};

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    setAgents(generateAgents());
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        profitLoss: agent.profitLoss + (Math.random() - 0.5) * 100,
        lastUpdate: new Date().toLocaleTimeString(),
        performance: Math.max(0, Math.min(100, agent.performance + (Math.random() - 0.5) * 2))
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'analyzing': return 'text-yellow-400';
      case 'alert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '●';
      case 'analyzing': return '◐';
      case 'alert': return '⚠';
      default: return '○';
    }
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
                <span className="text-green-300">Active Agents:</span>
                <span className="ml-2 text-green-400 font-bold">{agents.filter(a => a.status === 'active').length}</span>
              </div>
              <div className="text-sm">
                <span className="text-green-300">Total P&L:</span>
                <span className={`ml-2 font-bold ${agents.reduce((sum, a) => sum + a.profitLoss, 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${agents.reduce((sum, a) => sum + a.profitLoss, 0).toFixed(2)}
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
            100 specialized AI agents constantly monitoring and analyzing investment opportunities across 20 critical industries. 
            Only the most profitable strategies survive.
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="bg-black/50 border border-green-500/30 rounded-lg px-6 py-3">
              <div className="text-green-400 font-bold">{agents.length}</div>
              <div className="text-green-300">Total Agents</div>
            </div>
            <div className="bg-black/50 border border-green-500/30 rounded-lg px-6 py-3">
              <div className="text-green-400 font-bold">{industries.length}</div>
              <div className="text-green-300">Industries</div>
            </div>
            <div className="bg-black/50 border border-green-500/30 rounded-lg px-6 py-3">
              <div className="text-green-400 font-bold">24/7</div>
              <div className="text-green-300">Monitoring</div>
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`bg-black/60 border border-green-500/30 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:border-green-400 hover:bg-black/80 hover:scale-105 ${
                selectedAgent?.id === agent.id ? 'border-green-400 bg-black/80 ring-2 ring-green-400/50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-bold text-green-400">{agent.name}</div>
                <div className={`text-lg ${getStatusColor(agent.status)}`}>
                  {getStatusIcon(agent.status)}
                </div>
              </div>
              <div className="text-sm text-green-300 mb-2">{agent.industry}</div>
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-green-300">P&L:</span>
                  <span className={`ml-1 font-bold ${agent.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${agent.profitLoss.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-green-300">Perf:</span>
                  <span className="ml-1 font-bold text-green-400">{agent.performance.toFixed(1)}%</span>
                </div>
              </div>
              <div className="text-xs text-green-400/60 mt-2">
                Last: {agent.lastUpdate}
              </div>
            </div>
          ))}
        </div>

        {/* Agent Details Modal */}
        {selectedAgent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black border border-green-500/50 rounded-lg p-8 max-w-2xl w-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-green-400 mb-2">{selectedAgent.name}</h2>
                  <p className="text-xl text-green-300">{selectedAgent.industry}</p>
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
                  <div className={`text-lg font-bold ${getStatusColor(selectedAgent.status)}`}>
                    {selectedAgent.status.toUpperCase()}
                  </div>
                </div>
                <div className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                  <div className="text-green-300 text-sm mb-1">Performance</div>
                  <div className="text-lg font-bold text-green-400">
                    {selectedAgent.performance.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                  <div className="text-green-300 text-sm mb-1">Profit/Loss</div>
                  <div className={`text-lg font-bold ${selectedAgent.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${selectedAgent.profitLoss.toFixed(2)}
                  </div>
                </div>
                <div className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                  <div className="text-green-300 text-sm mb-1">Last Update</div>
                  <div className="text-lg font-bold text-green-400">
                    {selectedAgent.lastUpdate}
                  </div>
                </div>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                <div className="text-green-300 text-sm mb-2">Recent Activity</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-400">Market Analysis</span>
                    <span className="text-green-300">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400">Risk Assessment</span>
                    <span className="text-green-300">Complete</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400">Portfolio Optimization</span>
                    <span className="text-green-300">In Progress</span>
                  </div>
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
