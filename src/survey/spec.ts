export interface SurveyMetaAccessibility {
  singleColumn: boolean;
  wcagLevel: string;
  keyboardNavigation: boolean;
  screenReaderFriendly: boolean;
}

export interface SurveyMeta {
  title: string;
  description: string;
  estimatedMinutes: number;
  anonymitySupported: boolean;
  accessibility: SurveyMetaAccessibility;
}

export interface FieldVisibilityRule {
  dependsOn: string;
  equals: string;
}

export interface SurveyFieldBase {
  id: string;
  type: "select" | "multiselect" | "checkbox_group" | "text" | "textarea" | "number";
  label: string;
  required: boolean;
  helpText?: string;
  visibility?: FieldVisibilityRule;
}

export interface SurveyFieldOptions extends SurveyFieldBase {
  options: string[];
  allowOtherText?: boolean;
}

export interface SurveyFieldNumber extends SurveyFieldBase {
  min?: number;
  max?: number;
  step?: number;
}

export type SurveyField = SurveyFieldBase | SurveyFieldOptions | SurveyFieldNumber;

export interface SurveySection {
  id: string;
  title: string;
  description: string;
  fields: SurveyField[];
}

export interface SurveySpec {
  id: string;
  version: string;
  meta: SurveyMeta;
  sections: SurveySection[];
}

