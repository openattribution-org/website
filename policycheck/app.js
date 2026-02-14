// Configuration
const API_URL = 'https://policycheck-d7wv0g.fly.dev';

let currentResults = null;

// Known AI Crawlers (based on comprehensive industry research)
const AI_CRAWLERS = {
    training: [
        { name: 'GPTBot', company: 'OpenAI', purpose: 'Model training' },
        { name: 'ClaudeBot', company: 'Anthropic', purpose: 'Model training' },
        { name: 'anthropic-ai', company: 'Anthropic', purpose: 'Bulk model training' },
        { name: 'Claude-Web', company: 'Anthropic', purpose: 'Web-focused training' },
        { name: 'Google-Extended', company: 'Google', purpose: 'Gemini training' },
        { name: 'GoogleOther', company: 'Google', purpose: 'Research & development' },
        { name: 'Meta-ExternalAgent', company: 'Meta', purpose: 'AI model training' },
        { name: 'FacebookBot', company: 'Meta', purpose: 'Speech recognition training' },
        { name: 'Applebot-Extended', company: 'Apple', purpose: 'Generative AI training' },
        { name: 'Amazonbot', company: 'Amazon', purpose: 'AI improvement, model training' },
        { name: 'CCBot', company: 'Common Crawl', purpose: 'Open dataset collection' },
        { name: 'Bytespider', company: 'ByteDance', purpose: 'AI training' },
        { name: 'cohere-ai', company: 'Cohere', purpose: 'LLM training' },
        { name: 'Diffbot', company: 'Diffbot', purpose: 'AI data extraction' },
        { name: 'Omgilibot', company: 'Webz.io', purpose: 'Data collection for resale' },
        { name: 'ImagesiftBot', company: 'The Hive', purpose: 'Image model training' },
    ],
    search: [
        { name: 'OAI-SearchBot', company: 'OpenAI', purpose: 'ChatGPT search indexing' },
        { name: 'PerplexityBot', company: 'Perplexity', purpose: 'Search indexing' },
        { name: 'YouBot', company: 'You.com', purpose: 'AI search' },
        { name: 'DuckAssistBot', company: 'DuckDuckGo', purpose: 'AI-assisted answers' },
    ],
    userTriggered: [
        { name: 'ChatGPT-User', company: 'OpenAI', purpose: 'User-requested fetching' },
        { name: 'Perplexity-User', company: 'Perplexity', purpose: 'User-requested fetching' },
        { name: 'Meta-ExternalFetcher', company: 'Meta', purpose: 'Real-time content fetching' },
    ],
    other: [
        { name: 'Applebot', company: 'Apple', purpose: 'Siri, Spotlight, Safari' },
        { name: 'Google-CloudVertexBot', company: 'Google', purpose: 'Cloud AI services' },
        { name: 'Amzn-SearchBot', company: 'Amazon', purpose: 'Alexa and Rufus search' },
    ]
};

// Flatten for easy lookup
const ALL_AI_CRAWLERS = [
    ...AI_CRAWLERS.training,
    ...AI_CRAWLERS.search,
    ...AI_CRAWLERS.userTriggered,
    ...AI_CRAWLERS.other
];

// DOM Elements
const urlInput = document.getElementById('url-input');
const analyzeBtn = document.getElementById('analyze-btn');
const csvFile = document.getElementById('csv-file');
const analyzeCsvBtn = document.getElementById('analyze-csv-btn');
const uploadArea = document.getElementById('upload-area');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const error = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const resultsBody = document.getElementById('results-body');
const summary = document.getElementById('summary');
const downloadJsonBtn = document.getElementById('download-json');
const downloadCsvBtn = document.getElementById('download-csv');

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('active', 'border-coral-600', 'text-gray-900', 'font-normal');
            b.classList.add('border-transparent', 'text-gray-600', 'font-light');
        });
        btn.classList.add('active', 'border-coral-600', 'text-gray-900', 'font-normal');
        btn.classList.remove('border-transparent', 'text-gray-600', 'font-light');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(`${tabName}-tab`).classList.remove('hidden');

        hideAll();
    });
});

