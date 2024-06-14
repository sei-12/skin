import { useState } from "react";
import { NodeProps, NodeTypes } from "../ts/checkNodeList";

const useNodeBox = () => {
    const [nodeList, setnodeList] = useState<NodeProps[]>([]);
    
    const pushNode = (
        nodeType: NodeTypes,
        value?: string
    ) => {
        if ( value === undefined ){
            value = ""
        }
        
        setnodeList([...nodeList,{
            nodeType,
            value
        }])
    }
    
    const deleteLastNode = () => { 
        let newNodeList = [...nodeList]        
        newNodeList.pop()
        setnodeList(newNodeList)
    }
    
    const getInputedNodes = () => {

    }

    return {
        addNode: pushNode,
        deleteLastNode,
        getInputedNodes
    }
}

/**
 *
 * 検索条件のノードを格納する
 *
 * マウスによるノードの並び替え
 * マウスによるノードの削除
 *
 * 
 */
const NodeBox = () => {

}