export const surveySpec: SurveySpec = {
  id: "hyper-tool-requirements-survey",
  version: "1.0.0",
  meta: {
    title: "Hyper Tool Requirements Survey",
    description: "Help design a hyper tool that can 10X Hyper Agents’ capabilities.",
    estimatedMinutes: 10,
    anonymitySupported: true,
    accessibility: {
      singleColumn: true,
      wcagLevel: "2.1 AA",
      keyboardNavigation: true,
      screenReaderFriendly: true,
    },
  },
  sections: [
    {
      id: "identity_scope",
      title: "Identity & Scope",
      description: "Tell us a bit about your role and how you’d like your feedback handled.",
      fields: [
        {
          id: "role",
          type: "select",
          label: "Role / Agent Specialization",
          required: true,
          options: ["Architect", "Code", "Research", "Experiment", "UX / Flow", "Narrator", "Other"],
          helpText: "Pick the option that best describes your primary agent role.",
        } as SurveyFieldOptions,
        {
          id: "team_domain",
          type: "text",
          label: "Team or domain",
          required: false,
          helpText: "Optional. Example: “Hyperfocus Zone”, “Infra/DevOps”, “Docs & Narrative”.",
        },
        {
          id: "anonymity_preference",
          type: "select",
          label: "Anonymity preference",
          required: true,
          options: ["Anonymous", "Identifiable"],
          helpText: "Choose whether your responses can be linked back to you by the core team.",
        } as SurveyFieldOptions,
        {
          id: "identifier",
          type: "text",
          label: "Name or handle",
          required: false,
          helpText: "Optional. Only used for follow-up if you consent.",
          visibility: { dependsOn: "anonymity_preference", equals: "Identifiable" },
        },
        {
          id: "consent_followup",
          type: "select",
          label: "Consent to follow-up",
          required: true,
          options: ["Yes", "No"],
          helpText: "Can the core team contact you with follow-up questions or pilot invites?",
        } as SurveyFieldOptions,
      ],
    },
    {
      id: "current_workflow_pain_points",
      title: "Current Workflow Pain Points",
      description: "Where does your current workflow hurt the most?",
      fields: [
        { id: "pain_context_switching", type: "number", label: "Severity of context switching in your work (1–7)", required: true, min: 1, max: 7, step: 1, helpText: "1 = Not a problem, 7 = Extremely painful." } as SurveyFieldNumber,
        { id: "pain_tooling_friction", type: "number", label: "Friction in tooling setup and environment management (1–7)", required: true, min: 1, max: 7, step: 1, helpText: "1 = Very low friction, 7 = Extremely high friction." } as SurveyFieldNumber,
        { id: "pain_cross_agent_handoffs", type: "number", label: "Difficulty of cross-agent coordination and handoffs (1–7)", required: true, min: 1, max: 7, step: 1, helpText: "1 = Very easy, 7 = Extremely difficult." } as SurveyFieldNumber,
        { id: "pain_top_three", type: "textarea", label: "Top 3 pain points that slow you down or break flow", required: true, helpText: "Concrete examples are very helpful." },
        { id: "pain_momentum_drop", type: "textarea", label: "When does your momentum drop, and why?", required: true, helpText: "Describe moments in your day or workflow where you lose momentum." },
      ],
    },
    {
      id: "desired_features",
      title: "Desired Features for Efficiency",
      description: "What would actually make a meaningful difference to your effectiveness?",
      fields: [
        { id: "impact_auto_structured_tasks", type: "number", label: "Impact if the tool auto-structures tasks and todos (1–7)", required: true, min: 1, max: 7, step: 1 } as SurveyFieldNumber,
        { id: "impact_adaptive_focus_modes", type: "number", label: "Impact if the tool provides adaptive focus / Zen modes (1–7)", required: true, min: 1, max: 7, step: 1 } as SurveyFieldNumber,
        { id: "desired_feature_checklist", type: "checkbox_group", label: "Which features would you want most?", required: true, options: ["Unified task orchestration across agents", "Context-aware suggestions and code scaffolding", "One-click environment validation and fixes", "Visual flow mapping and versioning", "Accessible UI with keyboard-first workflows", "Built-in testing, performance budgets, and CI hooks", "Low-latency collaboration with role-aware permissions", "Other"], allowOtherText: true, helpText: "Select all that would significantly improve your workflow." } as SurveyFieldOptions,
        { id: "single_10x_feature", type: "textarea", label: "What single feature would 10X your effectiveness?", required: true },
      ],
    },
    {
      id: "interface_interactions",
      title: "Preferred Interface & Interactions",
      description: "How you’d like to work with the tool day-to-day.",
      fields: [
        { id: "primary_interaction_modes", type: "multiselect", label: "Primary interaction modes", required: true, options: ["Node-based visual canvas", "Command palette / CLI", "Chat / assistant", "Form-driven workflow", "API-first", "Other"], allowOtherText: true } as SurveyFieldOptions,
        { id: "navigation_preference", type: "select", label: "Navigation preference", required: true, options: ["Keyboard-first", "Mixed", "Mouse-first / touch-first"] } as SurveyFieldOptions,
        { id: "feedback_style", type: "select", label: "Feedback style", required: true, options: ["Immediate", "Batched", "Quiet"], helpText: "Immediate = frequent small signals; Batched = summaries; Quiet = minimal prompts." } as SurveyFieldOptions,
        { id: "ideal_interaction_flow", type: "textarea", label: "Describe your ideal interaction flow in 3–5 steps", required: true },
      ],
    },
    {
      id: "integrations",
      title: "Integration Requirements",
      description: "Where this tool needs to plug into your existing ecosystem.",
      fields: [
        { id: "must_integrate_with", type: "multiselect", label: "Must integrate with", required: true, options: ["GitHub", "Slack", "Supabase / Prisma", "Next.js pipelines", "Notion", "Jira", "Playwright CI", "Vitest / Lighthouse CI", "Other"], allowOtherText: true } as SurveyFieldOptions,
        { id: "data_sources_outputs", type: "textarea", label: "Data sources and outputs needed", required: true, helpText: "What inputs should the tool consume, and what outputs should it produce?" },
        { id: "required_formats", type: "checkbox_group", label: "Required import / export formats", required: true, options: ["JSON", "YAML", "Markdown", "Graph schema", "Other"], allowOtherText: true } as SurveyFieldOptions,
        { id: "system_constraints", type: "textarea", label: "Existing system constraints the tool must respect", required: true },
      ],
    },
    {
      id: "performance_scalability",
      title: "Performance & Scalability",
      description: "Expectations around responsiveness and reliability.",
      fields: [
        { id: "expected_response_time_ms", type: "number", label: "Expected response time for critical actions (ms)", required: true, min: 0, step: 1, helpText: "Example: 200 for 0.2 seconds." } as SurveyFieldNumber,
        { id: "expected_concurrent_flows", type: "number", label: "Concurrent sessions or flows expected", required: true, min: 0, step: 1 } as SurveyFieldNumber,
        { id: "required_uptime", type: "select", label: "Required uptime target", required: true, options: ["99.0%", "99.5%", "99.9%", "Other"], allowOtherText: true } as SurveyFieldOptions,
        { id: "unacceptable_failure_scenarios", type: "textarea", label: "Performance scenarios where failure is unacceptable", required: true },
      ],
    },
    {
      id: "ideal_functionality",
      title: "Ideal Functionality",
      description: "Describe the dream state and boundaries of automation.",
      fields: [
        { id: "dream_state", type: "textarea", label: "Describe “the dream state” where the tool removes friction entirely", required: true },
        { id: "automation_vs_manual", type: "textarea", label: "What should the tool automate vs. what should remain manual?", required: true },
      ],
    },
    {
      id: "metrics",
      title: "10X Metrics (Baseline & Targets)",
      description: "Baseline vs. target metrics for 10X improvements.",
      fields: [
        { id: "baseline_task_time_minutes", type: "number", label: "Current average time to complete a standard task (minutes)", required: true, min: 0, step: 1 } as SurveyFieldNumber,
        { id: "target_task_time_minutes", type: "number", label: "Target average time with the tool (minutes)", required: true, min: 0, step: 1 } as SurveyFieldNumber,
        { id: "baseline_errors_per_100", type: "number", label: "Current errors per 100 tasks", required: true, min: 0, step: 1 } as SurveyFieldNumber,
        { id: "target_errors_per_100", type: "number", label: "Target errors per 100 tasks", required: true, min: 0, step: 1 } as SurveyFieldNumber,
        { id: "baseline_interruptions_minutes", type: "number", label: "Current interruptions/recovery time per day (minutes)", required: true, min: 0, step: 1 } as SurveyFieldNumber,
        { id: "target_interruptions_minutes", type: "number", label: "Target interruptions/recovery time per day (minutes)", required: true, min: 0, step: 1 } as SurveyFieldNumber,
        { id: "baseline_context_switches_per_hour", type: "number", label: "Current context switches per hour", required: true, min: 0, step: 1 } as SurveyFieldNumber,
        { id: "target_context_switches_per_hour", type: "number", label: "Target context switches per hour", required: true, min: 0, step: 1 } as SurveyFieldNumber,
        { id: "baseline_throughput_per_week", type: "number", label: "Current weekly throughput (tasks/week)", required: true, min: 0, step: 1 } as SurveyFieldNumber,
        { id: "target_throughput_per_week", type: "number", label: "Target weekly throughput (tasks/week)", required: true, min: 0, step: 1 } as SurveyFieldNumber,
        { id: "additional_metrics", type: "textarea", label: "Additional metrics meaningful for your role", required: false },
      ],
    },
    {
      id: "security_compliance",
      title: "Security & Compliance",
      description: "Constraints and expectations around data protection.",
      fields: [
        { id: "data_sensitivity", type: "select", label: "Data sensitivity level", required: true, options: ["Public", "Internal", "Confidential", "Restricted"] } as SurveyFieldOptions,
        { id: "security_requirements", type: "checkbox_group", label: "Security requirements", required: true, options: ["Encryption in transit (TLS)", "Encryption at rest", "Role-based access control (RBAC)", "Audit trail of actions and changes", "Secrets management via environment variables / vault", "Client-side bundle privacy constraints", "Dependency vulnerability scanning"] } as SurveyFieldOptions,
        { id: "compliance_frameworks", type: "multiselect", label: "Compliance frameworks", required: false, options: ["SOC 2", "ISO 27001", "GDPR", "HIPAA", "Other", "None / not applicable"], allowOtherText: true } as SurveyFieldOptions,
        { id: "security_pitfalls", type: "textarea", label: "Security pitfalls to avoid", required: true },
      ],
    },
    {
      id: "timeline_rollout",
      title: "Preferred Timeline & Rollout Strategy",
      description: "How we should build and introduce this tool.",
      fields: [
        { id: "development_approach", type: "select", label: "Preferred development approach", required: true, options: ["Rapid prototype → pilot → iterative rollout", "Phased feature releases", "Big-bang release"] } as SurveyFieldOptions,
        { id: "pilot_participation", type: "select", label: "Participation in pilot", required: true, options: ["Yes", "Maybe", "No"] } as SurveyFieldOptions,
        { id: "training_preference", type: "select", label: "Training preference", required: true, options: ["Live", "Recorded", "Self-serve docs", "Pair sessions"] } as SurveyFieldOptions,
        { id: "rollout_risk_tolerance", type: "select", label: "Rollout risk tolerance", required: true, options: ["Conservative", "Balanced", "Aggressive"] } as SurveyFieldOptions,
        { id: "timeline_expectations", type: "textarea", label: "Ideal timeline or milestone expectations", required: false },
      ],
    },
    {
      id: "final_feedback",
      title: "Final Feedback",
      description: "Anything else before we wrap?",
      fields: [
        { id: "additional_comments", type: "textarea", label: "Anything else we should know?", required: true },
        { id: "consent_anonymous_benchmarking", type: "select", label: "Consent to anonymous benchmarking", required: true, options: ["Yes", "No"] } as SurveyFieldOptions,
        { id: "followup_contact", type: "text", label: "Contact for follow-up (optional)", required: false, helpText: "If you prefer a specific channel or handle." },
      ],
    },
  ],
};

