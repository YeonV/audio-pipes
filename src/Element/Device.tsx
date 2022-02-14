import React, {useEffect} from 'react'
import {useRecoilValue, selectorFamily, useSetRecoilState} from 'recoil'
import {elementState} from './elementState'
import {FiVolume2} from 'react-icons/fi'
import { colors } from '../ui/constants'

type DeviceProps = {
    id: number
}

const deviceSrcState = selectorFamily({
    key: 'deviceSrc',
    get: (id: number) => ({get}) => {
        const element = get(elementState(id))
        if (element.type !== 'device') return null

        return element.src
    },
})

const deviceDimensionsState = selectorFamily({
    key: 'deviceDimensions',
    get: (id: number) => ({get}) => {
        const src = get(deviceSrcState(id))
        if (!src) return null
        return src
    },
})

const useSetDefaultDimensions = (id: number) => {
    const src = useRecoilValue(deviceDimensionsState(id))
    
    const setElement = useSetRecoilState(elementState(id))

    useEffect(() => {
        setElement((element) => {
            return {
                ...element,
                style: {
                    ...element.style,
                    borderRadius: '50%',
                    border: '5px solid #111',
                    boxShadow: `0px 0px 5px 5px ${colors.primary}`
                },
                inputs: [{name: "Node1"}, {name: "Node2"}],
                outputs: [{name: "Node1"}]
            }
        })
    }, [src, setElement])
}

export const Device: React.FC<DeviceProps> = ({id}) => {
    useSetDefaultDimensions(id)

    const deviceSrc = useRecoilValue(deviceSrcState(id))
    
    if (!deviceSrc) return null

    return (
        <div
            style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        ><FiVolume2 color='#333' size={35} /></div>
    )
}
