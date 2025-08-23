type Agent = {
    id: string;
    alive: boolean;
    name: string;
    strategy: string;
    bank: number;
    portfolio: Record<string, number>;
}

type GetAgentsResponse = Agent[];

export const getAgents = async (): Promise<GetAgentsResponse> => {
    const response = await fetch(`http://localhost:8000/agents`);
    const data: GetAgentsResponse = await response.json();
    return data;
}
