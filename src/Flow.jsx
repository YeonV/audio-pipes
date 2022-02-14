import React from 'react'
import ReactFlow, {removeElements, addEdge} from 'react-flow-renderer'
import './Flow.css'
import {selectedElementIdsState} from './Element/elementState'
import {useRecoilState, useSetRecoilState} from 'recoil'
import { yzElemState } from './RightSidebar/PropertiesYz'





const Flow = ({elements, setElements}) => {
    
    const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els))
    const onConnect = (params) => setElements((els) => addEdge(params, els))
    
    // const setSelectedElement = useSetRecoilState(selectedElementIdsState)

    const [yzElem, setYzElem] = useRecoilState(yzElemState)

    return (
        <div style={{height: '100vh'}}>
            <ReactFlow
                elements={elements}
                onElementsRemove={onElementsRemove}
                onConnect={onConnect}
                deleteKeyCode={46} /* 'delete'-key */
                onSelectionChange={(elements)=>{
                    console.log(elements)
                    // elements && elements.length && setSelectedElement(elements)
                    setYzElem(elements)
                }}
            />
        </div>
    )
}

export default Flow
