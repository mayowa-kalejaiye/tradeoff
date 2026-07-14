import { ArchitectureOutput, DecisionCard, RejectedDecision, PressureMapEntry } from '../../engine/types';
import { KnowledgePack } from '../../engine/knowledge/types';
import { ImplementationNode } from '../../engine/knowledge/graph';
import { ResolutionTelemetry } from '../../engine/knowledge/resolver';
import { ArchitectureAdaptation } from './schema';
import { StartupModel } from '../../engine/models/startup';

export function applyPatches(
  input: StartupModel,
  knowledgePack: KnowledgePack,
  adaptation: ArchitectureAdaptation,
  activeGraph: ImplementationNode[],
  telemetry: ResolutionTelemetry
): ArchitectureOutput {
  // If it's a legacy output, deep clone it
  const output: ArchitectureOutput = knowledgePack.legacyOutput 
    ? JSON.parse(JSON.stringify(knowledgePack.legacyOutput)) 
    : generateEmptyOutput();

  // Apply Executive Summary
  if (adaptation.executiveSummary) {
    output.recommended = [{
      name: output.architectureStyle || 'Generated Architecture',
      reasons: [adaptation.executiveSummary]
    }];
  }

  // Apply Principal Critique
  if (adaptation.principalCritique) {
    output.principalCritique = adaptation.principalCritique;
  }

  // Apply Graph Nodes
  if (activeGraph.length > 0) {
    output.decisionCards = [];
    
    for (const node of activeGraph) {
      // Did the LLM adapt this node's rationale?
      const patch = adaptation.knowledgePatches.find(p => p.targetNodeId === node.id);
      
      const rationale = patch ? patch.reason : node.description;
      const patched = !!patch;
      const evidence = patch ? patch.evidence.facts : [];

      if (node.type === 'Implementation' || node.type === 'Capability' || node.type as any === 'EngineeringOption') {
        
        // Find Decision Record to extract confidence and alternative evidence
        const dr = telemetry.decisionRecords.find(r => r.chosen.id === node.id);
        
        output.stack.push({
          name: node.name,
          category: 'other', // Will be ignored by new UI grouping, but kept for legacy compat
          systemGroup: node.systemGroup,
          capability: node.capability,
          trace: {
            source: 'knowledge_graph',
            patched,
            reason: rationale,
            evidence: dr?.evidence || evidence,
            knowledgeVersion: 'v5.0'
          }
        });

        // Build Decision Card
        output.decisionCards.push({
          recommendation: node.name,
          capability: node.capability,
          systemGroup: node.systemGroup,
          rationale: dr?.rationale || `Selected for ${node.capability?.replace(/_/g, ' ')} based on constraints.`,
          evidence: dr?.evidence || evidence,
          principles: dr?.principles || node.principles || [],
          evidenceStrength: dr?.evidenceStrength || 'Moderate',
          stability: dr?.stability || 'Moderately Stable',
          winsWhen: node.winsWhen || [],
          losesWhen: node.losesWhen || [],
          antiPatterns: node.antiPatterns || [],
          counterExamples: node.counterExamples || [],
          migrationPath: node.migrationPath || [],
          failureModes: node.failureModes || [],
          scaleLimit: node.scaleLimit,
          alternatives: dr?.notChosen.map(alt => ({
            name: alt.name,
            reason: alt.reasonNotChosen,
            capability: node.capability || 'Core',
            lostTo: node.name,
            winsWhen: alt.winsWhen
          })) || [],
          knowledgeVersion: 'v5.0',
          lineage: {
            capability: node.capability || 'Core',
            constraint: dr?.evidence[0] || 'Unknown',
            intent: input.intent || 'Unknown'
          },
          engineeringComplexity: node.engineeringComplexity,
          operationalCost: node.operationalCost
        });
        
      } else if (node.type as any === 'Risk') {
        output.businessRisks.push({
          risk: node.name,
          level: 'High',
          likelihood: 'High',
          reason: rationale,
          trace: {
            source: 'knowledge_graph',
            patched,
            reason: rationale,
            evidence,
            knowledgeVersion: 'v3.0'
          }
        });
      } else if (node.type === 'Constraint') {
        output.domainConstraints.push(`${node.name}: ${rationale}`);
      }
    }
  }

  // Apply Rejected Decisions from Telemetry
  output.rejectedDecisions = [];
  for (const dr of telemetry.decisionRecords) {
    for (const r of dr.notChosen) {
      output.rejectedDecisions.push({
        name: r.name,
        reason: r.reasonNotChosen,
        capability: dr.capability,
        lostTo: dr.chosen.name,
        winsWhen: r.winsWhen || []
      });
    }
  }

  // Apply Pressure Map
  output.pressureMap = telemetry.pressureMap.map(p => ({
    dimension: p.driver,
    pressure: p.pressure,
    influencedDecisions: p.influencedDecisions
  }));

  // Apply LLM Insight Patches
  if (adaptation.insightPatches) {
    for (const patch of adaptation.insightPatches) {
      if (patch.section === 'businessRisks') {
        output.businessRisks.push({
          risk: patch.observation,
          level: 'Medium',
          likelihood: 'Medium',
          reason: patch.reason,
          trace: {
            source: 'llm_insight',
            patched: true,
            reason: patch.reason,
            evidence: patch.evidence.facts,
            knowledgeVersion: 'v3.0'
          }
        });
      } else if (patch.section === 'criticalUnknowns') {
        output.criticalUnknowns.push(patch.observation);
      } else if (patch.section === 'domainConstraints') {
        output.domainConstraints.push(patch.observation);
      } else if (patch.section === 'strategicAdvantages') {
        output.strategicAdvantages.push(patch.observation);
      }
    }
  }

  // Apply Deep Telemetry for Explainability
  output.validationTraces = telemetry.validationTraces || [];
  output.executionTraces = telemetry.executionTraces || [];
  output.suppressedNodes = telemetry.suppressedNodes || [];

  // Generate Deterministic Architecture Diagram
  output.architectureDiagram = generateMermaidDiagram(activeGraph);

  return output;
}

