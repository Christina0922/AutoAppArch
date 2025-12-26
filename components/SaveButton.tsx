"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { SavedPlan, Session } from "@/lib/types";
import { savePlan, saveSession } from "@/lib/storage";

interface SaveButtonProps {
  plan?: SavedPlan;
  session?: Session;
  onSaved?: () => void;
}

export default function SaveButton({ plan, session, onSaved }: SaveButtonProps) {
  const t = useTranslations("saveButton");
  const locale = useLocale();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = () => {
    setIsSaving(true);
    try {
      if (session) {
        saveSession(session);
      } else if (plan) {
        savePlan(plan);
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
      router.push(`/${locale}/history/${id}`);
    }
  };

  const handleCreateNew = () => {
    router.push(`/${locale}/app`);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (saved) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
          <p className="text-base font-medium text-gray-900 mb-1">
            {t("savedMessage")}
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleViewSaved}
            className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            aria-label={t("viewSavedAria")}
          >
            {t("viewSaved")}
          </button>
          <button
            onClick={handleCreateNew}
            className="w-full h-12 bg-white text-gray-900 text-base font-medium rounded-md border border-gray-200 hover:bg-gray-50 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            aria-label={t("createNewAria")}
          >
            {t("createNew")}
          </button>
        </div>
        <p className="text-sm text-gray-400 text-center leading-relaxed">
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
