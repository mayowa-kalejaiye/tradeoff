import { ArchitectureInput, EngineResponse } from '../types';

export function handleGIS(input: ArchitectureInput): EngineResponse | null {
  // If the user's priority is exclusively cost but they are building GIS, we need to push back.
  if (input.priority === 'cost' && input.teamSize < 3) {
    return {
      status: 'uncertainty',
      reason: 'Self-hosting a tile server and maintaining global geospatial datasets (OpenStreetMap) is a massive operational burden. Relying on Google Maps or Mapbox APIs is expensive at scale but necessary for small teams.',
      questions: [
        'Will you pay for a managed maps provider (Mapbox/Google Maps) or self-host your tile servers?',
        'Do you require turn-by-turn navigation or just spatial indexing and distance calculations?',
        'Are you handling real-time GPS streams that require frequent database updates?'
      ]
    };
  }

  return {
    status: 'success',
    data: {
      businessRisks: [
        {
          risk: 'Map Provider Lock-In and Bill Shock',
          level: 'High',
          likelihood: 'High',
          reason: 'Google Maps and Mapbox APIs scale linearly with usage. A sudden spike in traffic can bankrupt a startup if tile caching is not implemented.'
        },
        {
          risk: 'Stale Geospatial Data',
          level: 'High',
          likelihood: 'Medium',
          reason: 'If routing depends on outdated maps, users will be directed into closed roads or traffic jams, destroying trust instantly.'
        }
      ],
      domainConstraints: [
        'Spatial Indexing (R-trees / Geohashing)',
        'Coordinate system consistency (WGS84)',
        'Reverse Geocoding',
        'Tile caching and vector tile rendering'
      ],
      coreValidationQuestions: [
        'How frequently are we updating the location of moving assets (e.g. 1Hz)?',
        'Are we strictly bounding box querying, or doing complex polygon intersections?'
      ],
      criticalUnknowns: [
        'The ratio of reads (rendering maps) to writes (updating live locations).',
        'Whether offline map support is a hard requirement.'
      ],
      strategicAdvantages: [
        'Building a proprietary geospatial dataset creates an immense operational moat.'
      ],
      architectureStyle: 'Geospatial Indexing & Tile Serving',
      confidenceScores: { architecture: 95, patternSelection: 95, deployment: 80, cost: 40 },
      confidenceBreakdown: { strongSignals: ['GIS / Mapping Archetype'], weakSignals: [] },
      missingInformation: [],
      assumptions: ['Assuming usage of PostGIS for primary spatial queries.'],
      assumptionRisk: { level: 'Medium', reason: 'PostGIS handles complex polygons well but may bottleneck on millions of high-frequency GPS writes.' },
      revisitWhen: ['GPS write volume exceeds standard PostgreSQL insert capacity'],
      upgradePath: [
        { stage: 'Stage 1', description: 'Mapbox API + PostGIS', trigger: 'MVP' },
        { stage: 'Stage 2', description: 'Self-hosted OpenStreetMap Tile Servers', trigger: 'Mapbox API bills exceed $10k/mo' }
      ],
      stack: [
        { name: 'PostgreSQL (PostGIS)', category: 'database' },
        { name: 'Redis (Geospatial Indexes)', category: 'cache' },
        { name: 'Next.js', category: 'frontend' },
        { name: 'Go / Node.js', category: 'backend' }
      ],
      deployment: ['AWS RDS (PostgreSQL)'],
      recommended: [{ name: 'Redis for High-Frequency GPS Updates', reasons: ['Do not write 1Hz live GPS updates directly to PostgreSQL. Buffer them in Redis and batch write to PostGIS.'] }],
      deferredDecisions: [{ name: 'Self-Hosted Routing Engine (OSRM)', reason: 'Routing is exceptionally difficult. Use Mapbox Navigation API until costs force you to self-host.' }],
      architectureDebt: [{ debt: 'Vendor lock-in to Mapbox/Google Maps', reason: 'Unavoidable for MVP speed.' }],
      challenges: [],
      blueprint: [
        { category: 'Database', packages: ['pg', 'postgis'] }
      ],
      operatingCostDrivers: ['Map API Requests (Tiles, Routing, Geocoding)', 'Database CPU for spatial queries']
    }
  };
}
