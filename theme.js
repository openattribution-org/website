// Single source of truth for OpenAttribution brand colors
const colors = {
    coral: {
        50: '#fef2f2',
        100: '#fee2e1',
        200: '#fecaca',
        300: '#fca5a3',
        400: '#f87572',
        500: '#f5564e',
        600: '#dc3b35',
        700: '#b92d27',
        800: '#982724',
        900: '#7f2724',
    },
    amber: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
    },
    cream: '#faf8f5',
};

// Set Tailwind config
tailwind.config = {
    theme: {
        extend: {
            colors,
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        }
    }
};

// Inject CSS custom properties
const style = document.createElement('style');
let css = ':root {\n';
for (const [name, shades] of Object.entries(colors)) {
    if (typeof shades === 'string') {
        css += `  --${name}: ${shades};\n`;
    } else {
        for (const [shade, hex] of Object.entries(shades)) {
            css += `  --${name}-${shade}: ${hex};\n`;
        }
    }
}
css += '}';
style.textContent = css;
document.head.prepend(style);
