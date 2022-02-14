import React from 'react'
import {DraggableCore} from 'react-draggable'
import {useRecoilCallback, useRecoilValue} from 'recoil'
import {elementState, selectedElementIdsState} from './elementState'

type DraggableProps = {
    id: number
    mouseDown: boolean
    setMouseDown: (mouseDown: boolean) => void
}

export const Draggable: React.FC<DraggableProps> = ({id, mouseDown, setMouseDown, children}) => {
    const selectedElementIds = useRecoilValue(selectedElementIdsState)

    const setElements = useRecoilCallback(
        ({set}) => {
            return (movementX: number, movementY: number) => {
                // Move all the selected elements
                for (const id of selectedElementIds) {
                    set(elementState(id), (element) => ({
                        ...element,
                        style: {
                            ...element.style,
                            top: element.style.top + movementY,
                            left: element.style.left + movementX,
                        },
                    }))
                }
            }
        },
        [selectedElementIds],
    )

    return (
        <DraggableCore
            onDrag={(e: any) => {
                setElements(e.movementX, e.movementY)
            }}
        >
            {children}
        </DraggableCore>
    )
}
