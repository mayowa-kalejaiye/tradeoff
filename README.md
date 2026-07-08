<img width="1365" height="701" alt="image" src="https://github.com/user-attachments/assets/27892fc9-c0e6-4a17-8f83-a833248daaa2" />

# Tradeoff: AI Architect
**Engineering Reasoning Graph & Architecture Logs**

> **Project Description**: Architected an AI-powered technical feasibility advisor that acts as a Staff Engineer for startups, processing product briefs into robust architectural recommendations and existential risk analyses.

This repository tracks the evolution of the Tradeoff architecture engine. Over the course of four major versions, the engine has evolved from a simple deterministic ruleset into a complex semantic graph capable of reasoning through deep engineering constraints, tradeoffs, and system evolution paths.

---

## 📅 Architecture Log: Version 1 (V1)
**Era: The Rules Engine & Marketplace Templates**

### The Pipeline
`Prompt` &rarr; `Marketplace Template` &rarr; `Architecture`

### Engineering Details
The inception of Tradeoff was built entirely on **deterministic logic**. The engine evaluated a user's prompt by attempting to match it directly against a predefined set of industry templates (e.g., Healthcare, SaaS, Robotics). 

**Key Features:**
- **Static Resolution:** Hard-coded `if-this-then-that` mapping. If a user specified they were building a hospital robot, the engine fetched the `Robotics` architecture template.
- **High Reliability:** Responses were immediate, perfectly typed, and hallucination-free.
- **The Bottleneck:** The architecture was incredibly brittle. Modern software doesn't fit neatly into marketplace templates; a Healthcare Robotics startup requires both HIPAA compliance *and* edge IoT patterns. V1 struggled with overlapping domains and failed to handle custom architectural nuance.

---

## 📅 Architecture Log: Version 2 (V2)
**Era: The Knowledge Graph & LLM Patches**

### The Pipeline
`Prompt` &rarr; `Knowledge Graph` &rarr; `LLM patches` &rarr; `Architecture`

### Engineering Details
V2 marked the shift away from static templates towards dynamic assembly. We introduced the concept of a rudimentary **Knowledge Graph** composed of modular technical components rather than monolithic templates.

**Key Features:**
- **Dynamic Graph Assembly:** Instead of retrieving one template, the engine merged sub-graphs (e.g., merging the `observability` graph with the `core_backend` graph).
- **LLM Contextual Patches (`patcher.ts`):** To bridge the gap between deterministic data and human nuance, V2 used Large Language Models to "patch" the output. The LLM would review the retrieved graph and inject `insightPatches`—custom text explaining how a generic piece of technology applied to the startup's specific context.
- **The Bottleneck:** The LLM had too much control over the final architectural shape without having access to deep engineering logic. It could modify recommendations but couldn't mathematically defend *why* it did so.

---

## 📅 Architecture Log: Version 3 (V3)
**Era: Decision Intelligence & The Resolver**

### The Pipeline
`Prompt` &rarr; `Extract Constraints` &rarr; `Decision Graph` &rarr; `Resolver` &rarr; `Decision Records` &rarr; `Architecture`

### Engineering Details
V3 was a massive architectural rewrite that formally separated **understanding constraints** from **making engineering decisions**.

**Key Features:**
- **Constraint Extraction (`extractor.ts`):** The LLM was demoted from "architect" to "parser." It was strictly used to parse a user's prompt into JSON constraints (e.g., `offline-first`, `hipaa`, `low-latency`, `high-throughput`).
- **The Resolver Engine (`resolver.ts`):** We built a deterministic mathematical resolver that traversed a `DecisionGraph`. Constraints exerted "pressure" on the graph.
- **Decision Records:** For the first time, Tradeoff could explain *why* it made a choice. The `DecisionRecord` tracked not only the winning technology (e.g., `Kafka`) but also the rejected options (e.g., `RabbitMQ`), their scores, and the exact constraints that influenced the outcome.
- **The Bottleneck:** The graph ontology was too flat. A `DecisionNode` was a jumbled mix of problems, capabilities, and tools, leading to brittle resolutions. The AI was still overly reliant on "Archetypes" as inputs rather than identifying core software capabilities.

---

## 📅 Architecture Log: Version 4 (V4)
**Era: The Engineering Reasoning Graph** *(Current Version)*

### The Pipeline
`Prompt` &rarr; `Capabilities Needed` &rarr; `Reasoning Graph` &rarr; `Engineering Options` &rarr; `Decision Records` &rarr; `Decision Explorer UI`

### Engineering Details
V4 represents the transition from "recommending technologies" to **"encoding engineering judgment."** The engine now thinks like a Staff Engineer, resolving decisions based on required capabilities rather than industry archetypes.

**Key Features:**
1. **The 4-Layer Ontology:**
   The graph is now strictly structured into four hierarchical layers:
   `Problem` &rarr; `Capability` &rarr; `Decision` &rarr; `Engineering Option`
   Instead of asking "Is this Robotics?", the engine asks, "Does this system require the *Reliable Messaging* capability with an *Offline-First* attribute?"

2. **Deep Field Metrics (The "Why"):**
   Every `EngineeringOption` node now contains deep reasoning fields that were previously tribal knowledge for Staff Engineers:
   - **Engineering Complexity & Operational Cost:** Quantitative tradeoffs for every choice.
   - **Core Assumptions:** Explicit tracking of *why* a choice is valid (e.g., "Assumes sub-10ms network latency") and the consequence if false.
   - **Stress Points:** Deterministic documentation of system limits, observable symptoms (e.g., latency spikes), and mitigation strategies (e.g., shard the database).
   - **Evolution Paths:** Predictable, non-destructive growth trajectories (e.g., "Scale limits reached &rarr; Evaluate enterprise solutions").
   - **Activated Dependencies:** Visualizing downstream engineering consequences.

3. **Honest Confidence & Precedent:**
   V4 removes fake telemetry. The engine tracks `ConfidenceLevel` securely within the `DecisionRecord` and outputs strict, honest precedent tags (e.g., *"Historical data unavailable"*) rather than hallucinating "Seen in 5 similar reviews," paving the way for eventual outcome-aware telemetry loops.

4. **V3 to V4 Adapter:**
   To ensure stability, V4 includes a runtime `adapter.ts` that safely shims existing V3 `DecisionNodes` into V4 `CandidateNodes` during the graph resolution phase, allowing the UI to render the deep reasoning Explorer interface immediately while the Knowledge Graph is incrementally authored in V4-native format.

> *"The moat isn't that Tradeoff recommends technologies. It's that it makes engineering judgment visible."*
