import { ArchitectureInput, ArchitectureOutput } from '../types';

export function enhanceEnterprise(input: ArchitectureInput, output: ArchitectureOutput): ArchitectureOutput {
  if (!input.projectIdea || !input.projectIdea.toLowerCase().match(/(epic|cerner|hl7|fhir|sso|saml|enterprise integration)/)) {
    return output;
  }

  output.domainConstraints.push(
    'SAML / SSO (Okta, Entra ID) Requirements',
    'HL7 / FHIR Integration compliance and testing'
  );

  output.businessRisks.push({
    risk: 'Enterprise Procurement Death Cycle',
    level: 'Critical',
    likelihood: 'High',
    reason: 'Integrating with Epic/Cerner requires hospital IT approval, which takes 9-18 months. You will run out of runway before closing a single deal if you do not account for this.'
  });

  output.stack.push({ name: 'Redox / Mirth Connect (EHR Integration)', category: 'other' });

  return output;
}
