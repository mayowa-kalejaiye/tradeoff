import { ArchitectureInput, EngineResponse } from '../types';
import { extractOutputsOrPushback, mergeArchitectureOutputs } from '../utils/compose';
import { handleGIS } from './gis';
import { handleMessaging } from './messaging';

export function handleRideHailing(input: ArchitectureInput): EngineResponse | null {
  // Pushback specific to Ride Hailing
  if (input.technicalExperience === 'vibe_coder') {
    return {
      status: 'uncertainty',
      reason: 'Ride Hailing is one of the most complex software architectures possible. It requires real-time bipartite matching, geo-spatial queries, surge pricing algorithms, and strict payment reconciliation.',
      questions: [
        'How do you plan to handle live driver tracking and dispatch optimization?',
        'What is your ETA prediction strategy (e.g. Mapbox API vs custom ML)?',
        'How will you handle state machines for rides (Requested -> Driver Accepted -> Picked Up -> Completed)?'
      ]
    };
  }

  // Compose the foundational domains
  const gisOutput = handleGIS(input);
  const messagingOutput = handleMessaging(input);

  const { pushback, outputs } = extractOutputsOrPushback([gisOutput, messagingOutput]);
  
  if (pushback) {
    return pushback;
  }

  // Merge the foundational domains
  const merged = mergeArchitectureOutputs(outputs);

  // Overlay Ride Hailing specifics
  merged.businessRisks.push({
    risk: 'Marketplace Liquidity & Driver Churn',
    level: 'Critical',
    likelihood: 'High',
    reason: 'If the dispatch algorithm is inefficient or ETAs are wrong, drivers will earn less and churn. A ride-hailing app without drivers is a dead app.'
  });

  merged.domainConstraints.push(
    'Bipartite matching algorithm (Rider <-> Driver)',
    'Dynamic surge pricing',
    'Payment holds and reconciliation',
    'Complex state machines (Ride Status)'
  );

  merged.coreValidationQuestions.push(
    'Does the dispatch algorithm account for driver direction, not just raw distance?',
    'How do we handle fraudulent riders or stolen credit cards?'
  );

  merged.criticalUnknowns.push('The ratio of supply (drivers) to demand (riders) at peak hours.');

  merged.strategicAdvantages.push('Local network effects create near-monopolies in specific cities.');

  merged.architectureStyle = 'Real-Time Geospatial Marketplace';
  merged.confidenceScores.architecture = 95; // override

  merged.stack.push(
    { name: 'Go / Java (Dispatch Engine)', category: 'backend' },
    { name: 'Stripe / Adyen', category: 'other' } // Payments
  );

  merged.recommended.push({
    name: 'Simple Nearest-Driver Matching',
    reasons: ['Do not build complex ML dispatch algorithms for V1. A simple radius query with a greedy algorithm is enough to launch.']
  });

  merged.architectureDebt.push({
    debt: 'Static pricing or simplistic surge',
    reason: 'True surge pricing requires forecasting demand. Start with simple multipliers based on active concurrent requests.'
  });

  return {
    status: 'success',
    data: merged
  };
}
