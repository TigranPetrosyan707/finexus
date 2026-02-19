import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.js'],
            refresh: true,
        }),
        react({
            // This tells Vite to process JSX in .js files too
            include: ['**/*.jsx', '**/*.js'],
            babel: {
                // Make sure it uses the automatic React runtime
                presets: [
                    [
                        '@babel/preset-react',
                        {
                            runtime: 'automatic',
                        },
                    ],
                ],
            },
        }),
    ],
})
