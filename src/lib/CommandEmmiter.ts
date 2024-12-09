import { CommandEmiterListener as CommandEmiterListener } from "./EmiterCore";

const CommandIds = [
    "tagSuggestionWindow.focusDown",
    "tagSuggestionWindow.focusUp",
    "tagSuggestionWindow.Done",
    "focusBkmkPredicateInputbox",
    "bkmkList.focusDown",
    "bkmkList.focusUp",
] as const;

export type CommandId = typeof CommandIds[number]

export interface I_CommandEmmiter {
    addWeakRefListener(listener: CommandEmiterListener): void
}
