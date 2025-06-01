export interface Process {
    id: string;
    created_at: string;
    updated_at: string;
    status: string;
    type: string;
    description: string;
    model_name: string | null;
    price_prompt_tokens: number;
    price_completion_tokens: number;
    used_prompt_tokens: number;
    used_completion_tokens: number;
    project: string;
    sub_processes: [];
    stream_text: string[]
}