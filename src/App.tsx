import React, {Suspense, useState} from 'react'
import styled from 'styled-components'
import {Canvas} from './Canvas'
import {LeftSidebar} from './LeftSidebar/LeftSidebar'
import {RightSidebar} from './RightSidebar/RightSidebar'
import {GlobalStyles} from './ui/GlobalStyles'
import {RecoilRoot} from 'recoil'
import {CenteredLoading} from './ui/CenteredLoading'
import {TopBanner, BottomBanner} from './Banner'
import ReactFlow from 'react-flow-renderer'

import {FiVolume2, FiBarChart2, FiMic} from 'react-icons/fi'
import {FaLightbulb} from 'react-icons/fa'
import {ReactComponent as FX} from './ui/fx.svg'
import Flow from './Flow'

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
`

const AppColumns = styled.div`
    display: flex;
    flex: 1;
`

const initialElements = [
    {
        id: 'mic',
        type: 'input',
        data: {label: <FiMic size={30} />, yzType: 'input'},
        position: {x: 100, y: 600},
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'eq',
        data: {label: <FiBarChart2 size={30} />},
        position: {x: 400, y: 375},
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'fx',
        data: {label: <FX />},
        position: {x: 400, y: 800},
        sourcePosition: 'right',
        targetPosition: 'left',
        animated: true,
    },
    {
        id: 'speaker1',
        type: 'output',
        data: {label: <FiVolume2 size={30} />, yzType: 'speaker'},
        position: {x: 700, y: 225},
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'speaker2',
        type: 'output',
        data: {label: <FiVolume2 size={30} />, yzType: 'speaker'},
        position: {x: 700, y: 325},
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'speaker3',
        type: 'output',
        data: {label: <FiVolume2 size={30} />, yzType: 'speaker'},
        position: {x: 700, y: 425},
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'speaker4',
        type: 'output',
        data: {label: <FiVolume2 size={30} />, yzType: 'speaker'},
        position: {x: 700, y: 525},
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'bulb1',
        type: 'output',
        data: {label: <FaLightbulb size={30} />, yzType: 'bulb'},
        position: {x: 700, y: 650},
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'bulb2',
        type: 'output',
        data: {label: <FaLightbulb size={30} />, yzType: 'bulb'},
        position: {x: 700, y: 750},
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'bulb3',
        type: 'output',
        data: {label: <FaLightbulb size={30} />, yzType: 'bulb'},
        position: {x: 700, y: 850},
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'bulb4',
        type: 'output',
        data: {label: <FaLightbulb size={30} />, yzType: 'bulb'},
        position: {x: 700, y: 950},
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {id: 'mic-eq', source: 'mic', target: 'eq', animated: true},
    {id: 'mic-fx', source: 'mic', target: 'fx', animated: true},
    {id: 'eq-speaker1', source: 'eq', target: 'speaker1', animated: true},
    {id: 'eq-speaker2', source: 'eq', target: 'speaker2', animated: true},
    {id: 'eq-speaker3', source: 'eq', target: 'speaker3', animated: true},
    {id: 'eq-speaker4', source: 'eq', target: 'speaker4', animated: true},
    {id: 'fx-bulb1', source: 'fx', target: 'bulb1', animated: true},
    {id: 'fx-bulb2', source: 'fx', target: 'bulb2', animated: true},
    {id: 'fx-bulb3', source: 'fx', target: 'bulb3', animated: true},
    {id: 'fx-bulb4', source: 'fx', target: 'bulb4', animated: true},
]
const App: React.FC = () => {
    const [elements, setElements] = useState(initialElements)
    return (
        <Suspense fallback={<CenteredLoading />}>
            <AppContainer>
                <TopBanner />
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{height: 'calc(100vh - 300px)', flex: 1}}>
                        <AppColumns>
                            <LeftSidebar elements={elements} setElements={setElements} />
                            <div style={{height: '100%', flex: 1}}>
                                <Flow elements={elements} setElements={setElements} />
                            </div>
                            {/* <Canvas /> */}
                            <RightSidebar />
                        </AppColumns>
                    </div>

                    {/* <Flow /> */}
                </div>
                <BottomBanner />
            </AppContainer>
        </Suspense>
    )
}

/**
 * An app that uses Recoil needs to be wrapped
 * in a single RecoilRoot component
 */
const Root = () => (
    <RecoilRoot>
        <App />
        <GlobalStyles />
    </RecoilRoot>
)

export default Root
