export interface ArchitectureInterface {
    modality: string;
    tokenizer: string;
    instruct_type: string;
}

export interface PricingInterface {
    prompt: string;
    completion: string;
    image: string;
    request: string;
    input_cache_read: string;
    input_cache_write: string;
    web_search: string;
    internal_reasoning: string;
}

export interface TopProviderInterface {
    context_length: number;
    max_completion_tokens: number | null;
    is_moderated: boolean;
}

export interface OpenRouterModelDataInterface {
    id: string;
    name: string;
    created: number;
    description: string;
    context_length: number;
    architecture: ArchitectureInterface;
    pricing: PricingInterface;
    top_provider: TopProviderInterface;
    per_request_limits: any | null;
}
