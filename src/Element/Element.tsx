import React, {Suspense} from 'react'
import {useRecoilValue} from 'recoil'
import {elementState} from './elementState'
import {ElementContainer} from './ElementContainer'
import hexToRgba from 'hex-to-rgba'
import {Image} from './Image'
import {ElementFallback} from './ElementFallback'
import {Device} from './Device'
import { colors } from '../ui/constants'

export const Element: React.FC<{id: number}> = ({id}) => {
    const element = useRecoilValue(elementState(id))
    const backgroundColor =
        element.type === 'rectangle' ? hexToRgba(element.color, 0.6) : element.type === 'device' ? '#fff' : undefined
    const borderRadius = element.type === 'device' ? '100%' : undefined

    return (
        <ElementContainer id={id} style={{backgroundColor, borderRadius, position: 'relative'}}>
            <Suspense fallback={<ElementFallback />}>
                <Image id={id} />
                <Device id={id} />
                {element && element.inputs && (
                    <div
                        style={{
                            position: 'absolute',
                            left: -50,
                            top: 0,
                            bottom: 0,
                            display: 'flex',
                            justifyContent: 'space-around',
                            flexDirection: 'column',
                        }}
                    >
                        {element.inputs.map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    width: 30,
                                    height: 15,
                                    background: '#222',
                                    borderRadius: 7.5,
                                    border: '1px solid #333',
                                    position: 'relative',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: 3,
                                        top: 2,
                                        height: 9,
                                        width: 9,
                                        borderRadius: '50%',
                                        background: colors.primary,
                                    }}
                                ></div>
                            </div>
                        ))}
                    </div>
                )}
                {element && element.outputs && (
                    <div
                        style={{
                            position: 'absolute',
                            right: -50,
                            top: 0,
                            bottom: 0,
                            display: 'flex',
                            justifyContent: 'space-around',
                            flexDirection: 'column',
                        }}
                    >
                        {element.outputs.map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    width: 30,
                                    height: 15,
                                    background: '#222',
                                    borderRadius: 7.5,
                                    border: '1px solid #333',
                                    position: 'relative',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: 3,
                                        top: 2,
                                        height: 9,
                                        width: 9,
                                        borderRadius: '50%',
                                        background: '#0dbedc',
                                    }}
                                ></div>
                            </div>
                        ))}
                    </div>
                )}
            </Suspense>
        </ElementContainer>
    )
}
