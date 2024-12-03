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

    addListener(type: T, handler: () => void){
        if ( !this.handlers.has(type) ){
            this.handlers.set(type,[])
        }

        const weakRefHander = new WeakRef(handler)
        this.handlers.get(type)!.push(weakRefHander)
    }
}