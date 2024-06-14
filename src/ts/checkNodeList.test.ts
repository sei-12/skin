import { NodeProps, checkNodeList } from "./checkNodeList"

test("checkNodeList",() => {
    let nodeList: NodeProps[] = []
    let checkResult: {isErr: boolean, errs: string[]};
    

    nodeList = [
        { nodeType: "tag", value: "" },
    ]
    checkResult = checkNodeList(nodeList)
    expect(checkResult.isErr).toBe(false)


    // case2
    nodeList = [
        { nodeType: "tag", value: "" },
        { nodeType: "tag", value: "" },
    ]
    checkResult = checkNodeList(nodeList)
    expect(checkResult.isErr).toBe(true)


    // case3
    nodeList = [
        { nodeType: "tag", value: "" },
        { nodeType: "and", value: "" },
    ]
    checkResult = checkNodeList(nodeList)
    expect(checkResult.isErr).toBe(true)

    // case4
    nodeList = [
        { nodeType: "tag", value: "" },
        { nodeType: "or", value: "" },
        { nodeType: "text", value: "" },
    ]
    checkResult = checkNodeList(nodeList)
    expect(checkResult.isErr).toBe(false)

    // case5
    nodeList = [
        { nodeType: "tag", value: "" },
        { nodeType: "or", value: "" },
        { nodeType: "not", value: "" },
        { nodeType: "text", value: "" },
    ]
    checkResult = checkNodeList(nodeList)
    expect(checkResult.isErr).toBe(false)

    // case6
    nodeList = [
        { nodeType: "tag", value: "" },
        { nodeType: "not", value: "" },
        { nodeType: "text", value: "" },
    ]
    checkResult = checkNodeList(nodeList)
    expect(checkResult.isErr).toBe(true)

    // case7
    nodeList = [
        { nodeType: "not", value: "" },
        { nodeType: "tag", value: "" },
        { nodeType: "or", value: "" },
        { nodeType: "not", value: "" },
        { nodeType: "text", value: "" },
    ]
    checkResult = checkNodeList(nodeList)
    expect(checkResult.isErr).toBe(false)

    // case8
    nodeList = [
        { nodeType: "and", value: "" },
        { nodeType: "tag", value: "" },
        { nodeType: "or", value: "" },
        { nodeType: "not", value: "" },
        { nodeType: "text", value: "" },
    ]
    checkResult = checkNodeList(nodeList)
    expect(checkResult.isErr).toBe(true)

    // case9
    nodeList = [
        { nodeType: "tag", value: "" },
        { nodeType: "or", value: "" },
        { nodeType: "not", value: "" },
        { nodeType: "text", value: "" },
        { nodeType: "or", value: "" },
        { nodeType: "tag", value: "" },
        { nodeType: "or", value: "" },
        { nodeType: "not", value: "" },
        { nodeType: "text", value: "" },
    ]
    checkResult = checkNodeList(nodeList)
    expect(checkResult.isErr).toBe(false)

    // case10
    nodeList = [
        { nodeType: "not", value: "" },
        { nodeType: "or", value: "" },
        { nodeType: "text", value: "" },
    ]
    checkResult = checkNodeList(nodeList)
    expect(checkResult.isErr).toBe(true)

    // case11
    nodeList = [
        { nodeType: "not", value: "" },
        { nodeType: "not", value: "" },
        { nodeType: "text", value: "" },
    ]
    checkResult = checkNodeList(nodeList)
    expect(checkResult.isErr).toBe(true)
})