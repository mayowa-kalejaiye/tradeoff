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

// ─── Resolution Telemetry ───
export interface ResolutionTelemetry {
  activatedNodes: string[];
  suppressedNodes: string[];
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
  if (model.capabilities?.some(c => c.name === 'robot_coordination' || c.name === 'fleet_management')) safety += 20;
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

  // 2. Compute pressure map from constraints
  const pressures = computePressureMap(model);

  // Filter down to Implementation Options for scoring
  const candidates = new Map<string, ImplementationNode>();
  for (const [id, node] of allNodes.entries()) {
    if (node.type === 'Implementation') {
      candidates.set(id, node as ImplementationNode);
    }
  }

  // 3. Initial scoring with driver pressure injection
  const scores = new Map<string, number>();
  for (const [id, node] of candidates.entries()) {
    const baseScore = node.score(model);

    // Inject pressure bonus from architecture drivers
    let driverBonus = 0;
    if (node.drivers) {
      for (const [driver, driverWeight] of Object.entries(node.drivers)) {
        const pressure = pressures.get(driver as ArchitectureDriver) || 0;
        driverBonus += (pressure / 100) * (driverWeight as number) * 15; // Up to +15 per driver
      }
    }

    scores.set(id, baseScore + driverBonus);
  }

  // 4. Edge traversal
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

  // 5. Group by Capability into DecisionArenas
  const activeNodes: ImplementationNode[] = [];
  const suppressedNodes: string[] = [];
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

  // For each capability arena, pick winner, record notChosen
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
      suppressedNodes.push(r.id);
      return {
        id: r.id,
        name: r.node.name,
        score: r.totalScore,
        reasonNotChosen: `Scored lower than ${winner.node.name} for ${cap} (${r.totalScore.toFixed(0)} vs ${winner.totalScore.toFixed(0)})`,
        winsWhen: r.node.winsWhen || []
      };
    });

    // Deterministic narrative generation based on evidence and capability
    const primaryConstraint = evidence[0] || 'specific scaling requirements';
    const rationale = `Because the system must handle ${primaryConstraint.toLowerCase()}, and requires ${cap.replace(/_/g, ' ')}, ${winner.node.name} is the optimal choice.`;

    const principles = winner.node.principles?.map(pid => EngineeringPrinciples[pid]?.statement).filter(Boolean) as string[] || [];
    if (principles.length === 0) {
      principles.push("Favor standard patterns for predictability."); // Fallback principle
    }

    decisionRecords.push({
      capability: cap,
      chosen: winner.node,
      notChosen,
      rationale,
      evidence,
      principles,
      evidenceStrength: assessEvidenceStrength(winner.totalScore, driverAlignment),
      stability: computeStability(winner.node.changesWhen)
    });
  }

  for (const id of contextWinners) {
    if (!activeNodes.find(n => n.id === id)) {
      activeNodes.push(candidates.get(id)!);
    }
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

  return {
    activeGraph: activeNodes,
    telemetry: {
      activatedNodes: activeNodes.map(n => n.id),
      suppressedNodes: Array.from(new Set(suppressedNodes)),
      decisionRecords,
      pressureMap,
      executiveFacts
    }
  };
}
