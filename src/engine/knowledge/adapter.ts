import { DecisionGraph, ReasoningGraph, ImplementationNode, ReasoningNode, DecisionEdge, FailureMode } from './graph';

export function adaptV3toV5(v3Graph: DecisionGraph): ReasoningGraph {
  const nodes = new Map<string, ReasoningNode>();
  const edges: DecisionEdge[] = [...v3Graph.edges];

  // Convert all V3 DecisionNodes into V5 ImplementationNodes
  v3Graph.nodes.forEach((node) => {
    const capName = (node as any).capability || node.name;

    let failureModes = (node as any).failureModes;
    if (!failureModes || failureModes.length === 0) {
      failureModes = [{
        context: 'Legacy migrated system',
        symptoms: 'Latency spikes or resource exhaustion',
        detection: 'CloudWatch / Datadog alerts',
        mitigation: 'Scale horizontally or shard',
        recovery: 'Introduce circuit breakers or backpressure'
      }];
    }

    const implementation: ImplementationNode = {
      id: node.id,
      type: 'Implementation',
      name: node.name,
      description: node.description,
      systemGroup: node.systemGroup,
      capability: capName,
      
      engineeringComplexity: (node as any).engineeringComplexity || 'Medium',
      operationalCost: (node as any).operationalCost || 'Medium',
      
      winsWhen: (node as any).winsWhen || node.gains || ['Standard use case'],
      losesWhen: (node as any).losesWhen || node.costs || ['Extreme scale'],
      antiPatterns: (node as any).antiPatterns || ['Over-engineering before product-market fit'],
      counterExamples: (node as any).counterExamples || [],
      migrationPath: (node as any).migrationPath || ['Enterprise solution'],
      failureModes: failureModes,
      scaleLimit: (node as any).scaleLimit,
      
      changesWhen: node.invalidWhen || ['Scale exceeds limits'],
      principles: (node as any).principles || [], 
      
      drivers: node.drivers,
      score: node.score,
    };

    nodes.set(node.id, implementation);
  });

  return { nodes, edges };
}
