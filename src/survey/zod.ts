import { z } from "zod";
import { surveySpec, SurveyField, SurveyFieldNumber, SurveyFieldOptions, SurveySection } from "./spec";

function buildFieldSchema(field: SurveyField) {
  if (field.type === "text") {
    const base = z.string();
    return field.required ? base.min(1).max(1000) : base.max(1000).optional();
  }
  if (field.type === "textarea") {
    const base = z.string();
    return field.required ? base.min(1).max(5000) : base.max(5000).optional();
  }
  if (field.type === "number") {
    const f = field as SurveyFieldNumber;
    let n = z.number();
    if (typeof f.step === "number" && f.step === 1) n = n.int();
    if (typeof f.min === "number") n = n.min(f.min);
    if (typeof f.max === "number") n = n.max(f.max);
    return field.required ? n : n.optional();
  }
  if (field.type === "select") {
    const f = field as SurveyFieldOptions;
    const schema = z.string().refine((val) => f.options.includes(val), "Invalid option");
    return field.required ? schema : schema.optional();
  }
  if (field.type === "multiselect" || field.type === "checkbox_group") {
    const f = field as SurveyFieldOptions;
    const item = z.string().refine((val) => f.options.includes(val) || Boolean(f.allowOtherText), "Invalid option");
    const arr = z.array(item);
    const base = field.required ? arr.min(1) : arr.optional();
    return base;
  }
  return z.any().optional();
}

export function buildResponseSchema() {
  const shape: Record<string, z.ZodTypeAny> = {};
  surveySpec.sections.forEach((section: SurveySection) => {
    section.fields.forEach((field) => {
      shape[field.id] = buildFieldSchema(field);
      if ((field as SurveyFieldOptions).allowOtherText) {
        shape[`${field.id}_other`] = z.string().max(1000).optional();
      }
    });
  });
  return z.object(shape);
}

export const SurveyResponseSchema = buildResponseSchema();
export type SurveyResponse = z.infer<typeof SurveyResponseSchema>;