// Single URL Analysis
analyzeBtn.addEventListener('click', async () => {
    let url = urlInput.value.trim();
    if (!url) {
        showError('Please enter a URL');
        return;
    }

    // Add https:// if no protocol specified
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    await analyzeUrls([url]);
});

// Handle Enter key
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') analyzeBtn.click();
});

// CSV Upload
csvFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        analyzeCsvBtn.disabled = false;
        uploadArea.querySelector('p').innerHTML = `Selected: <span class="font-normal">${file.name}</span>`;
    }
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('border-coral-600', 'bg-coral-50');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('border-coral-600', 'bg-coral-50');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('border-coral-600', 'bg-coral-50');

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
        csvFile.files = e.dataTransfer.files;
        csvFile.dispatchEvent(new Event('change'));
    } else {
        showError('Please drop a CSV file');
    }
});

uploadArea.addEventListener('click', () => csvFile.click());

// CSV Analysis
analyzeCsvBtn.addEventListener('click', async () => {
    const file = csvFile.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const urls = parseCSV(text);

        if (urls.length === 0) {
            showError('No URLs found in CSV. Make sure there is a "url" column.');
            return;
        }

        await analyzeUrls(urls);
    } catch (err) {
        showError(`Failed to parse CSV: ${err.message}`);
    }
});

// Parse CSV
function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const urlIndex = headers.findIndex(h =>
        h.includes('url') || h === 'link' || h === 'website'
    );

    if (urlIndex === -1) {
        return lines.slice(1)
            .map(line => line.split(',')[0].trim())
            .filter(url => url && url.length > 0);
    }

    return lines.slice(1)
        .map(line => {
            const cols = line.split(',');
            return cols[urlIndex]?.trim();
        })
        .filter(url => url && url.length > 0);
}

// Main analysis function
async function analyzeUrls(urls) {
    hideAll();
    loading.classList.remove('hidden');

    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls, user_agent: '*' })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        currentResults = data.results;
        displayResults(data);
    } catch (err) {
        showError(`Analysis failed: ${err.message}`);
    } finally {
        loading.classList.add('hidden');
    }
}

// Analyze AI bot status for a result (using backend analysis)
function analyzeAIBots(result) {
    if (!result.ai_bot_analysis || result.ai_bot_analysis.length === 0) {
        // Fallback if backend doesn't provide analysis
        return { blocked: [], allowed: ALL_AI_CRAWLERS };
    }

    const blocked = [];
    const allowed = [];

    result.ai_bot_analysis.forEach(botResult => {
        const botInfo = ALL_AI_CRAWLERS.find(b => b.name === botResult.bot_name);

        if (botInfo) {
            if (botResult.status === 'blocked') {
                blocked.push(botInfo);
            } else {
                allowed.push(botInfo);
            }
        }
    });

    return { blocked, allowed };
}

