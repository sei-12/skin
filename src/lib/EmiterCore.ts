import { CommandId, I_CommandEmmiter } from "./CommandEmmiter"

export class CommandEmiterCore implements I_CommandEmmiter{
    private handlers = new Map<CommandId, WeakRef<() => void>[]>()

    emit(type: CommandId){
        let handlers = this.handlers.get(type)

        if ( handlers === undefined ){
            return
        }
        
        handlers.forEach( wraped_h => {
            let handler = wraped_h.deref()
            if ( handler === undefined ){
                return
            }
            handler()
        })

        let newHanders = handlers.filter((h) => {
            return h.deref() !== undefined
        })
        
        this.handlers.set(type,newHanders)
    }

    private addHandler(type: CommandId, handler: () => void){
        if ( !this.handlers.has(type) ){
            this.handlers.set(type,[])
        }

        const weakRefHander = new WeakRef(handler)
        this.handlers.get(type)!.push(weakRefHander)
    }
    

    addWeakRefListener(listener: CommandEmiterLisntener<CommandId>){
        listener.handlers.forEach( (e) => {
            const [type,h] = e
            this.addHandler(type,h)
        })
    }
}

/**
 * リスナーの寿命がハンドラの寿命
 * リスナーの参照を保持しないとリスナーがGCされてハンドラもGCされることに注意
 */
export class CommandEmiterLisntener<CommandId> {
    readonly instanceId = crypto.randomUUID()
    readonly handlers: [CommandId,() => void][]

    constructor(
        ...handlers: [CommandId,() => void][]
    ){
        this.handlers = handlers
    }
}