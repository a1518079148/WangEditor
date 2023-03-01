import path from 'path'
import { defineConfig } from 'vite'
import { getBuild, getPlugins } from './build/config'
import { globalVar } from './build/env/globalVar'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = globalVar(command, mode)
    return {
        resolve: {
            alias: {
                '~/': `${path.resolve(__dirname, 'src')}/`
            }
        },
        plugins: getPlugins(env),
        server: {
            host: '0.0.0.0',
            port: 9800,
            open: false,
            https: false
        },
        build: getBuild(env)
    }
})
