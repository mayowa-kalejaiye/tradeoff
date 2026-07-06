import { StartupModel } from '../models/startup';
import { DecisionGraph, ArchitectureDriver, ImplementationNode, EngineeringPrinciples, ReasoningNode } from './graph';
import { adaptV3toV5 } from './adapter';

// ─── Decision Record: Who won, who lost, why ───
export interface DecisionRecord {
  capability: string;
  chosen: ImplementationNode;
  notChosen: { id: string; name: string; score: number; reasonNotChosen: string; winsWhen: string[] }[];
  rationale: string;
  evidence: string[];
  principles: string[];
  evidenceStrength: 'Strong' | 'Moderate' | 'Weak';
  stability: 'Very Stable' | 'Moderately Stable' | 'Fragile';
}

// ─── Pressure Map: What's driving the architecture ───
export interface PressureSource {
  driver: ArchitectureDriver;
  pressure: number;               // 0-100
  influencedDecisions: string[];  // Decision context names
}

// ─── Executive Facts for LLM summary ───
export interface ExecutiveFacts {
  dominantCapabilities: string[];
  dominantConstraints: string[];
  activatedSystemGroups: string[];
  majorDecisions: string[];       // e.g. "MQTT over Kafka for Reliable Messaging"
  topPressures: string[];         // e.g. "Reliability (85%)"
  decisionCount: number;
  notChosenCount: number;
}

import { ExecutionTrace, SuppressedNode } from '../debug/trace';

// ─── Resolution Telemetry ───
export interface ResolutionTelemetry {
  activatedNodes: string[];
  suppressedNodes: SuppressedNode[];
  executionTraces: ExecutionTrace[];
  decisionRecords: DecisionRecord[];
  pressureMap: PressureSource[];
  executiveFacts: ExecutiveFacts;
  insightPatches?: string[];
}

export interface ResolverOutput {
  activeGraph: ImplementationNode[];
  telemetry: ResolutionTelemetry;
}

// ─── Compute Pressure Map from StartupModel ───
function computePressureMap(model: StartupModel): Map<ArchitectureDriver, number> {
  const pressures = new Map<ArchitectureDriver, number>();

  let reliability = 40; // baseline
  if (model.priority === 'reliability') reliability += 40;
  if (model.criticality === 'safety_critical') reliability += 20;
  if (model.offlineRequirements !== 'none') reliability += 10;
  pressures.set(ArchitectureDriver.Reliability, Math.min(100, reliability));

  let latency = 20;
  if (model.latencyTolerance === 'realtime') latency += 50;
  if (model.latencyTolerance === 'ultra_low') latency += 70;
  if (model.latencyTolerance === 'medium') latency += 20;
  pressures.set(ArchitectureDriver.Latency, Math.min(100, latency));

  let cost = 30;
  if (model.priority === 'cost') cost += 50;
  if (model.budget === 'bootstrap') cost += 30;
  if (model.budget === 'seed') cost += 15;
  pressures.set(ArchitectureDriver.Cost, Math.min(100, cost));

  let compliance = 10;
  if (model.complianceLevel === 'hipaa') compliance += 60;
  if (model.complianceLevel === 'pci_dss') compliance += 50;
  if (model.complianceLevel === 'soc2') compliance += 40;
  pressures.set(ArchitectureDriver.Compliance, Math.min(100, compliance));

  let velocity = 30;
  if (model.priority === 'speed') velocity += 50;
  if (model.teamScale === 'solo') velocity += 20;
  if (model.teamScale === 'small') velocity += 10;
  pressures.set(ArchitectureDriver.DeveloperVelocity, Math.min(100, velocity));

  let scalability = 20;
  if (model.priority === 'scale') scalability += 50;
  if (model.scale === 'massive') scalability += 30;
  if (model.scale === 'growth') scalability += 15;
  if (model.expectedUsers > 500000) scalability += 20;
  pressures.set(ArchitectureDriver.Scalability, Math.min(100, scalability));

  let availability = 30;
  if (model.offlineRequirements === 'full') availability += 40;
  if (model.offlineRequirements === 'partial') availability += 20;
  if (model.criticality === 'safety_critical') availability += 20;
  pressures.set(ArchitectureDriver.Availability, Math.min(100, availability));

  let safety = 10;
  if (model.criticality === 'safety_critical') safety += 70;
  if (model.capabilities?.some(c => c.id === 'robot_coordination' || c.id === 'fleet_management')) safety += 20;
  pressures.set(ArchitectureDriver.Safety, Math.min(100, safety));

  let security = 20;
  if (model.complianceLevel === 'hipaa' || model.complianceLevel === 'pci_dss') security += 50;
  if (model.criticality === 'financial_critical') security += 30;
  pressures.set(ArchitectureDriver.Security, Math.min(100, security));

  let maintainability = 30;
  if (model.teamScale === 'solo' || model.teamScale === 'small') maintainability += 20;
  if (model.runwayMonths && model.runwayMonths < 12) maintainability += 10;
  pressures.set(ArchitectureDriver.Maintainability, Math.min(100, maintainability));

  return pressures;
}