// Create AI bot detail view
function createAIBotDetailView(result) {
    const { blocked, allowed } = analyzeAIBots(result);

    let html = '<div class="p-4 bg-gray-50 space-y-4">';

    // Blocked bots (important for publishers protecting content)
    if (blocked.length > 0) {
        const trainingBlocked = blocked.filter(b => AI_CRAWLERS.training.includes(b));
        const searchBlocked = blocked.filter(b => AI_CRAWLERS.search.includes(b));
        const otherBlocked = blocked.filter(b => !AI_CRAWLERS.training.includes(b) && !AI_CRAWLERS.search.includes(b));

        html += `<div><h4 class="font-normal text-coral-700 mb-2">🚫 Blocked AI Crawlers (${blocked.length})</h4>`;

        if (trainingBlocked.length > 0) {
            html += `
                <div class="mb-3">
                    <h5 class="text-sm font-normal text-gray-700 mb-1">Training Crawlers (${trainingBlocked.length})</h5>
                    <div class="text-sm text-gray-600 font-light">
                        ${trainingBlocked.map(bot => `<span class="text-coral-700">✗</span> ${bot.name}`).join(', ')}
                    </div>
                </div>
            `;
        }

        if (searchBlocked.length > 0) {
            html += `
                <div class="mb-3">
                    <h5 class="text-sm font-normal text-gray-700 mb-1">Search Crawlers (${searchBlocked.length})</h5>
                    <div class="text-sm text-gray-600 font-light">
                        ${searchBlocked.map(bot => `<span class="text-coral-700">✗</span> ${bot.name}`).join(', ')}
                    </div>
                </div>
            `;
        }

        if (otherBlocked.length > 0) {
            html += `
                <div class="mb-3">
                    <h5 class="text-sm font-normal text-gray-700 mb-1">Other (${otherBlocked.length})</h5>
                    <div class="text-sm text-gray-600 font-light">
                        ${otherBlocked.map(bot => `<span class="text-coral-700">✗</span> ${bot.name}`).join(', ')}
                    </div>
                </div>
            `;
        }

        html += '</div>';
    }

    // Allowed bots (important for advertisers evaluating visibility)
    if (allowed.length > 0) {
        const trainingAllowed = allowed.filter(b => AI_CRAWLERS.training.includes(b));
        const searchAllowed = allowed.filter(b => AI_CRAWLERS.search.includes(b));
        const otherAllowed = allowed.filter(b => !AI_CRAWLERS.training.includes(b) && !AI_CRAWLERS.search.includes(b));

        html += `<div><h4 class="font-normal text-green-700 mb-2">✓ Allowed AI Crawlers (${allowed.length})</h4>`;

        if (trainingAllowed.length > 0) {
            html += `
                <div class="mb-3">
                    <h5 class="text-sm font-normal text-gray-700 mb-1">Training Crawlers (${trainingAllowed.length})</h5>
                    <div class="text-sm text-gray-600 font-light">
                        ${trainingAllowed.map(bot => `<span class="text-green-700">✓</span> ${bot.name}`).join(', ')}
                    </div>
                </div>
            `;
        }

        if (searchAllowed.length > 0) {
            html += `
                <div class="mb-3">
                    <h5 class="text-sm font-normal text-gray-700 mb-1">Search Crawlers (${searchAllowed.length})</h5>
                    <div class="text-sm text-gray-600 font-light">
                        ${searchAllowed.map(bot => `<span class="text-green-700">✓</span> ${bot.name}`).join(', ')}
                    </div>
                </div>
            `;
        }

        if (otherAllowed.length > 0) {
            html += `
                <div class="mb-3">
                    <h5 class="text-sm font-normal text-gray-700 mb-1">Other (${otherAllowed.length})</h5>
                    <div class="text-sm text-gray-600 font-light">
                        ${otherAllowed.map(bot => `<span class="text-green-700">✓</span> ${bot.name}`).join(', ')}
                    </div>
                </div>
            `;
        }

        html += '</div>';
    }

    // Add helpful note
    html += `
        <div class="text-xs text-gray-600 p-3 bg-blue-50 rounded border border-blue-200">
            <strong>Note:</strong> Analysis based on robots.txt only.
            CDN-level blocking (Cloudflare, etc.) is not detected.
        </div>
    `;

    html += '</div>';
    return html;
}

