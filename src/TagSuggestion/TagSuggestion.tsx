import { RefObject, createRef, forwardRef, useEffect, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { DbAPI } from "../ts/db"
import { scroll_to_focus_elm } from "../ts/utils"

export type TagSuggestionProps = {
    windowElm: React.RefObject<HTMLDivElement>
    windowHidden: boolean
    itemProps: ItemProps[]
    focusIndex: number | null
    itemDivs: React.MutableRefObject<RefObject<HTMLDivElement>[]>
    listOuter: RefObject<HTMLDivElement>
}

type ItemProps = {
    tagData: DbAPI.TagsRecord 
    input: string
    a: string
    b: string
}

function itemPropsFromRecord(input: string,data: DbAPI.TagsRecord): ItemProps {
    let splited = data.value.split(input,2)
    if ( splited.length !== 2 ){
        throw Error()
    }

    let [a,...b] = data.value.split(input)

    return {
        tagData: data,
        input,
        a: a,
        b: b.join(input )
    }    
}

export const useTagSuggesion = (
    done: (tag: DbAPI.TagsRecord) => void
) => {
    
    //
    // Hooks
    //
    const [input, setinput] = useState("");
    const windowElm = useRef<HTMLDivElement>(null)
    const [windowHidden, setwindowHidden] = useState(true);
    const [itemProps, setitemProps] = useState<ItemProps[]>([]);
    const [focusIndex, setfocusIndex] = useState<number | null>(null);
    const itemDivs = useRef<RefObject<HTMLDivElement>[]>([])
    const listOuter = useRef<HTMLDivElement>(null)

    //
    // useEffect
    //
    useEffect(() => {;(async () => {
        if ( input === "" ) {
            setitemProps([])
            setfocusIndex(null)
            return
        }

        let records = await DbAPI.selectTagSuggestion(input).catch(err => console.error(err))
        if ( records === undefined ){
            throw Error()
        }

        let items = records.map(data => itemPropsFromRecord(input,data))
        setitemProps(items)
        if ( items.length > 0 ){
            setfocusIndex(0)
        }else{
            setfocusIndex(null)
        }
    })()},[input])
    
    useEffect(() => {;(async () => {
        itemDivs.current = itemProps.map(() => createRef<HTMLDivElement>())
    })()},[itemProps])

    useEffect(() => {
        if ( focusIndex == null ){
            return
        }
        if ( listOuter.current === null ){
            return
        }
        if ( itemDivs.current[focusIndex].current === null ){
            return
        }

        scroll_to_focus_elm(
            itemDivs.current[focusIndex].current!,
            listOuter.current
        )
    },[focusIndex])
    //
    // useHotkeys
    //
    useHotkeys("ctrl+n",() => {
        if ( focusIndex === null ){
            if ( itemProps.length !== 0 ){
                setfocusIndex(0)
            }
            return
        }

        let newIndex = focusIndex + 1
        if ( newIndex >= itemProps.length ){
            newIndex = 0
        }
        setfocusIndex(newIndex)
    },{enableOnFormTags:["INPUT"],enabled: !windowHidden},[focusIndex,itemProps])

    useHotkeys("ctrl+p",() => {
        if ( focusIndex === null ){
            return
        }

        let newIndex = focusIndex - 1
        if ( newIndex < 0 ){
            newIndex = itemProps.length - 1
        }
        setfocusIndex(newIndex)
    },{enableOnFormTags:["INPUT"],enabled: !windowHidden},[focusIndex,itemProps])
    
    useHotkeys("Enter",doneHandler,{enableOnFormTags:["INPUT"],enabled: !windowHidden},[focusIndex,itemProps])
    
    
    //
    // Functions
    //
    function rePosition(option: {
        width?  : string
        max_height? : string
        top?    : string
        left?   : string
    }){
        console.log(option)

        if ( windowElm.current === null ){
            return
        }
        if ( listOuter.current === null ){
            return
        }

        if ( option.width !== undefined ){
            windowElm.current.style.width = option.width
        }
        if ( option.max_height !== undefined ){
            // htmlの構造上、ここだけlistOuterを操作している
            listOuter.current.style.maxHeight = option.max_height
        }
        if ( option.top !== undefined ){
            windowElm.current.style.top = option.top
        }
        if ( option.left !== undefined ){
            windowElm.current.style.left = option.left
        }
    }
    
    function open(){
        setwindowHidden(false)
    }
    
    function doneHandler(){
        if ( focusIndex === null ){
            return
        }

        done(itemProps[focusIndex].tagData)        
        setwindowHidden(true)
    }
    
    //
    // Props
    //
    const props: TagSuggestionProps = {
        windowElm,
        windowHidden,
        itemProps,
        focusIndex,
        itemDivs,
        listOuter
    }    

    return {
        props,
        rePosition,
        setinput,
        open
    }
}

export const TagSuggestion = (p: TagSuggestionProps) => {
    return (
        <div ref={p.windowElm} hidden={p.windowHidden || p.itemProps.length == 0} className="tag-suggestion-window">
        <div ref={p.listOuter} className="tag-suggestion-window-list-outer">
        {
            p.itemProps.map((item,index) => (
                <ListItem
                    key={index}
                    ref={p.itemDivs.current[index]}
                    {...item}
                    isFocus={p.focusIndex !== null && p.focusIndex === index}
                ></ListItem>
            ))        
        }
        </div>
        </div>
    )
}

const ListItem = forwardRef((p: ItemProps & {isFocus: boolean},ref) => {
    const div = ref as React.MutableRefObject<HTMLDivElement>
    return (
        <div ref={div} className={ 
            p.isFocus ? 
            "tag-suggestion-list-item focused-tag-suggestion-list-item" :
            "tag-suggestion-list-item"  
        }>
            <span className="tag-suggestion-unmatch">{p.a}</span>
            <span className="tag-suggestion-match">{p.input}</span>
            <span className="tag-suggestion-unmatch">{p.b}</span>
        </div>
    )
})