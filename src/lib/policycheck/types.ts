export interface AiBotAnalysis {
	bot_name: string;
	status: 'blocked' | 'allowed';
}

export interface MarkdownAgents {
	supported: boolean;
	token_count?: number;
	http_content_signal_search?: string;
	http_content_signal_ai_input?: string;
	http_content_signal_ai_train?: string;
}

export interface ActiveLicense {
	type: string;
	url?: string;
}

export interface WellKnownOaResult {
	found: boolean;
	version?: string;
	telemetry_endpoint?: string;
	has_verification: boolean;
}

export interface AnalysisResult {
	url: string;
	status: 'success' | 'error';
	is_path_allowed: boolean;
	ai_bot_analysis: AiBotAnalysis[];
	active_licenses: ActiveLicense[];
	markdown_agents?: MarkdownAgents;
	content_signal_search?: string;
	content_signal_ai_input?: string;
	content_signal_ai_train?: string;
	tdm_policy?: { is_reserved: boolean };
	user_agents?: string[];
	well_known_oa?: WellKnownOaResult;
}

export interface AnalyzeResponse {
	results: AnalysisResult[];
	total: number;
	successful: number;
	failed: number;
}