// ─── Extract evidence from StartupModel ───
function extractEvidence(model: StartupModel): string[] {
  const evidence: string[] = [];
  if (model.intent) evidence.push(`Optimization Target: ${model.intent}`);
  if (model.criticality === 'safety_critical') evidence.push('Safety-critical system');
  if (model.criticality === 'financial_critical') evidence.push('Financial-critical system');
  if (model.complianceLevel && model.complianceLevel !== 'unknown') evidence.push(`${model.complianceLevel.toUpperCase()} compliance required`);
  if (model.offlineRequirements !== 'none') evidence.push(`Offline requirements: ${model.offlineRequirements}`);
  if (model.priority) evidence.push(`Priority: ${model.priority}`);
  if (model.expectedUsers > 100000) evidence.push(`${model.expectedUsers.toLocaleString()} expected users`);
  if (model.scale === 'massive') evidence.push('Massive scale target');
  if (model.latencyTolerance === 'realtime' || model.latencyTolerance === 'ultra_low') evidence.push(`${model.latencyTolerance} latency requirements`);
  return evidence;
}

function assessEvidenceStrength(nodeScore: number, driverAlignment: number): 'Strong' | 'Moderate' | 'Weak' {
  if (nodeScore > 80 && driverAlignment > 0.5) return 'Strong';
  if (nodeScore > 50) return 'Moderate';
  return 'Weak';
}

function computeStability(changesWhen: string[]): 'Very Stable' | 'Moderately Stable' | 'Fragile' {
  if (!changesWhen || changesWhen.length === 0) return 'Very Stable';
  if (changesWhen.length <= 2) return 'Moderately Stable';
  return 'Fragile';
}

