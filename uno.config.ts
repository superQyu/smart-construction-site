// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
    // ...UnoCSS options

    theme: {
        breakpoints: {
            'xs': '320px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
            'xxl': '1536px',
        },
    }
})