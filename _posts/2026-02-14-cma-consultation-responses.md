---
layout: post
title: "Our responses to the CMA consultations on Google Search and AI"
subtitle: "We submitted two responses to the UK Competition and Markets Authority this week, covering publisher conduct and fair ranking. Here is what we said and why."
date: 2026-02-14
author: "Alex Springer"
tags: [policy]
reading_time: 7
---

The UK's Competition and Markets Authority is consulting on new rules for how Google Search handles publisher content in AI features. We submitted two responses from OpenAttribution this week after attending the Publisher Conduct and Fair Ranking roundtables.

Both responses are available in full:

- [Publisher Conduct CR response](/blog/attachments/cma-publisher-cr-response)
- [Fair Ranking CR response](/blog/attachments/cma-fair-ranking-cr-response)

Here is a summary of our key positions.

## Publisher Conduct: crawler separation deserves another look

The CMA's provisional assessment concludes that requiring Google to separate its AI crawlers from its search crawlers is disproportionate. We disagree, for a structural reason.

The controls framework has a weakness. Interpretative Note 5 draws a distinction between active circumvention — paying a third party to crawl on Google's behalf — and passive acquisition from pre-existing datasets. The CMA considers it reasonable for Google to acquire content through open-source datasets where those datasets obtained content legally.

The practical effect for publishers is the same regardless. A publisher who blocks Google-Extended can still have their content ingested for AI training via Common Crawl and similar corpora. These datasets contain years of content compiled before publishers had any AI-specific opt-out mechanism, and blocking CCBot now only affects future crawls, not the archive already in circulation. With separate crawlers, a publisher's decision to block AI crawling is enforced at the point of access, removing reliance on downstream controls whose effectiveness depends on how narrowly "circumvention" is defined.

Google claimed its own costs for crawler separation would be at least £150 million per year. The CMA itself notes these estimates were not made with a high degree of confidence. Google already operates multiple crawlers, and a third party with direct technical knowledge considers separation technically feasible. Given the CMA's illustrative benefit range of £32-111 million per year, the cost-benefit case deserves harder scrutiny.

## Publisher Conduct: independent verification is the cross-cutting issue

Across all seven consultation questions, one theme recurs: platform self-reporting is insufficient. The CMA should not create a regime where compliance is self-certified.

The digital advertising industry learned this lesson. Platforms self-certified viewability, reach, and fraud metrics for years. Trust only emerged when independent verification became possible.

Citation counting is insufficient for attribution. Microsoft's AI Performance feature in Bing Webmaster Tools, launched just days ago, shows publishers how their content is cited across Copilot and Bing AI summaries. This demonstrates that providing AI attribution data to publishers is feasible for a major search platform. Even Microsoft's tool currently tracks citation frequency only, without click-through data — illustrating that citation counting alone is an incomplete picture.

The CMA should push toward contribution scoring: measuring not just that content was used, but how much it influenced the outcome. And critically, Google should provide raw event data via standardised APIs, enabling independent verification rather than self-reported metrics.

## Publisher Conduct: training and grounding are not the same thing

We argued strongly for separate controls for training versus grounding. Training is effectively permanent — content is absorbed into model weights with no practical mechanism for removal. Grounding is per-query and revocable. Attribution is straightforward for grounding but not currently feasible at production scale for training.

A product review site may welcome grounding — cited reviews that drive traffic back — while refusing training, where content is absorbed permanently with no attribution and no revocability. A bundled control forces acceptance of both or neither, pushing publishers toward blanket blocking that harms consumers.

Robots.txt was designed for crawl management and is not fit for purpose as a licensing tool. It cannot express the training/grounding distinction and provides no verification that the directive was honoured.

## Fair Ranking: scope must be defined by function, not product label

The Fair Ranking CR includes AI Overviews and AI Mode in scope. But AI Mode is converging with Gemini, which the CMA already excluded from general search services in the SMS Decision. If AI Mode continues evolving toward a conversational product — and Google has commercial incentives to do so — the CMA faces a classification problem.

The interpretative notes should define scope by function: if a feature uses search-crawled content to generate responses to user queries, it is in scope regardless of branding. Without this, Google can move content-dependent activity outside the CR's reach by restructuring features.

## Fair Ranking: the citation selection gap

There is a gap between the two CRs that concerns us most. The Fair Ranking CR covers ranking within and relative to AI features on the SERP. It does not explicitly cover how content is selected inside an AI-generated response.

If an AI Overview draws on five sources but cites two, that selection has commercial consequences for publishers. The AI Overview has offered a better response because of the content it has drawn on, even if a user never sees the citation. Neither instrument explicitly covers source selection within generated text. We asked the CMA to clarify which instrument governs this.

## Fair Ranking: opt-out protection must cover presentation effects

Paragraph 4(a)(iii) of the Fair Ranking CR, prohibiting downranking of publishers who opt out of AI features, is the single most important provision for making the Publisher CR's opt-out controls work.

But Google is unlikely to implement an explicit ranking penalty for opt-outs. It does not need to. As AI features take more above-the-fold SERP space, publishers who opt out lose visibility by not appearing in the dominant feature. No ranking signal is needed — the presentation does the work. If a publisher opts out of AI Overviews and appears only in organic results pushed below the fold, the practical outcome is a ranking penalty. The non-discrimination provision should explicitly cover these presentation effects.

We also flagged that AI content licensing deals — a new category of commercial arrangement — should be covered by the non-discrimination provision. As publishers begin negotiating paid agreements with Google for AI training data, there is a foreseeable risk that licensed content receives preferential treatment in AI responses.

## What we are offering

OpenAttribution is building the open infrastructure to make content attribution in AI systems technically feasible. We referenced our tools as evidence that the approaches we propose are technically possible, not to advocate for any specific product:

- **Identity** ([AIMS](https://github.com/openattribution-org/aims)) — so AI systems can prove who they are and what they are licensed to access
- **Measurement** ([Telemetry](https://github.com/openattribution-org/telemetry)) — so content influence on AI outputs can be tracked and audited
- **Tools** ([PolicyCheck](https://openattribution.org/policycheck/)) — so publishers can understand the current state of AI access to their content

These are open standards, Apache 2.0 licensed, and available for any regulator, platform, or publisher to use and build on.

## Recommendations summary

**Publisher Conduct CR:**

1. Reconsider crawler separation, or tighten the circumvention provision in Interpretative Note 5 to cover acquisition of opted-out content via third-party datasets
2. Require independent verification of attribution — if the 12-month review's evidence base is entirely Google-generated, it cannot function as intended
3. Require outcome-based metrics alongside per-feature data
4. Implement a structured blocking-reason taxonomy in Search Console

**Fair Ranking CR:**

1. Define scope by function, not product label — capture content-dependent AI features regardless of branding
2. Clarify which CR governs citation selection inside AI responses
3. Extend opt-out protection to presentation effects — displacement below the fold is functionally a ranking penalty
4. Cover AI licensing deals in the non-discrimination provision
5. Define "material change" to cover AI feature changes
6. Track AI feature complaints separately in quarterly summaries

## Get involved

The CMA consultations close on 25 February 2026. If you are a publisher, platform, or technology provider with views on how AI systems should handle content attribution, we would encourage you to respond.

You can also [get involved with OpenAttribution](https://openattribution.org/#contact) directly.
