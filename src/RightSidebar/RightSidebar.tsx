import React, {Suspense} from 'react'
import {Sidebar} from '../ui/Sidebar'
import {Properties} from './Properties'
import {PropertiesYz} from './PropertiesYz'
import {Details, DetailsFallback} from './Details'

export const RightSidebar: React.FC = () => (
    <Sidebar>
        <Properties />
        <PropertiesYz />
        {/* <Suspense fallback={<DetailsFallback />}>
            <Details />
        </Suspense> */}
    </Sidebar>
)