// Display results
function displayResults(data) {
    results.classList.remove('hidden');

    summary.innerHTML = `
        <strong>Total:</strong> ${data.total} &nbsp;|&nbsp;
        <strong class="text-green-700">✓ Successful:</strong> ${data.successful} &nbsp;|&nbsp;
        <strong class="text-coral-700">✗ Failed:</strong> ${data.failed}
    `;

    resultsBody.innerHTML = '';

    // Show message if no successful results
    if (data.successful === 0) {
        resultsBody.innerHTML = `
            <tr>
                <td colspan="9" class="py-12 text-center">
                    <div class="text-gray-500">
                        <p class="text-lg mb-2">No results to display</p>
                        <p class="text-sm">All URLs failed to analyze. Check that the URLs are valid and accessible.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    data.results.forEach((result, index) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-100 hover:bg-gray-50 cursor-pointer';
        row.dataset.index = index;

        // Skip failed results
        if (result.status !== 'success') return;

        // Path Allowed - icon only
        const pathAllowed = result.is_path_allowed
            ? '<span class="text-green-700 text-lg" title="Path allowed">✓</span>'
            : '<span class="text-coral-700 text-lg" title="Path blocked">✗</span>';

        // RSL - icon or count
        const rslCount = result.active_licenses?.length || 0;
        const rslText = rslCount > 0
            ? `<span class="text-green-700" title="${rslCount} license(s)">${rslCount}</span>`
            : '<span class="text-gray-400">-</span>';

        // Content Signals - compact display
        const hasContentSignals = result.content_signal_search || result.content_signal_ai_input || result.content_signal_ai_train;
        let csText = '<span class="text-gray-400">-</span>';
        if (hasContentSignals) {
            const signals = [];
            if (result.content_signal_search) {
                const icon = result.content_signal_search === 'yes' ? '✓' : '✗';
                const color = result.content_signal_search === 'yes' ? 'text-green-700' : 'text-coral-700';
                signals.push(`<span class="${color}">srch${icon}</span>`);
            }
            if (result.content_signal_ai_input) {
                const icon = result.content_signal_ai_input === 'yes' ? '✓' : '✗';
                const color = result.content_signal_ai_input === 'yes' ? 'text-green-700' : 'text-coral-700';
                signals.push(`<span class="${color}">use${icon}</span>`);
            }
            if (result.content_signal_ai_train) {
                const icon = result.content_signal_ai_train === 'yes' ? '✓' : '✗';
                const color = result.content_signal_ai_train === 'yes' ? 'text-green-700' : 'text-coral-700';
                signals.push(`<span class="${color}">train${icon}</span>`);
            }
            const tooltip = [
                result.content_signal_search ? `search=${result.content_signal_search}` : null,
                result.content_signal_ai_input ? `ai-input=${result.content_signal_ai_input}` : null,
                result.content_signal_ai_train ? `ai-train=${result.content_signal_ai_train}` : null
            ].filter(Boolean).join(', ');
            csText = `<span class="text-xs" title="${tooltip}">${signals.join(' ')}</span>`;
        }

        // AI Bot Analysis Summary
        const { blocked, allowed } = analyzeAIBots(result);

        // Helper to get bot status
        const getBotStatus = (botName) => {
            const botAnalysis = result.ai_bot_analysis?.find(b => b.bot_name === botName);
            if (!botAnalysis) return '<span class="text-gray-400">-</span>';
            return botAnalysis.status === 'blocked'
                ? '<span class="text-coral-700 font-medium">✗</span>'
                : '<span class="text-green-700 font-medium">✓</span>';
        };

        // Get robots.txt URL
        const robotsUrl = new URL(result.url);
        const robotsTxtUrl = `${robotsUrl.protocol}//${robotsUrl.host}/robots.txt`;

        row.innerHTML = `
            <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                    <span class="truncate max-w-xs" title="${result.url}">${result.url}</span>
                    <a href="${robotsTxtUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 text-sm" title="View robots.txt">
                        ↗
                    </a>
                </div>
            </td>
            <td class="py-3 px-4 text-center" data-label="Path:">${pathAllowed}</td>
            <td class="py-3 px-4 text-center" data-label="RSL:">${rslText}</td>
            <td class="py-3 px-4 text-center" data-label="Content Signals:">${csText}</td>
            <td class="py-3 px-4 text-center" data-label="GPTBot:">${getBotStatus('GPTBot')}</td>
            <td class="py-3 px-4 text-center" data-label="ClaudeBot:">${getBotStatus('ClaudeBot')}</td>
            <td class="py-3 px-4 text-center" data-label="Google-Extended:">${getBotStatus('Google-Extended')}</td>
            <td class="py-3 px-4 text-center" data-label="CCBot:">${getBotStatus('CCBot')}</td>
            <td class="py-3 px-4 text-center" data-label="All Bots:">
                <span class="text-blue-600 text-xs cursor-pointer hover:text-blue-800">View all</span>
            </td>
        `;

        // Add click handler to expand details
        row.addEventListener('click', () => {
            const existingDetail = document.getElementById(`detail-${index}`);
            if (existingDetail) {
                existingDetail.remove();
            } else {
                // Remove any other open details
                document.querySelectorAll('[id^="detail-"]').forEach(el => el.remove());

                // Create and insert detail row
                const detailRow = document.createElement('tr');
                detailRow.id = `detail-${index}`;
                detailRow.innerHTML = `
                    <td colspan="9" class="p-0">
                        ${createAIBotDetailView(result)}
                    </td>
                `;
                row.after(detailRow);
            }
        });

        resultsBody.appendChild(row);
    });
}

