import React from 'react'
import {ColorPicker} from './ColorPicker'
import {SidebarSection} from '../ui/Sidebar'
import {selectedElementState} from '../Element/elementState'
import {StyleInput} from './StyleInput'
import {RefreshButton} from './RefreshButton'
import {getRandomImageUrl} from '../utils'
import {Title} from '../ui/Typography'
import {RecoilRoot, atom, selector, useRecoilState, useRecoilValue} from 'recoil'
import Webaudio from '../Webaudio'

export const yzElemState = atom({
    key: 'yzElemState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
})

export const PropertiesYz = () => {
    // const [selectedElement, setSelectedElement] = useRecoilState(selectedElementState)
    const [yzElem, setYzElem] = useRecoilState(yzElemState)

    console.log(yzElem, yzElem?.length)

    if (yzElem?.length === 1) {
        if (yzElem[0]?.data?.yzType === 'bulb') {
            return (
                <SidebarSection title="Properties">
                    <Title>{`${yzElem[0].id} [${yzElem[0].data.yzType}]`}</Title>
                    <Title>IP: 192.168.1.170</Title>
                </SidebarSection>
            )
        } else {
            if (yzElem[0]?.data?.yzType === 'speaker') {
                return (
                    <SidebarSection title="Properties">
                        <Title>{`${yzElem[0].id} [${yzElem[0].data.yzType}]`}</Title>
                        <Title>Output Device:</Title>
                        <Webaudio kind={"audiooutput"}/>
                    </SidebarSection>
                )
            } else {
                if (yzElem[0]?.data?.yzType === 'input') {
                    return (
                        <SidebarSection title="Properties">
                            <Title>{`${yzElem[0].id} [${yzElem[0].data.yzType}]`}</Title>
                            <Title>Input Device:</Title>
                            <Webaudio kind={"audioinput"} />
                        </SidebarSection>
                    )
                } else {
                    return (
                        <SidebarSection title="Properties">
                            <Title>{`${yzElem[0].id} [${yzElem[0].data.yzType}]`}</Title>
                        </SidebarSection>
                    )
                }
            }
        }
    } else {
        if (yzElem?.length > 1) {
            return (
                <SidebarSection title="Properties">
                    <Title>Group selected</Title>
                </SidebarSection>
            )
        } else {
            return (
                <SidebarSection title="Properties">
                    <Title>Nothing selected</Title>
                </SidebarSection>
            )
        }
    }
}
