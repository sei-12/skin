
export type NodeTypes = "tag" | "text" | "and" | "or" | "not"

export type NodeProps = {
    nodeType: NodeTypes,
    value: string    
}

function isUnaryOperatorNodeType(nodeType: NodeTypes){
    return nodeType === "not"    
}

function isBinaryOperatorNodeType(nodeType: NodeTypes){
    return nodeType === "and" || nodeType === "or"
}

function isOprandNodeType(nodeType: NodeTypes){
    return nodeType === "text" || nodeType === "tag"
}

/**
 * 空の配列はOK
 * @param nodeList 
 * @returns 
 */
export const checkNodeList = (nodeList: NodeProps[]): {
    isErr: boolean,
    errs: string[]
} => {
    let isErr = false
    let errs: string[] = []
    
    if ( nodeList.length === 0 ){
        return {
            isErr,
            errs
        }
    }
    

    let prevNodeType: NodeTypes | null = null
    for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];

        if ( prevNodeType === null && isBinaryOperatorNodeType(node.nodeType)){
            isErr = true
            errs.push("andまたはorの位置が不正です")
            break
        }
        
        if ( prevNodeType === null ){
            prevNodeType = node.nodeType
            continue
        }
        
        if ( isUnaryOperatorNodeType(prevNodeType) && !isOprandNodeType(node.nodeType) ) {
            isErr = true
            errs.push("")
            break
        }
        
        if ( isOprandNodeType(prevNodeType) && !isBinaryOperatorNodeType(node.nodeType)){
            isErr = true
            errs.push("")
            break
        }

        if ( isBinaryOperatorNodeType(prevNodeType) && isBinaryOperatorNodeType(node.nodeType) ){
            isErr = true
            errs.push("")
            break
        }
        
        prevNodeType = node.nodeType
    }
    
    if (prevNodeType !== null && !isOprandNodeType(prevNodeType) ){
        isErr = true
        errs.push("")
    }

    return {
        isErr,
        errs
    }
}