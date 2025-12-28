"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { SavedPlan, Session } from "@/lib/types";
import { savePlan, saveSession } from "@/lib/storage";
import { getLocaleFromPathname, withLocalePrefix, type Locale } from "@/utils/localePath";
import { getRouteLocale } from "@/utils/getRouteLocale";

interface SaveButtonProps {
  plan?: SavedPlan;
  session?: Session;
  onSaved?: () => void;
}

export default function SaveButton({ plan, session, onSaved }: SaveButtonProps) {
  const t = useTranslations("saveButton");
  const pathname = usePathname() || "/";
  const locale = getRouteLocale(pathname);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = () => {
    setIsSaving(true);
    try {
      if (session) {
        saveSession(session, locale);
      } else if (plan) {
        savePlan(plan, locale);
      } else {
        throw new Error(t("errorNoPlanOrSession"));
      }
      setSaved(true);
      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error(t("errorSaveFailed"), error);
      alert(t("errorSaveFailed"));
      setIsSaving(false);
    }
  };

  const handleViewSaved = () => {
    const id = session?.id || plan?.id;
    if (id) {
      const historyPath = withLocalePrefix(`/history/${id}`, locale as Locale, pathname);
      console.log("[SaveButton] Navigating to history:", historyPath, "id:", id);
      router.push(historyPath);
    } else {
      console.error("[SaveButton] No id found for session or plan:", { session, plan });
    }
  };

  const handleCreateNew = () => {
    router.push(withLocalePrefix("/app", locale as Locale, pathname));
  };

  if (saved) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-center">
          <p className="text-base font-medium text-blue-900 mb-1">
            {t("savedMessage")}
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleViewSaved}
            className="w-full h-12 bg-blue-600 text-white text-base font-semibold rounded-md hover:bg-blue-700 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 shadow-sm"
            aria-label={t("viewSavedAria")}
          >
            {t("viewSaved")}
          </button>
          <button
            onClick={handleCreateNew}
            className="w-full h-12 bg-white text-gray-700 text-base font-medium rounded-md border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label={t("createNewAria")}
          >
            {t("createNew")}
          </button>
        </div>
        <p className="text-sm text-gray-500 text-center leading-relaxed">
          {t("savedNote")}
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={handleSave}
      disabled={isSaving}
      className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      aria-label={isSaving ? t("savingAria") : t("saveAria")}
    >
      {isSaving ? t("saving") : t("save")}
    </button>
  );
}
