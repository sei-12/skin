import { CommandEmiterLisntener } from "./EmiterCore";

const CommandIds = [
    "tagSuggestionWindow.focusDown",
    "tagSuggestionWindow.focusUp",
    "tagSuggestionWindow.Done",
] as const;

export type CommandId = typeof CommandIds[number]

export interface I_CommandEmmiter {
    addWeakRefListener(listener: CommandEmiterLisntener<CommandId>): void
}
