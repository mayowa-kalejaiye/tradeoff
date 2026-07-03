const fs = require('fs');

function convertToNextJs(htmlString) {
    let s = htmlString;
    
    // Convert class to className
    s = s.replace(/class=/g, 'className=');

    // Replace colors
    const colors = {
        "surface-container-lowest": "#ffffff",
        "tertiary": "#000000",
        "on-surface": "#1b1b1b",
        "outline-variant": "#cfc4c5",
        "error": "#ba1a1a",
        "secondary-container": "#dfe0e0",
        "secondary": "#5d5f5f",
        "inverse-primary": "#c6c6c6",
        "secondary-fixed-dim": "#c6c6c7",
        "on-primary-container": "#848484",
        "on-secondary": "#ffffff",
        "on-secondary-fixed": "#1a1c1c",
        "on-tertiary-fixed": "#410000",
        "primary": "#000000",
        "error-container": "#ffdad6",
        "surface-container": "#eeeeee",
        "surface-container-low": "#f3f3f3",
        "on-tertiary-container": "#ff291a",
        "background": "#f9f9f9",
        "on-primary-fixed-variant": "#474747",
        "tertiary-fixed-dim": "#ffb4a8",
        "outline": "#7e7576",
        "primary-fixed-dim": "#c6c6c6",
        "on-surface-variant": "#4c4546",
        "surface-tint": "#5e5e5e",
        "on-secondary-container": "#616363",
        "surface": "#f9f9f9",
        "tertiary-fixed": "#ffdad4",
        "tertiary-container": "#410000",
        "on-tertiary-fixed-variant": "#930100",
        "surface-dim": "#dadada",
        "inverse-on-surface": "#f1f1f1",
        "surface-variant": "#e2e2e2",
        "on-tertiary": "#ffffff",
        "on-secondary-fixed-variant": "#454747",
        "inverse-surface": "#303030",
        "surface-container-high": "#e8e8e8",
        "primary-fixed": "#e2e2e2",
        "primary-container": "#1b1b1b",
        "on-error-container": "#93000a",
        "on-background": "#1b1b1b",
        "surface-container-highest": "#e2e2e2",
        "secondary-fixed": "#e2e2e2",
        "on-primary": "#ffffff",
        "surface-bright": "#f9f9f9",
        "on-primary-fixed": "#1b1b1b",
        "on-error": "#ffffff"
    };

    for (const [key, val] of Object.entries(colors)) {
        s = s.replace(new RegExp(`bg-${key}(?![\\w-])`, 'g'), `bg-[${val}]`);
        s = s.replace(new RegExp(`text-${key}(?![\\w-])`, 'g'), `text-[${val}]`);
        s = s.replace(new RegExp(`border-${key}(?![\\w-])`, 'g'), `border-[${val}]`);
    }

    // Replace spacing
    s = s.replace(/border-border-thick/g, 'border-[2px]');
    s = s.replace(/border-border-thin/g, 'border-[1px]');
    s = s.replace(/border-thick/g, 'border-[2px]');
    s = s.replace(/border-thin/g, 'border-[1px]');
    s = s.replace(/border-b-border-thick/g, 'border-b-[2px]');
    s = s.replace(/border-t-border-thick/g, 'border-t-[2px]');
    s = s.replace(/border-l-border-thick/g, 'border-l-[2px]');
    s = s.replace(/border-r-border-thick/g, 'border-r-[2px]');
    s = s.replace(/border-b-border-thin/g, 'border-b-[1px]');
    s = s.replace(/border-t-border-thin/g, 'border-t-[1px]');
    s = s.replace(/border-l-border-thin/g, 'border-l-[1px]');
    s = s.replace(/border-r-border-thin/g, 'border-r-[1px]');

    s = s.replace(/gutter/g, '[24px]');
    s = s.replace(/margin-edge/g, '[40px]');
    s = s.replace(/-unit/g, '-[8px]');
    
    // Replace typography sizes
    s = s.replace(/text-headline-lg-mobile/g, 'text-[32px] leading-[1.2] font-[800]');
    s = s.replace(/text-headline-lg/g, 'text-[48px] leading-[1.1] tracking-[-0.02em] font-[900]');
    s = s.replace(/text-headline-md/g, 'text-[24px] leading-[1.2] font-[700]');
    s = s.replace(/text-body-lg/g, 'text-[16px] leading-[1.6] font-[400]');
    s = s.replace(/text-code-md/g, 'text-[14px] leading-[1.4] font-[500]');
    s = s.replace(/text-body-sm/g, 'text-[14px] leading-[1.5] font-[400]');
    s = s.replace(/text-label-caps/g, 'text-[12px] leading-[1] font-[700] tracking-[0.1em]');
    
    // Replace font families
    s = s.replace(/font-headline-lg-mobile/g, 'font-sans');
    s = s.replace(/font-headline-lg/g, 'font-sans');
    s = s.replace(/font-headline-md/g, 'font-sans');
    s = s.replace(/font-body-lg/g, 'font-sans');
    s = s.replace(/font-body-sm/g, 'font-sans');
    s = s.replace(/font-code-md/g, 'font-mono');
    s = s.replace(/font-label-caps/g, 'font-mono');

    return s;
}

module.exports = { convertToNextJs };