// Download handlers
downloadJsonBtn.addEventListener('click', () => {
    if (!currentResults) return;
    const blob = new Blob([JSON.stringify(currentResults, null, 2)], { type: 'application/json' });
    downloadFile(blob, 'policycheck-results.json');
});

downloadCsvBtn.addEventListener('click', () => {
    if (!currentResults) return;

    // Major AI bots to include as columns (matching backend)
    const majorBots = [
        'GPTBot',
        'ClaudeBot',
        'Google-Extended',
        'Meta-ExternalAgent',
        'CCBot',
        'Bytespider',
        'OAI-SearchBot',
        'PerplexityBot'
    ];

    // Build headers
    const headers = [
        'URL',
        'Status',
        'Path Allowed',
        'RSL Licenses',
        'TDM Reserved',
        ...majorBots,
        'All User Agents'
    ];

    const rows = currentResults.map(r => {
        const row = [
            r.url,
            r.status,
            r.is_path_allowed ? 'Yes' : 'No',
            r.active_licenses?.length || 0,
            r.tdm_policy?.is_reserved ? 'Yes' : 'No'
        ];

        // Add status for each major bot
        majorBots.forEach(botName => {
            const botAnalysis = r.ai_bot_analysis?.find(b => b.bot_name === botName);
            if (botAnalysis) {
                row.push(botAnalysis.status === 'blocked' ? 'Blocked' : 'Allowed');
            } else {
                row.push('Unknown');
            }
        });

        // Add all user agents as final column
        row.push(r.user_agents?.join('; ') || '');

        return row;
    });

    const csv = [headers, ...rows].map(row =>
        row.map(cell => {
            const cellStr = String(cell);
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                return '"' + cellStr.replace(/"/g, '""') + '"';
            }
            return cellStr;
        }).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    downloadFile(blob, 'policycheck-results.csv');
});

function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Helper functions
function hideAll() {
    results.classList.add('hidden');
    error.classList.add('hidden');
    loading.classList.add('hidden');
}

function showError(msg) {
    hideAll();
    error.classList.remove('hidden');
    errorMessage.textContent = msg;
}

// Sorting state
let currentSort = { column: null, direction: 'asc' };

// Sort table by column
function sortTable(column) {
    if (!currentResults || currentResults.length === 0) return;

    // Toggle direction if clicking same column
    if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }

    // Sort the results
    const sorted = [...currentResults].sort((a, b) => {
        let aVal, bVal;

        switch (column) {
            case 'url':
                aVal = a.url.toLowerCase();
                bVal = b.url.toLowerCase();
                break;
            case 'path':
                aVal = a.is_path_allowed ? 1 : 0;
                bVal = b.is_path_allowed ? 1 : 0;
                break;
            case 'rsl':
                aVal = a.active_licenses?.length || 0;
                bVal = b.active_licenses?.length || 0;
                break;
            case 'gptbot':
            case 'claudebot':
            case 'gemini':
            case 'ccbot':
                const botMap = {
                    'gptbot': 'GPTBot',
                    'claudebot': 'ClaudeBot',
                    'gemini': 'Google-Extended',
                    'ccbot': 'CCBot'
                };
                const botName = botMap[column];
                const aBot = a.ai_bot_analysis?.find(b => b.bot_name === botName);
                const bBot = b.ai_bot_analysis?.find(b => b.bot_name === botName);
                aVal = aBot?.status === 'blocked' ? 0 : 1;
                bVal = bBot?.status === 'blocked' ? 0 : 1;
                break;
            default:
                return 0;
        }

        if (aVal < bVal) return currentSort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Re-render with sorted data
    currentResults = sorted;
    displayResults({ results: sorted, total: sorted.length, successful: sorted.length, failed: 0 });
}

// Make sortTable available globally
window.sortTable = sortTable;

// Initialize
console.log('PolicyCheck Web UI initialized');
console.log('API URL:', API_URL);
