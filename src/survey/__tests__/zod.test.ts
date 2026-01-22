import { describe, expect, it } from "vitest";
import { SurveyResponseSchema } from "../zod";

describe("SurveyResponseSchema", () => {
  it("validates a minimal valid response per required fields in first section", () => {
    const data = {
      role: "Architect",
      anonymity_preference: "Anonymous",
      consent_followup: "Yes",
      pain_context_switching: 3,
      pain_tooling_friction: 4,
      pain_cross_agent_handoffs: 5,
      pain_top_three: "A;B;C",
      pain_momentum_drop: "Afternoons",
      impact_auto_structured_tasks: 6,
      impact_adaptive_focus_modes: 6,
      desired_feature_checklist: ["Unified task orchestration across agents"],
      single_10x_feature: "Adaptive focus",
      primary_interaction_modes: ["Command palette / CLI"],
      navigation_preference: "Keyboard-first",
      feedback_style: "Immediate",
      ideal_interaction_flow: "Start, context, help, finish",
      must_integrate_with: ["GitHub"],
      data_sources_outputs: "Repos in, PRs out",
      required_formats: ["JSON"],
      system_constraints: "Must not store code off-prem",
      expected_response_time_ms: 200,
      expected_concurrent_flows: 2,
      required_uptime: "99.9%",
      unacceptable_failure_scenarios: "Submission should never fail",
      dream_state: "No friction",
      automation_vs_manual: "Automate setup; manual approvals",
      data_sensitivity: "Internal",
      security_requirements: ["Encryption in transit (TLS)"],
      security_pitfalls: "No long-lived tokens",
      development_approach: "Rapid prototype → pilot → iterative rollout",
      pilot_participation: "Yes",
      training_preference: "Live",
      rollout_risk_tolerance: "Balanced",
      baseline_task_time_minutes: 30,
      target_task_time_minutes: 10,
      baseline_errors_per_100: 10,
      target_errors_per_100: 2,
      baseline_interruptions_minutes: 60,
      target_interruptions_minutes: 15,
      baseline_context_switches_per_hour: 8,
      target_context_switches_per_hour: 2,
      baseline_throughput_per_week: 20,
      target_throughput_per_week: 50,
      additional_comments: "Ship it",
      consent_anonymous_benchmarking: "Yes",
    };
    const result = SurveyResponseSchema.safeParse(data);
    if (!result.success) {
      const msg = JSON.stringify(result.error.issues, null, 2);
      expect.fail(msg);
    }
    expect(result.success).toBe(true);
  });
});
