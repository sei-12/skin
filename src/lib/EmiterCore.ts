export class EmiterCore <T> {
    private handlers = new Map<T, WeakRef<() => void>[]>()

    emit(type: T){
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

    private addHandler(type: T, handler: () => void){
        if ( !this.handlers.has(type) ){
            this.handlers.set(type,[])
        }

        const weakRefHander = new WeakRef(handler)
        this.handlers.get(type)!.push(weakRefHander)
    }
    

    addWeakRefLisntener(listener: EmiterLisntener<T>){
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
export class EmiterLisntener<T> {
    readonly instanceId = crypto.randomUUID()
    readonly handlers: [T,() => void][]

    constructor(
        ...handlers: [T,() => void][]
    ){
        this.handlers = handlers
    }
}