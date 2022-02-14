import randomMC from 'random-material-color'
import {atomFamily, atom, selectorFamily, selector} from 'recoil'

/**
 * An atom that stores the IDs of all Elements on the canvas.
 *
 * https://recoiljs.org/docs/api-reference/core/atom
 */
export const elementsState = atom<number[]>({
    key: 'elements',
    default: [],
})

export type Inputs = {
    name: string
}
export type Outputs = {
    name: string
}

export type CommonState = {
    style: {
        top: number
        left: number
        width: number
        height: number
    },
    inputs?: Inputs[],
    outputs?: Outputs[],
}

type RectangleState = {
    type: 'rectangle'
    color: string
}

type ImageState = {
    type: 'image'
    src: string
    seed: number
}

type DeviceState = {
    type: 'device'
    src: string
}

export type ElementState = CommonState & (RectangleState | ImageState | DeviceState)

export const defaultStyle = {
    top: 100,
    left: 100,
    width: 80,
    height: 80,
}

/**
 * An atomFamily that stores the states for all Elements.
 *
 * https://recoiljs.org/docs/api-reference/utils/atomFamily
 */
export const elementState = atomFamily<ElementState, number>({
    key: 'element',
    default: () => ({
        type: 'rectangle',
        style: defaultStyle,
        color: randomMC.getColor({shades: ['500']}),
    }),
})

/**
 * An atom that stores which Element is currently selected.
 */
export const selectedElementIdsState = atom<number[]>({
    key: 'selectedElementId',
    default: [],
})

/**
 * A selector that returns the selected Element's state.
 */
export const selectedElementState = selector<ElementState | undefined>({
    key: 'selectedElement',
    get: ({get}) => {
        const ids = get(selectedElementIdsState)

        if (ids.length === 1) {
            return get(elementState(ids[0]))
        }
    },
    set: ({set, get}, newElementValue) => {
        const ids = get(selectedElementIdsState)

        if (ids.length === 1 && newElementValue) {
            set(elementState(ids[0]), newElementValue)
        }
    },
})

/**
 * A selectorFamily that returns true if the provided
 * Element is currently selected.
 *
 * https://recoiljs.org/docs/api-reference/utils/selectorFamily
 */
export const isSelectedState = selectorFamily({
    key: 'isSelected',
    get: (id: number) => ({get}) => {
        const selectedElementIds = get(selectedElementIdsState)
        return selectedElementIds.includes(id)
    },
})
