export class HermesClient {
  private baseUrl: string;
  private apiKey: string | null;

  constructor(baseUrl: string, apiKey: string | null = null) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async testConnection() {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      // The official hermes-agent exposes a REST/WebSocket interface.
      // E.g., hitting a known health/status endpoint.
      const res = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers
      });

      if (res.ok) {
        return { status: 'CONNECTED', message: 'Hermes runtime connected successfully.' };
      } else {
        return { status: 'ERROR', message: `Hermes returned status ${res.status}` };
      }
    } catch (e) {
       return { status: 'BLOCKED', message: `Cannot reach Hermes runtime at ${this.baseUrl}` };
    }
  }

  async executeTask(systemPrompt: string, userPrompt: string, tools: Record<string, unknown>[]) {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      // Execute a real inference generation if connected
      const res = await fetch(`${this.baseUrl}/v1/completions`, {
         method: 'POST',
         headers,
         body: JSON.stringify({
            model: "hermes",
            messages: [
               { role: 'system', content: systemPrompt },
               { role: 'user', content: userPrompt }
            ],
            tools: tools
         })
      });

      if (!res.ok) {
         throw new Error(`Hermes runtime execution failed: ${res.statusText}`);
      }

      return res.json();
  }
}
