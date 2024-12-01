
const CommandIds = [
    "tagSuggestionWindow.focusDown",
    "tagSuggestionWindow.focusUp",
    "tagSuggestionWindow.Done",
] as const;

export type CommandId = typeof CommandIds[number]

export interface I_CommandEmmiter {
    addListener(commandId: CommandId, handlerId: string, handler: () => void): void
    removeListener(handlerId: string): void
}

// export class CommandEmmiter implements I_CommandEmmiter {
//     addListener(commandId: CommandId, handlerId: string, handler: () => void){

//     }    
//     removeListener(handlerId: string){
        
//     }
// }