// ─── Main Resolver ───
export function resolveGraph(
  graphs: DecisionGraph[],
  model: StartupModel,
  domainScores: Record<string, number>
): ResolverOutput {
  // 1. Merge graphs and Adapt to V5
  const mergedV3: DecisionGraph = { nodes: new Map(), edges: [] };
  for (const g of graphs) {
    for (const [id, node] of g.nodes.entries()) {
      mergedV3.nodes.set(id, node);
    }
    mergedV3.edges.push(...g.edges);
  }
  
  const reasoningGraph = adaptV3toV5(mergedV3);
  const allNodes = reasoningGraph.nodes;
  const allEdges = reasoningGraph.edges;

  // 1.5 Compile capability strings for quick match (handling .* wildcards)
  const extractedCaps = model.capabilities || [];
  const matchCap = (pattern: string) => {
    if (pattern.endsWith('.*')) {
      const prefix = pattern.slice(0, -2);
      return extractedCaps.some(c => c.id.startsWith(prefix));
    }
    return extractedCaps.some(c => c.id === pattern);
  };

  const getCapScore = (pattern: string) => {
    if (pattern.endsWith('.*')) {
      const prefix = pattern.slice(0, -2);
      const matches = extractedCaps.filter(c => c.id.startsWith(prefix));
      return matches.length > 0 ? Math.max(...matches.map(m => m.score)) : 0;
    }
    const match = extractedCaps.find(c => c.id === pattern);
    return match ? match.score : 0;
  };

  // 2. Filter down to Implementation Options and apply Eligibility (Activation Gate)
  const candidates = new Map<string, ImplementationNode>();
  const suppressedNodes: SuppressedNode[] = [];
  const executionTraces: ExecutionTrace[] = [];
  
  for (const [id, node] of allNodes.entries()) {
    if (node.type === 'Implementation') {
      const n = node as ImplementationNode;
      let eligible = true;
      let failedElgType: 'anyOf' | 'allOf' | 'noneOf' | undefined;
      let failedDetails: string[] = [];
      
      if (n.eligibility) {
        if (n.eligibility.noneOf && n.eligibility.noneOf.some(matchCap)) {
          eligible = false;
          failedElgType = 'noneOf';
          failedDetails = n.eligibility.noneOf.filter(matchCap);
        } else if (n.eligibility.allOf && !n.eligibility.allOf.every(matchCap)) {
          eligible = false;
          failedElgType = 'allOf';
          failedDetails = n.eligibility.allOf.filter(c => !matchCap(c));
        } else if (n.eligibility.anyOf && !n.eligibility.anyOf.some(matchCap)) {
          eligible = false;
          failedElgType = 'anyOf';
          failedDetails = n.eligibility.anyOf;
        }
      }

      if (eligible) {
        candidates.set(id, n);
      } else {
        suppressedNodes.push({
          id,
          name: n.name,
          reason: 'failed_eligibility',
          failedEligibility: failedElgType ? { type: failedElgType, details: failedDetails } : undefined,
          confidence: 100, // Determined at extraction
          evidence: extractedCaps.map(c => c.name)
        });
      }
    }
  }

  // 3. Compute pressure map from constraints
  const pressures = computePressureMap(model);

  // 4. Initial scoring (Applicability Evaluation)
  const scores = new Map<string, number>();
  const nodeEvidence = new Map<string, string[]>(); // Store scoring signals

  const partialTraces = new Map<string, ExecutionTrace>();

  for (const [id, node] of candidates.entries()) {
    const baseScore = node.score(model);
    let totalScore = baseScore;
    const ev: string[] = [];
    
    const driverBonuses: { driver: string; bonus: number }[] = [];
    const capabilityBonuses: { capability: string; bonus: number }[] = [];
    const industryBonuses: { industry: string; bonus: number }[] = [];

    // Driver bonus
    let driverBonusTotal = 0;
    if (node.drivers) {
      for (const [driver, driverWeight] of Object.entries(node.drivers)) {
        const pressure = pressures.get(driver as ArchitectureDriver) || 0;
        const b = (pressure / 100) * (driverWeight as number) * 15;
        driverBonusTotal += b;
        if (b > 0) driverBonuses.push({ driver, bonus: b });
      }
    }
    totalScore += driverBonusTotal;

    // Capability Match Bonus
    if (node.applicability?.prefersCapabilities) {
      for (const capPattern of node.applicability.prefersCapabilities) {
        const capStrength = getCapScore(capPattern);
        if (capStrength > 0) {
          const capBonus = (capStrength / 100) * 20; // Up to 20 pts per matched preferred capability
          totalScore += capBonus;
          capabilityBonuses.push({ capability: capPattern, bonus: capBonus });
          ev.push(`Matched capability ${capPattern} (+${Math.round(capBonus)})`);
        }
      }
    }

    // Industry Context Bonus
    if (node.applicability?.prefersIndustries) {
      for (const ind of node.applicability.prefersIndustries) {
        if (model.industryContexts?.includes(ind)) {
          totalScore += 30; // Strong match for industry context
          industryBonuses.push({ industry: ind, bonus: 30 });
          ev.push(`Matched industry context ${ind} (+30)`);
        }
      }
    }

    scores.set(id, totalScore);
    nodeEvidence.set(id, ev);
    
    // Build activation trace facts based on matching extracted caps
    const anyOfSatisfied: {name: string, score: number}[] = [];
    const allOfSatisfied: {name: string, score: number}[] = [];
    if (node.eligibility?.anyOf) {
      node.eligibility.anyOf.forEach(p => {
        const sc = getCapScore(p);
        if (sc > 0) anyOfSatisfied.push({ name: p, score: sc });
      });
    }
    if (node.eligibility?.allOf) {
      node.eligibility.allOf.forEach(p => {
        const sc = getCapScore(p);
        if (sc > 0) allOfSatisfied.push({ name: p, score: sc });
      });
    }

    partialTraces.set(id, {
      candidateId: id,
      candidateName: node.name,
      activation: { anyOfSatisfied, allOfSatisfied },
      evaluation: {
        baseScore,
        driverBonuses,
        capabilityBonuses,
        industryBonuses,
        finalScore: totalScore
      },
      isWinner: false,
      arena: node.systemGroup || 'global'
    });
  }

  // 5. Edge traversal
  let changed = true;
  let iterations = 0;
  while (changed && iterations < 5) {
    changed = false;
    iterations++;
    for (const edge of allEdges) {
      const sourceScore = scores.get(edge.sourceId) || 0;
      const targetScore = scores.get(edge.targetId) || 0;
      if (sourceScore > 50) {
        let modifier = 0;
        if (edge.type === 'requires' || edge.type === 'implementedBy') modifier = 50;
        if (edge.type === 'recommends' || edge.type === 'enhances') modifier = 20;
        if (edge.type === 'blocks' || edge.type === 'invalidates') modifier = -100;
        if (modifier !== 0) {
          const newScore = targetScore + modifier;
          if (Math.abs(newScore - targetScore) > 1) {
            scores.set(edge.targetId, newScore);
            changed = true;
          }
        }
      }
    }
  }

  // 6. Group by Capability into DecisionArenas
  const activeNodes: ImplementationNode[] = [];
  const decisionRecords: DecisionRecord[] = [];
  const arenaMap = new Map<string, string[]>();
  const evidence = extractEvidence(model);

  for (const [id, node] of candidates.entries()) {
    if ((scores.get(id) || 0) < 50) {
      suppressedNodes.push(id);
      continue;
    }
    const cap = node.capability || 'Core';
    if (!arenaMap.has(cap)) arenaMap.set(cap, []);
    arenaMap.get(cap)!.push(id);
  }

  // 7. For each capability arena, pick winner
  const contextWinners = new Set<string>();
  const driverInfluenceTracker = new Map<ArchitectureDriver, string[]>();

  for (const [cap, nodeIds] of arenaMap.entries()) {
    if (nodeIds.length === 0) continue;
    if (nodeIds.length === 1) {
      contextWinners.add(nodeIds[0]);
    }

    const ranked = nodeIds.map(id => {
      const n = candidates.get(id)!;
      return {
        id,
        node: n,
        totalScore: scores.get(id) || 0
      };
    }).sort((a, b) => b.totalScore - a.totalScore);

    const winner = ranked[0];
    contextWinners.add(winner.id);

    // Track driver influence for winner
    if (winner.node.drivers) {
      for (const driver of Object.keys(winner.node.drivers) as ArchitectureDriver[]) {
        if (!driverInfluenceTracker.has(driver)) driverInfluenceTracker.set(driver, []);
        driverInfluenceTracker.get(driver)!.push(cap);
      }
    }

    // Calculate driver alignment for evidence strength
    let driverAlignment = 0;
    const driverCount = winner.node.drivers ? Object.keys(winner.node.drivers).length : 0;
    if (driverCount > 0 && winner.node.drivers) {
      for (const [driver, weight] of Object.entries(winner.node.drivers)) {
        const pressure = pressures.get(driver as ArchitectureDriver) || 0;
        driverAlignment += (pressure / 100) * (weight as number);
      }
      driverAlignment /= driverCount;
    }

    // Build Decision Record
    const notChosen = ranked.slice(1).map(r => {
      suppressedNodes.push({
        id: r.id,
        name: r.node.name,
        reason: 'failed_constraint', // Specifically, lost in the arena constraint
        failedConstraint: `Scored lower than ${winner.node.name} for ${cap} (${r.totalScore.toFixed(0)} vs ${winner.totalScore.toFixed(0)})`,
        confidence: 100,
        evidence: []
      });
      
      const loserTrace = partialTraces.get(r.id);
      if (loserTrace) {
        executionTraces.push(loserTrace);
      }
      
      return {
        id: r.id,
        name: r.node.name,
        score: r.totalScore,
        reasonNotChosen: `Scored lower than ${winner.node.name} for ${cap} (${r.totalScore.toFixed(0)} vs ${winner.totalScore.toFixed(0)})`,
        winsWhen: r.node.winsWhen || []
      };
    });

    const winnerTrace = partialTraces.get(winner.id);
    if (winnerTrace) {
      winnerTrace.isWinner = true;
      executionTraces.push(winnerTrace);
    }

    // 8. Engineering Principles (Explanatory Evidence)
    const principles = winner.node.principles?.map(pid => EngineeringPrinciples[pid]?.statement).filter(Boolean) as string[] || [];
    if (principles.length === 0) {
      principles.push("Favor standard patterns for predictability."); // Fallback principle
    }

    // 9. Attach Scoring Signals
    const scoringEvidence = nodeEvidence.get(winner.id) || [];
    const combinedEvidence = [...evidence, ...scoringEvidence];

    const rationale = `Because the system requires ${cap.replace(/_/g, ' ')}, ${winner.node.name} is the optimal choice.`;

    decisionRecords.push({
      capability: cap,
      chosen: winner.node,
      notChosen,
      rationale,
      evidence: combinedEvidence,
      principles,
      evidenceStrength: assessEvidenceStrength(winner.totalScore, driverAlignment),
      stability: computeStability(winner.node.changesWhen)
    });
    
    activeNodes.push(winner.node);
  }

  // 10. Architecture Validation (Cross-Node Invariants)
  const validationErrors: string[] = [];
  const activeIds = new Set(activeNodes.map(n => n.id));

  for (const node of activeNodes) {
    if (node.requires) {
      for (const req of node.requires) {
        if (!activeIds.has(req)) {
          validationErrors.push(`[Validation] ${node.name} requires ${req}, but it was not selected.`);
        }
      }
    }
    if (node.incompatibleWith) {
      for (const inc of node.incompatibleWith) {
        if (activeIds.has(inc)) {
          validationErrors.push(`[Validation] ${node.name} is incompatible with selected node ${inc}.`);
        }
      }
    }
  }

  if (validationErrors.length > 0) {
    console.warn("Architecture Validation Errors:\n" + validationErrors.join("\n"));
  }

  // 6. Build Pressure Map from driver influence tracking
  const pressureMap: PressureSource[] = [];
  for (const [driver, pressure] of pressures.entries()) {
    if (pressure > 15) { // Only include meaningful pressures
      pressureMap.push({
        driver,
        pressure,
        influencedDecisions: driverInfluenceTracker.get(driver) || []
      });
    }
  }
  pressureMap.sort((a, b) => b.pressure - a.pressure);

  // 7. Build Executive Facts
  const dominantCapabilities = model.capabilities
    ? model.capabilities.sort((a, b) => b.score - a.score).slice(0, 4).map(c => c.name)
    : [];

  const activatedSystemGroups = [...new Set(activeNodes.map(n => n.systemGroup))];

  const majorDecisions = decisionRecords
    .filter(dr => dr.notChosen.length > 0)
    .map(dr => `${dr.chosen.name} over ${dr.notChosen.map(r => r.name).join(', ')} for ${dr.capability}`);

  const topPressures = pressureMap
    .slice(0, 5)
    .map(p => `${p.driver} (${p.pressure}%)`);

  const executiveFacts: ExecutiveFacts = {
    dominantCapabilities,
    dominantConstraints: evidence.slice(0, 5),
    activatedSystemGroups,
    majorDecisions,
    topPressures,
    decisionCount: decisionRecords.length,
    notChosenCount: decisionRecords.reduce((sum, dr) => sum + dr.notChosen.length, 0)
  };

  // Deduplicate suppressed nodes by ID
  const uniqueSuppressed = Array.from(
    new Map(suppressedNodes.map(n => [n.id, n])).values()
  );

  return {
    activeGraph: activeNodes,
    telemetry: {
      activatedNodes: activeNodes.map(n => n.id),
      suppressedNodes: uniqueSuppressed,
      executionTraces,
      decisionRecords,
      pressureMap,
      executiveFacts
    }
  };
}
