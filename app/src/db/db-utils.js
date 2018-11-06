/**
 * A function to format/adapt a DB node to a GraphQL node.
 * So far no extra logic is required
 * 
 * @param {*} resultNode 
 */

const formatNode = (resultNode) => {
    const formatedNode = resultNode.properties
    return formatedNode
}

const formatNodeResult = (result) => {
    let rec = result.records
    return rec.length === 0 ? null : formatNode(rec[0].get(0)) 
}

const formatPropertyValue = (resultPropertyValue) => {
    console.log(resultPropertyValue)
    return resultPropertyValue;
}

export {
    formatNode,
    formatNodeResult,
    formatPropertyValue
}