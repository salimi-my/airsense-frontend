"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Brain, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { RiskCard } from "@/components/airsense/airsense-cards";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HEALTH_PROFILE_STORAGE_KEY } from "@/constants/airsense";
import { API_ENDPOINTS } from "@/constants/routes";
import { useAutoNearestStation } from "@/hooks/use-auto-nearest-station";
import { useUser } from "@/hooks/use-user";
import { useStations } from "@/hooks/use-stations";
import axios from "@/lib/axios";
import {
  assessmentSchema,
  type AssessmentSchema,
} from "@/schemas/assessment";
import type { AssessmentResult } from "@/types/airsense";

const CONDITION_OPTIONS = [
  { value: "none", label: "None" },
  { value: "asthma", label: "Asthma" },
  { value: "heart_disease", label: "Heart Disease" },
  { value: "respiratory", label: "Respiratory Illness" },
  { value: "diabetes", label: "Diabetes" },
] as const;

export function RiskAssessmentForm() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { stations, isLoading: stationsLoading } = useStations();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const stationParam = searchParams.get("station");
  const [geoFinished, setGeoFinished] = useState(Boolean(stationParam));

  const form = useForm<AssessmentSchema>({
    resolver: standardSchemaResolver(assessmentSchema),
    defaultValues: {
      station_id: Number(stationParam) || 0,
      age_group: "adult",
      conditions: ["none"],
      activity: "light_outdoor",
      remember_profile: false,
    },
  });

  const { isResolving, geoStatus } = useAutoNearestStation({
    auto: !stationParam,
    skipSave: true,
    requireUser: false,
    ignorePreferredStation: true,
    rememberSessionAttempt: false,
    onResolved: (resolved) => {
      if (resolved.stationId) {
        form.setValue("station_id", resolved.stationId, { shouldValidate: true });
      }
    },
    onSettled: () => setGeoFinished(true),
  });

  const isDetectingStation =
    !stationParam &&
    (geoStatus === "loading" || isResolving || !geoFinished);

  useEffect(() => {
    const stored = localStorage.getItem(HEALTH_PROFILE_STORAGE_KEY);
    if (stored) {
      try {
        const profile = JSON.parse(stored) as Partial<AssessmentSchema>;
        form.reset({ ...form.getValues(), ...profile, remember_profile: true });
      } catch {
        localStorage.removeItem(HEALTH_PROFILE_STORAGE_KEY);
      }
    }
  }, [form]);

  useEffect(() => {
    if (stationParam) {
      form.setValue("station_id", Number(stationParam));
    }
  }, [stationParam, form]);

  useEffect(() => {
    if (stationParam || !geoFinished) return;
    if (form.getValues("station_id")) return;
    if (user?.preferred_station_id) {
      form.setValue("station_id", user.preferred_station_id);
    }
  }, [stationParam, geoFinished, user?.preferred_station_id, form]);

  async function onSubmit(values: AssessmentSchema) {
    setSubmitting(true);
    setResult(null);

    try {
      const { remember_profile, ...payload } = values;

      if (remember_profile) {
        localStorage.setItem(
          HEALTH_PROFILE_STORAGE_KEY,
          JSON.stringify({
            age_group: payload.age_group,
            conditions: payload.conditions,
            activity: payload.activity,
          }),
        );
      } else {
        localStorage.removeItem(HEALTH_PROFILE_STORAGE_KEY);
      }

      const response = await axios.post(API_ENDPOINTS.ASSESSMENTS, payload);
      setResult(response.data.data.assessment);
      toast.success(response.data.message);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Assessment failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  function clearProfile() {
    localStorage.removeItem(HEALTH_PROFILE_STORAGE_KEY);
    form.reset({
      station_id: form.getValues("station_id"),
      age_group: "adult",
      conditions: ["none"],
      activity: "light_outdoor",
      remember_profile: false,
    });
    toast.success("Saved profile cleared");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
      <div className="airsense-surface flex flex-col rounded-2xl p-6 md:p-8">
        <h2 className="mb-6 text-lg font-semibold">Your Health Profile</h2>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="station_id"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Monitoring Station</FieldLabel>
                    <Select
                      value={field.value ? String(field.value) : undefined}
                      onValueChange={(v) => field.onChange(Number(v))}
                      disabled={stationsLoading || isDetectingStation}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isDetectingStation
                              ? "Detecting nearest station…"
                              : "Select station"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((station) => (
                          <SelectItem key={station.id} value={String(station.id)}>
                            {station.name} (AQI {station.latest_reading?.aqi ?? "—"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="age_group"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Age Group</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="child">Child (&lt; 12)</SelectItem>
                        <SelectItem value="teen">Teen (12–17)</SelectItem>
                        <SelectItem value="adult">Adult (18–59)</SelectItem>
                        <SelectItem value="elderly">Elderly (60+)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="conditions"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Pre-existing Conditions</FieldLabel>
                    <div className="space-y-2">
                      {CONDITION_OPTIONS.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked) => {
                              if (option.value === "none") {
                                field.onChange(checked ? ["none"] : []);
                                return;
                              }
                              const next = (field.value ?? []).filter(
                                (v) => v !== "none",
                              );
                              if (checked) {
                                field.onChange([...next, option.value]);
                              } else {
                                field.onChange(
                                  next.filter((v) => v !== option.value),
                                );
                              }
                            }}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="activity"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Planned Activity</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indoor">Indoor Rest</SelectItem>
                        <SelectItem value="light_outdoor">Light Outdoor Walk</SelectItem>
                        <SelectItem value="moderate_exercise">Moderate Exercise</SelectItem>
                        <SelectItem value="strenuous_exercise">Strenuous Exercise</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="remember_profile"
                render={({ field }) => (
                  <Field>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      Remember my profile
                    </label>
                  </Field>
                )}
              />

              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="submit" disabled={submitting} size="lg">
                  {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Assess My Risk
                </Button>
                <Button type="button" variant="outline" onClick={clearProfile}>
                  Clear saved profile
                </Button>
              </div>
            </FieldGroup>
          </form>
      </div>

      <div className="flex min-h-0 flex-col">
        {result ? (
          <RiskCard assessment={result} className="flex-1" />
        ) : (
          <div className="airsense-surface text-muted-foreground flex flex-1 flex-col items-center justify-center rounded-2xl p-8 text-center text-sm">
            <Brain className="text-primary mb-4 size-10 opacity-40" />
            <p className="max-w-xs leading-relaxed">
              Complete the form and submit to receive an AI-powered risk level,
              health advice, and precaution checklist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
