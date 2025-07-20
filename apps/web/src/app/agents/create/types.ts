export interface AgentType {
    id: string;
    name: string;
    description: string;
    icon: string;
    features: string[];
    color: string;
    platforms: Platform[];
    preview: {
        title: string;
        description: string;
        features: string[];
        demo: string;
    };
}

export interface Platform {
    id: string;
    name: string;
    icon: string;
    description: string;
    features: string[];
    demo: string;
}

export interface FormData {
    name: string;
    description: string;
    webhookUrl: string;
    apiVersion: string;
    slackToken: string;
    slackChannel: string;
    teamsWebhook: string;
    teamsChannel: string;
    smsProvider: string;
    smsNumber: string;
    emailAddress: string;
    emailProvider: string;
    websocketUrl: string;
    websocketProtocol: string;
    timezone: string;
    language: string;
    messageTypes?: string[];
} 