function generateEmptyOutput(): ArchitectureOutput {
  return {
    businessRisks: [],
    coreValidationQuestions: [],
    criticalUnknowns: [],
    strategicAdvantages: [],
    domainConstraints: [],
    architectureStyle: 'Generated Architecture',
    confidenceScores: { architecture: 80, patternSelection: 80, deployment: 80, cost: 80 },
    confidenceBreakdown: { strongSignals: [], weakSignals: [] },
    missingInformation: [],
    assumptions: [],
    assumptionRisk: { level: 'Medium', reason: '' },
    revisitWhen: [],
    upgradePath: [],
    stack: [],
    deployment: [],
    recommended: [],
    deferredDecisions: [],
    architectureDebt: [],
    challenges: [],
    blueprint: [],
    operatingCostDrivers: [],
    decisionCards: [],
    rejectedDecisions: [],
    pressureMap: [],
    validationTraces: [],
    executionTraces: [],
    suppressedNodes: []
  };
}

function generateMermaidDiagram(activeGraph: ImplementationNode[]): string {
  let mermaid = '```mermaid\ngraph TD\n';
  
  // Group nodes by systemGroup
  const groups: Record<string, ImplementationNode[]> = {};
  for (const node of activeGraph) {
    if (node.type !== 'Implementation' && node.type as any !== 'EngineeringOption' && node.type !== 'Capability') continue;
    const groupName = node.systemGroup || 'core';
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(node);
  }

  // Create subgraphs
  for (const [groupName, nodes] of Object.entries(groups)) {
    mermaid += `  subgraph ${groupName}\n`;
    for (const node of nodes) {
      // Create a safe ID
      const safeId = node.id.replace(/[^a-zA-Z0-9]/g, '_');
      mermaid += `    ${safeId}["${node.name}"]\n`;
    }
    mermaid += `  end\n`;
  }

  // Add edges for 'requires' dependencies
  mermaid += `\n`;
  for (const node of activeGraph) {
    if (!node.requires) continue;
    const safeSourceId = node.id.replace(/[^a-zA-Z0-9]/g, '_');
    
    for (const req of node.requires) {
      // Find the target node that satisfies this requirement
      // The requirement could be a capability or a specific node ID
      // We look for a node in activeGraph that either has that ID or provides that capability
      const targetNode = activeGraph.find(n => n.id === req || n.capability === req);
      if (targetNode) {
        const safeTargetId = targetNode.id.replace(/[^a-zA-Z0-9]/g, '_');
        mermaid += `  ${safeSourceId} --> ${safeTargetId}\n`;
      }
    }
  }

  mermaid += '```';
  return mermaid;
}
