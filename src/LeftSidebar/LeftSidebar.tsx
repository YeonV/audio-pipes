import React from 'react'
import {FiSquare, FiImage, FiCpu, FiMic, FiVolume2, FiBarChart2} from 'react-icons/fi'
import {Sidebar} from '../ui/Sidebar'
import {Title} from '../ui/Typography'
import {IconButton} from '../ui/IconButton'
import {ButtonGroup} from '../ui/ButtonGroup'
import {useInsertElement} from './useInsertElement'
import { ReactComponent as FX } from '../ui/fx.svg'
import { FaLightbulb } from "react-icons/fa";

export const LeftSidebar = ({elements, setElements}: any) => {
    const insertElement = useInsertElement()

    return (
        <Sidebar>
            <Title>Insert Recoil</Title>
            <ButtonGroup>
                <IconButton icon={FiSquare} onClick={() => insertElement('rectangle')} />
                <IconButton icon={FiImage} onClick={() => insertElement('image')} />
                <IconButton icon={FiCpu} onClick={() => insertElement('device')} />
            </ButtonGroup>
            <br />
            <br />
            <br />
            <Title>Insert Flow</Title>
            <ButtonGroup>
                <IconButton
                    icon={FiMic}
                    onClick={() =>
                        setElements([
                            ...elements,
                            {
                                id: `mic-${elements.length}`,
                                type: 'input',
                                data: {label: <FiMic size={30} />},
                                position: {x: 100, y: 100},
                                sourcePosition: 'right',
                                targetPosition: 'left',
                            },
                        ])
                    }
                />
                <IconButton
                    icon={FiVolume2}
                    onClick={() =>
                        setElements([
                            ...elements,
                            {
                                id: `eq-${elements.length}`,
                                type: 'output',
                                data: {label: <FiVolume2 size={30} />},
                                position: {x: 100, y: 100},
                                sourcePosition: 'right',
                                targetPosition: 'left',
                                style: {
                                    background: 'red'
                                }
                            },
                        ])
                    }
                />
                <IconButton
                    icon={FiBarChart2}
                    onClick={() =>
                        setElements([
                            ...elements,
                            {
                                id: `eq-${elements.length}`,
                                data: {label: <FiBarChart2 size={30} />},
                                position: {x: 100, y: 100},
                                sourcePosition: 'right',
                                targetPosition: 'left',
                            },
                        ])
                    }
                />
            </ButtonGroup>
            <br />
            <ButtonGroup>
                <div
                    style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#1D1E1F',
                        borderRadius: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0',
                        padding: '0',
                        border: '0',
                    }}
                    onClick={() =>
                        setElements([
                            ...elements,
                            {
                                id: `eq-${elements.length}`,
                                data: {label: <FX />},
                                position: {x: 100, y: 100},
                                sourcePosition: 'right',
                                targetPosition: 'left',
                            },
                        ])
                    }
                >
                    <FX />
                </div>
                <IconButton
                    icon={FaLightbulb}
                    onClick={() =>
                        setElements([
                            ...elements,
                            {
                                id: `eq-${elements.length}`,
                                data: {label: <FaLightbulb size={30} />},
                                position: {x: 100, y: 100},
                                sourcePosition: 'right',
                                targetPosition: 'left',
                            },
                        ])
                    }
                />
            </ButtonGroup>
        </Sidebar>
    )
}
