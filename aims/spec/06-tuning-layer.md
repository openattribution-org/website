---
layout: spec
title: "Tuning Layer"
section: true
prev:
  title: "Foundation Layer"
  url: "spec/05-foundation-layer.html"
next:
  title: "Capabilities Layer"
  url: "spec/07-capabilities-layer.html"
---

# 6. Tuning Layer Specification

The Tuning Layer documents modifications applied to a base model that shape its behavior, values, and response characteristics. This covers both fine-tuning (weight changes) and inference-time controls (system prompts, content filters).

*Core question: How was this model shaped to behave?*

## 6.1 Schema Structure

```json
{
  "tuning": {
    "version": "2025-12-19T00:00:00Z",
    "alignment": { ... },
    "contentPolicies": { ... },
    "promptingAgenda": { ... },
    "knownLimitations": { ... }
  }
}
```

## 6.2 Alignment Documentation

### 6.2.1 Methodology

Description of alignment techniques applied:

```json
"alignment": {
  "methodology": {
    "techniques": [
      { "name": "RLHF", "description": "Reinforcement Learning from Human Feedback", "applied": true },
      { "name": "Constitutional AI", "description": "Self-critique against defined principles", "applied": true },
      { "name": "DPO", "description": "Direct Preference Optimization", "applied": false }
    ],
    "humanFeedbackScale": "large",
    "syntheticFeedbackUsed": true
  }
}
```

### 6.2.2 Value Frameworks

Declared ethical principles and value alignments. These describe what the system was trained toward:

```json
"valueFrameworks": {
  "principles": [
    "Helpfulness: Assist users in accomplishing their goals",
    "Harmlessness: Avoid causing harm or enabling harmful actions",
    "Honesty: Provide accurate information and acknowledge uncertainty"
  ],
  "prioritization": "When principles conflict, harmlessness takes precedence",
  "documentationUrl": "https://anthropic.com/claude-values"
}
```

### 6.2.3 Safety Training

```json
"safetyTraining": {
  "categories": [
    "Refusal of harmful requests",
    "Bias mitigation",
    "Factuality and uncertainty expression",
    "Privacy protection"
  ],
  "redTeaming": {
    "conducted": true,
    "internalTeams": true,
    "externalTeams": true,
    "bugBounty": true
  },
  "evaluations": {
    "safetyBenchmarks": ["TruthfulQA", "BBQ", "RealToxicityPrompts"],
    "resultsUrl": "https://anthropic.com/claude-evals"
  }
}
```

## 6.3 Content Policies

### 6.3.1 Prohibited Content

Categories of content the system refuses to generate or assist with:

```json
"prohibited": [
  { "category": "CSAM", "description": "Child sexual abuse material", "enforcement": "absolute" },
  { "category": "weapons_mass_destruction", "description": "Instructions for biological, chemical, nuclear, or radiological weapons", "enforcement": "absolute" },
  { "category": "malware", "description": "Functional malicious code", "enforcement": "absolute" }
]
```

### 6.3.2 Sensitive Topics

Topics subject to special handling, caveats, or guardrails:

```json
"sensitiveTopics": [
  { "category": "medical_advice", "handling": "Provides general information with disclaimer to consult professionals", "caveats": true },
  { "category": "legal_advice", "handling": "Provides general information with disclaimer about jurisdiction-specific laws", "caveats": true },
  { "category": "political_content", "handling": "Attempts balanced presentation of multiple viewpoints", "caveats": true },
  { "category": "self_harm", "handling": "Redirects to crisis resources when appropriate", "caveats": true }
]
```

### 6.3.3 Jurisdictional Variations

Region-specific policy adaptations:

```json
"jurisdictionalVariations": [
  { "region": "EU", "variations": ["Enhanced privacy protections per GDPR", "AI Act transparency compliance"] },
  { "region": "CN", "variations": ["Content restrictions per local regulations"], "available": false }
]
```

## 6.4 Prompting Agenda

Inference-time behavioral shaping. Full system prompts are typically proprietary, but this section describes intent.

### 6.4.1 System Prompt Summary

```json
"promptingAgenda": {
  "systemPromptSummary": {
    "description": "High-level behavioral instructions",
    "themes": [
      "Helpful and conversational tone",
      "Acknowledges uncertainty when appropriate",
      "Declines harmful requests politely",
      "Cites sources when making factual claims"
    ],
    "length": "medium",
    "lastUpdated": "2025-12-01"
  }
}
```

### 6.4.2 Persona Declaration

If the system adopts a persona:

```json
"persona": {
  "hasPersona": true,
  "name": "Claude",
  "description": "An AI assistant created by Anthropic",
  "traits": ["curious", "thoughtful", "direct"],
  "claimsHumanity": false
}
```

For brand-specific agents:

```json
"persona": {
  "hasPersona": true,
  "name": "Home Depot Product Assistant",
  "description": "A shopping assistant for Home Depot customers",
  "traits": ["knowledgeable about home improvement", "helpful", "product-focused"],
  "brandAssociation": "The Home Depot, Inc."
}
```

### 6.4.3 Bias Declarations

Known or intentional biases that affect system behavior:

```json
"biasDeclarations": [
  { "type": "intentional", "description": "Recommendations prioritize Home Depot products over competitors", "reason": "System is operated by Home Depot for their customers" },
  { "type": "known_limitation", "description": "May have reduced performance on low-resource languages", "mitigation": "Documented in model card; ongoing improvement efforts" }
]
```

## 6.5 Known Limitations

Documented weaknesses and failure modes:

```json
"knownLimitations": {
  "factuality": {
    "description": "May generate plausible-sounding but incorrect information",
    "severity": "medium",
    "mitigation": "Trained to express uncertainty; users should verify critical facts"
  },
  "recency": {
    "description": "Knowledge has a training cutoff date",
    "cutoffDate": "2025-06-01",
    "mitigation": "Can be connected to real-time data sources via Capabilities Layer"
  },
  "reasoning": {
    "description": "May make errors in complex multi-step reasoning",
    "severity": "medium",
    "mitigation": "Chain-of-thought prompting can help; users should verify logic"
  },
  "languages": {
    "description": "Performance varies by language",
    "strongLanguages": ["en", "fr", "de", "es", "zh"],
    "limitedLanguages": ["low-resource languages generally"]
  }
}
```

---

Previous: [Foundation Layer](05-foundation-layer.md) | Next: [Capabilities Layer](07-capabilities-layer.md)
