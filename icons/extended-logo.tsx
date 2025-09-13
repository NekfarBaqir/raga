"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import ExtendedLogoLarge from "./extended-logo-large"
import ExtendedLogoMobile from "./extended-logo-mobile"


const ExtendedLogo = ({className}: {className?: string}) => {
    const isMobile = useIsMobile()

    if(isMobile) return <ExtendedLogoMobile className={className} />
    return <ExtendedLogoLarge className={className} />

}

export default ExtendedLogo
