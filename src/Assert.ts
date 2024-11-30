export namespace Assert {
    export class AsseertionError extends Error {
        
        /**
         * 方法がないからpublic
         * インスタンスを作成するな!
         */
        constructor(msg: string){
            super(msg)
            this.name = "AssertionError"
        }
    }

    export function isNotNull<T>(v: T | null): asserts v is T {
        if ( v === null ){
            throw new AsseertionError("isNotNull")
        }
    }
    
    export function isNotUndefined<T>(v: T | undefined): asserts v is T {
        if ( v === undefined ){
            throw new AsseertionError("isNotUndefined")
        }
    }
    
    export function isTrue(v: boolean){
        if ( !v ){
            throw new AsseertionError("isTrue")
        }
    }
}