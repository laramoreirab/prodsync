import { AzureOpenAI } from "openai";

class AzureAiService {
    constructor() {
        this._client = null;
    }

    getClient() {
        if (this._client) return this._client;

        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_KEY;
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
        const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

        if (!endpoint || !apiKey || !deployment) {
            throw new Error("Configurações da Azure OpenAI ausentes no .env (Endpoint, Key ou Deployment)");
        }

        this._client = new AzureOpenAI({
            endpoint,
            apiKey,
            deployment,
            apiVersion,
        });

        return this._client;
    }

    async generateWithTools({ messages, tools }) {
        const client = this.getClient();
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

        const response = await client.chat.completions.create({
            model: deployment,
            messages,
            tools,
            tool_choice: "auto",
            temperature: 0.2
        });

        return response.choices[0].message;
    }

    async generateText({ messages }) {
        const client = this.getClient();
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

        const response = await client.chat.completions.create({
            model: deployment,
            messages,
            temperature: 0.2
        });

        return response.choices[0].message.content;
    }

    async generateWithVision({ messages, max_tokens = 800 }) {
        const client = this.getClient();
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

        const response = await client.chat.completions.create({
            model: deployment,
            messages,
            max_tokens,
            temperature: 0.2
        });

        return response.choices[0].message.content;
    }
}

export default new AzureAiService();
