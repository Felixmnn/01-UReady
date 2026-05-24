import type { TFunction } from "i18next";
import deTranslation from "@/assets/languages/locales/de/translation.json";
import enTranslation from "@/assets/languages/locales/en/translation.json";
import esTranslation from "@/assets/languages/locales/es/translation.json";
import fraTranslation from "@/assets/languages/locales/fra/translation.json";

type TranslationTree = Record<string, any>;

type SessionTemplate = {
  title: string;
  description: string;
};

const translations: TranslationTree[] = [
  deTranslation as TranslationTree,
  enTranslation as TranslationTree,
  esTranslation as TranslationTree,
  fraTranslation as TranslationTree,
];

const LEGACY_SESSION_TITLES = [
  ["Session 1", "Thema 1"],
  ["Session 2", "Thema 2"],
];

function getNestedStringValue(
  source: TranslationTree,
  path: string
): string | null {
  const value = path.split(".").reduce<any>((current, key) => current?.[key], source);
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function uniqueValues(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => !!value?.trim()))];
}

function getLocalizedValues(path: string): string[] {
  return uniqueValues(translations.map((translation) => getNestedStringValue(translation, path)));
}

export function getMissingAreaDefaults(t: TFunction) {
  return {
    moduleName: t("missingArea.defaults.moduleName"),
    moduleDescription: t("missingArea.defaults.moduleDescription"),
    rewardPrompt: t("missingArea.discoverPrompt"),
    rewardCta: t("missingArea.discoverCta"),
    badgeLabel: t("missingArea.badgeLabel"),
    rewardToastTitle: t("missingArea.rewardToastTitle"),
    checklistTitle: t("missingArea.checklist.title"),
    checklist: {
      name: t("missingArea.checklist.name"),
      description: t("missingArea.checklist.description"),
      sessions: t("missingArea.checklist.sessions"),
      questions: t("missingArea.checklist.questions"),
    },
    sessions: [
      {
        title: t("missingArea.defaults.session1.title"),
        description: t("missingArea.defaults.session1.description"),
      },
      {
        title: t("missingArea.defaults.session2.title"),
        description: t("missingArea.defaults.session2.description"),
      },
    ] as SessionTemplate[],
  };
}

export const missingAreaPlaceholderValues = {
  moduleNames: uniqueValues(getLocalizedValues("missingArea.defaults.moduleName")),
  moduleDescriptions: uniqueValues([
    ...getLocalizedValues("missingArea.defaults.moduleDescription"),
    ...getLocalizedValues("deleteModule.moduleDescription"),
  ]),
  sessionTemplates: [0, 1].map((index) => ({
    titles: uniqueValues([
      ...getLocalizedValues(`missingArea.defaults.session${index + 1}.title`),
      ...LEGACY_SESSION_TITLES[index],
    ]),
    descriptions: uniqueValues(
      getLocalizedValues(`missingArea.defaults.session${index + 1}.description`)
    ),
  })),
};

export function localizeMissingAreaModuleName(value: string, t: TFunction): string {
  return missingAreaPlaceholderValues.moduleNames.includes(value.trim())
    ? t("missingArea.defaults.moduleName")
    : value;
}

export function localizeMissingAreaModuleDescription(value: string, t: TFunction): string {
  return missingAreaPlaceholderValues.moduleDescriptions.includes(value.trim())
    ? t("missingArea.defaults.moduleDescription")
    : value;
}

export function localizeMissingAreaSessionTitle(
  value: string,
  sessionIndex: number,
  t: TFunction
): string {
  const template = missingAreaPlaceholderValues.sessionTemplates[sessionIndex];
  if (!template) return value;

  return template.titles.includes(value.trim())
    ? t(`missingArea.defaults.session${sessionIndex + 1}.title`)
    : value;
}

export function localizeMissingAreaSessionDescription(
  value: string,
  sessionIndex: number,
  t: TFunction
): string {
  const template = missingAreaPlaceholderValues.sessionTemplates[sessionIndex];
  if (!template) return value;

  return template.descriptions.includes(value.trim())
    ? t(`missingArea.defaults.session${sessionIndex + 1}.description`)
    : value;
}
