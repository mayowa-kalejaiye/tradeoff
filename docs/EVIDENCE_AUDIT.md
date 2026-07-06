# Evidence Audit: V6.1 Engine Explainability

## Executive Summary

The Engineering Reasoning Engine (V6.1) has been refactored to prioritize explicit traceability and diagnostic visibility. 
This document serves as an audit of how the engine proves its decisions rather than fabricating reasoning post-hoc.

## 1. Traceability Principles

1. **Never fabricate reasoning after resolution.** All explanations shown to the user must come from data that actually existed during execution.
2. **Deterministic eligibility.** A technology is either eligible or it isn't. The engine must capture *why* it failed eligibility.
3. **Transparent scoring.** The final score of a candidate must be a verifiable sum of its base score, drivers, capability alignments, and industry affinities.
4. **Observable suppression.** When a technology is gated (either by an explicit constraint or by missing capabilities), the exact reason is captured and surfaced.

## 2. The Execution Trace Lifecycle

Every candidate evaluated by the `Resolver` now produces an `ExecutionTrace`.

```typescript
export interface ExecutionTrace {
  candidateId: string;
  candidateName: string;
  arena: string;
  activation: ActivationTrace;
  evaluation: EvaluationTrace;
  isWinner: boolean;
}
```

### 2.1 Activation (Eligibility)
Before a candidate enters an arena, it is evaluated for eligibility. The engine now records exactly which rules satisfied the activation criteria.

* `anyOfSatisfied`: Records which "OR" conditions were met.
* `allOfSatisfied`: Records which "AND" conditions were met.

### 2.2 Evaluation (Applicability)
If a node passes eligibility, it enters an arena and receives a score. The score is mathematically verifiable through the `EvaluationTrace`.

* `baseScore`: The node's baseline heuristic score.
* `capabilityBonuses`: Points added because the node inherently prefers specific capabilities present in the user's prompt.
* `industryBonuses`: Points added due to strong affinity with the user's industry.
* `driverBonuses`: Points added because the node aligns with the architectural drivers (e.g., Latency, Maintainability).
* `finalScore`: The verifiable sum.

## 3. Suppression Telemetry

Nodes that are explicitly blocked by constraints or fail the stringent eligibility rules are captured as `SuppressedNode`s.

```typescript
export interface SuppressedNode {
  id: string;
  name: string;
  reason: 'FAILED_ELIGIBILITY' | 'FAILED_CONSTRAINT' | 'LOST_IN_ARENA';
  failedConstraint?: string;
  failedEligibility?: {
    type: 'MISSING_ALL_OF' | 'MISSING_ANY_OF' | 'HIT_NONE_OF';
    details: string[];
  };
}
```

This ensures that we can prove *why* a popular technology (like Kubernetes or Kafka) was intentionally excluded, preventing accusations of engine hallucination or simple omission.

## 4. UI Surfacing (Developer Mode)

The `ExecutionTrace` and `SuppressedNode` datasets are propagated up through the `ResolutionTelemetry` to the frontend.
By appending `?debug=true` to any report URL, internal developers can view the **Engine Diagnostics** panel. This renders:
1. Every candidate that competed, what arena it competed in, its exact score breakdown, and its eligibility satisfaction criteria.
2. Every suppressed candidate, along with the specific constraint or missing capability that caused its suppression.

## 5. Regression Harness

To prove the engine's mechanical consistency, a deterministic regression harness (`tests/reasoning/run_regression.ts`) evaluates a corpus of 20 canonical scenarios spanning four failure classifications:
* **Explicit**: Clear-cut requirements (e.g., "Hospital robot").
* **Implicit**: Implied requirements derived from constraints (e.g., "Streaming live video").
* **Conflicting**: Real-world tradeoffs (e.g., "Local CRDT vs Central SQLite").
* **Misleading**: Over-engineering requests (e.g., "Kafka for a Todo App").

The suite asserts on both `mustActivate` and `mustSuppress` constraints, ensuring that the engine correctly handles both inclusion and intentional exclusion.
