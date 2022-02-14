import React from 'react'
import {ColorPicker} from './ColorPicker'
import {useRecoilState} from 'recoil'
import {SidebarSection} from '../ui/Sidebar'
import {selectedElementState} from '../Element/elementState'
import {StyleInput} from './StyleInput'
import {RefreshButton} from './RefreshButton'
import {getRandomImageUrl} from '../utils'
import {Title} from '../ui/Typography'


export const Properties: React.FC = () => {
    // const [selectedElement, setSelectedElement] = useRecoilState(selectedElementState)
    const [selectedElement, _] = useRecoilState(selectedElementState)

    if (!selectedElement) return null

    return (
        <SidebarSection title="Properties">
            {/* {selectedElement.type === 'rectangle' && (
                <>
                    <Title>Rectangle</Title>
                    <ColorPicker
                        value={selectedElement.color}
                        onChange={(color) => {
                            // setSelectedElement({
                            //     ...selectedElement,
                            //     color,
                            // })
                        }}
                    />
                </>
            )}
            {selectedElement.type === 'device' && (
                <>
                    <Title>Device</Title>
                </>
            )}
            {selectedElement.type === 'image' && (
                <RefreshButton
                    onClick={() => {
                        // const randomImage = getRandomImageUrl()

                        // setSelectedElement({
                        //     ...selectedElement,
                        //     src: randomImage.src,
                        //     seed: randomImage.seed,
                        // })
                    }}
                />
            )} */}
            {/* <StyleInput property="top" />
            <StyleInput property="left" />
            <StyleInput property="width" />
            <StyleInput property="height" /> */}
        </SidebarSection>
    )
}
