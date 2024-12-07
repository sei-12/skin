import { CommandId, I_CommandEmiter } from "./CommandEmmiter"
import { ShourtcutScopeManager, ShourtcutScopeStatus } from "./ShourtcutScopeManager"


// TODO: 文字列で指定できるようにする
type Key = {
    metaKey: boolean
    ctrlKey: boolean
    altKey: boolean
    shiftKey: boolean
    key: string
}

type Trigger = {
    key: Key,
    when: ShourtcutScopeStatus
    keyup?: boolean
}

interface HotkeySetting {
    trigger: Trigger
    commandId: CommandId
}

const defaultSettings: HotkeySetting[] = [
    {commandId: "bkmkList.focusDown",trigger:{
        key: { metaKey: false, shiftKey: false, ctrlKey: true, altKey: false , key: "n" },
        when: "base",
    }},
    {commandId: "bkmkList.focusUp",trigger:{
        key: { metaKey: false, shiftKey: false, ctrlKey: true, altKey: false , key: "p" },
        when: "base",
    }},
    {commandId: "tagSuggestionWindow.focusDown",trigger:{
        key: { metaKey: false, shiftKey: false, ctrlKey: true, altKey: false , key: "n" },
        when:"tagSuggestionWindow",
    }},
    {commandId: "tagSuggestionWindow.focusUp",trigger:{
        key: { metaKey: false, shiftKey: false, ctrlKey: true, altKey: false , key: "p" },
        when:"tagSuggestionWindow",
    }},
    {commandId: "tagSuggestionWindow.Done",trigger:{
        key: { metaKey: false, shiftKey: false, ctrlKey: false, altKey: false , key: "Enter" },
        when:"tagSuggestionWindow",
    }},
    {commandId: "createNewBkmk.done",trigger:{
        key: { metaKey: false, shiftKey: false, ctrlKey: true, altKey: false , key: "Enter" },
        when:"createNewBookmark",
    }},
    {commandId:"createNewBkmk.start",trigger:{
        key: { metaKey: true, shiftKey: false, ctrlKey: false, altKey: false , key: "n" },
        when:"base",
    }},
    {commandId: "focusBkmkPredicateInputbox",trigger:{
        key: { metaKey: false, shiftKey: false, ctrlKey: false, altKey: false , key: "/" },
        when:"base",
        keyup: true
    }},
] as const;


function makeTriggerHash(t: Trigger){
    let hash = ""
    hash += t.keyup ? "keyup+" : "keydown+"
    hash += t.when + "+"
    hash += t.key.altKey  ? "alt+"  : ""
    hash += t.key.ctrlKey ? "ctrl+" : ""
    hash += t.key.metaKey ? "meta+" : ""
    hash += t.key.shiftKey? "shift+": ""
    hash += t.key.key
    return hash
}
type TriggerHash = ReturnType<typeof makeTriggerHash>

export class HotkeyManager {
    
    private hotkeyMap = new Map<TriggerHash, CommandId[]>()

    constructor(userSettigs?: HotkeySetting[]){
        defaultSettings.forEach( setting => { this.applySetting(setting) })
        userSettigs?.forEach( setting => { this.applySetting(setting) }) 
    }
    
    private applySetting(setting: HotkeySetting){
        const triggerHash = makeTriggerHash(setting.trigger)
        let ary = this.hotkeyMap.get(triggerHash)
        if ( ary === undefined ){
            this.hotkeyMap.set(triggerHash,[setting.commandId])
        }else{
            ary.push(setting.commandId)
        }
    }

    private handler(e: KeyboardEvent, keyup: boolean, shourtcutScopeManager: ShourtcutScopeManager, emiter: I_CommandEmiter){
        let keyhash = makeTriggerHash({
            key: e,
            keyup: keyup,
            when: shourtcutScopeManager.getCurrentStatus()
        })


        let commands = this.hotkeyMap.get(keyhash)
        if ( commands === undefined ){ return }
        commands.forEach( c => emiter.emit(c) )
    }

    startListen(window_: Window,shourtcutScopeManager: ShourtcutScopeManager, emiter: I_CommandEmiter){
        window_.addEventListener("keydown",(e) => { this.handler(e,false,shourtcutScopeManager,emiter) })
        window_.addEventListener("keyup",(e) => { this.handler(e,true,shourtcutScopeManager,emiter) })
    }
}