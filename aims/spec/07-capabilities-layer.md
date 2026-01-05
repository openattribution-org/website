---
layout: spec
title: "Capabilities Layer"
section: true
prev:
  title: "Tuning Layer"
  url: "spec/06-tuning-layer.html"
next:
  title: "Verification Protocol"
  url: "spec/08-verification-protocol.html"
---

# 7. Capabilities Layer Specification

The Capabilities Layer documents what an AI system can access at inference time: tools, data sources, external systems, and licensed content. This is the most dynamic layer, potentially changing per deployment, per session, or per user context.

*Core questions: What can this system do? What content is it authorized to use?*

## 7.1 Why Licensed Content Matters

When AI agents interact, content licensing creates problems. Consider: Agent A has a license to access Reuters news content. Agent B does not. Agent A summarizes a Reuters article for Agent B. Has Agent B now received content it isn't licensed for?

The Capabilities Layer makes these licensing boundaries explicit. Agents can check each other's manifests before deciding what information to share.

## 7.2 Schema Structure

```json
{
  "capabilities": {
    "version": "2025-12-19T00:00:00Z",
    "scope": "deployment | session | user",
    "dataSources": { ... },
    "tools": { ... },
    "licensedContent": { ... }
  }
}
```

## 7.3 Capability Scope

Capabilities can be declared at different levels:

| Scope | Description | Update Frequency |
|-------|-------------|------------------|
| `deployment` | Fixed for this deployment of the system | Rarely changes |
| `session` | Varies per conversation/session | Per session |
| `user` | Varies based on authenticated user | Per user |

## 7.4 Data Sources

### 7.4.1 Web Access

```json
"dataSources": {
  "webAccess": {
    "enabled": true,
    "searchEngines": ["google", "bing"],
    "directFetch": true,
    "domainRestrictions": {
      "allowlist": null,
      "blocklist": ["example-blocked.com"]
    }
  }
}
```

### 7.4.2 Knowledge Bases

Proprietary or curated knowledge repositories:

```json
"knowledgeBases": [
  {
    "name": "Product Catalog",
    "description": "Current Home Depot product inventory",
    "type": "proprietary",
    "owner": "The Home Depot, Inc.",
    "realtime": true
  },
  {
    "name": "Installation Guides",
    "description": "How-to guides for home improvement projects",
    "type": "proprietary",
    "owner": "The Home Depot, Inc.",
    "realtime": false,
    "lastUpdated": "2025-12-01"
  }
]
```

### 7.4.3 Real-Time Feeds

```json
"realtimeFeeds": [
  { "name": "Stock Prices", "provider": "Bloomberg", "type": "financial", "latency": "15-minute delay" },
  { "name": "Weather", "provider": "National Weather Service", "type": "weather", "latency": "real-time" }
]
```

## 7.5 Tools

### 7.5.1 MCP Servers

Model Context Protocol servers the system connects to:

```json
"tools": {
  "mcpServers": [
    { "name": "filesystem", "description": "Read/write access to user's local files", "permissions": ["read", "write"], "scope": "user-authorized directories only" },
    { "name": "github", "description": "GitHub API access", "permissions": ["read", "write"], "scope": "user-authorized repositories" }
  ]
}
```

### 7.5.2 External APIs

```json
"externalApis": [
  { "name": "Google Calendar", "description": "Read/write calendar events", "authMethod": "oauth2", "userAuthorization": "required" }
]
```

### 7.5.3 Compute Capabilities

```json
"compute": {
  "codeExecution": {
    "enabled": true,
    "languages": ["python", "javascript"],
    "sandboxed": true,
    "networkAccess": false
  },
  "fileManipulation": {
    "enabled": true,
    "formats": ["pdf", "docx", "csv", "images"]
  }
}
```

## 7.6 Licensed Content

The `licensedContent` section declares what content this system can access and redistribute. Other agents read this to understand licensing boundaries before sharing information.

### 7.6.1 Content Partnerships

Formal content licensing agreements:

```json
"licensedContent": {
  "partnerships": [
    {
      "provider": "Reuters",
      "contentType": "news",
      "scope": "Full archive access",
      "redistribution": { "allowed": false, "summaryAllowed": true, "summaryMaxLength": 100 },
      "validUntil": "2026-12-31"
    },
    {
      "provider": "Getty Images",
      "contentType": "images",
      "scope": "Editorial use",
      "redistribution": { "allowed": false, "thumbnailsAllowed": true },
      "validUntil": "2026-06-30"
    }
  ]
}
```

### 7.6.2 RSL Licenses Held

RSL license tokens the system has acquired for specific content:

```json
"rslLicenses": {
  "held": true,
  "licenseCount": 47,
  "categories": [
    { "type": "news", "publishers": 12, "tier": "ai-training-inference" },
    { "type": "reference", "publishers": 35, "tier": "ai-inference-only" }
  ],
  "verificationEndpoint": "https://api.anthropic.com/rsl/verify"
}
```

### 7.6.3 Redistribution Rights

What happens when this agent shares licensed content with other agents:

```json
"redistributionPolicy": {
  "default": "no-redistribution",
  "exceptions": [
    { "contentType": "public-domain", "policy": "unrestricted" },
    { "contentType": "creative-commons", "policy": "per-license-terms" }
  ],
  "watermarking": { "enabled": true, "method": "metadata-tag" }
}
```

## 7.7 Content Producer Identification

### 7.7.1 Design Decision: No Registry

AIMS does not define a content producer registry. Content producers are identified using existing identifiers:

| Identifier Type | Use Case | Example |
|----------------|----------|---------|
| Domain | Web publishers | `nytimes.com` |
| RSL Publisher ID | RSL-participating publishers | `rsl:pub:nytimes` |
| ISNI | Organizations with existing identifiers | `isni:0000000121691048` |
| DOI prefix | Academic publishers | `doi:10.1038` |
| Custom | Proprietary content systems | `homedepot:catalog:v2` |

A global content registry would require ongoing maintenance and governance, create centralization risks, and duplicate work RSL is already doing.

### 7.7.2 Minimum Viable Producer Reference

For practical use, a content producer reference needs only:

```json
{
  "producer": "nytimes.com",
  "type": "domain"
}
```

The domain is already a globally unique identifier. More sophisticated identification can be layered on through `alternateIdentifiers` when available.

## 7.8 OLP Integration

The Open License Protocol (part of RSL) handles dynamic license negotiation at runtime. AIMS declares static licensing status; OLP handles negotiation.

```json
"olpEndpoint": {
  "url": "https://api.example.com/olp/v1",
  "capabilities": ["query", "acquire"]
}
```

---

Previous: [Tuning Layer](06-tuning-layer.md) | Next: [Verification Protocol](08-verification-protocol.md)
