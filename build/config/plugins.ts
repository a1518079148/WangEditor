import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { PluginOption } from 'vite'
import { viteVar, viteDef } from 'vite-var'
import { globalType } from '../env/globalVar'
import fse from 'fs-extra'
import { resolve } from 'path'
export const getPlugins = (env: globalType) => {
    const plugin: PluginOption[] = [
        viteVar(env),
        viteDef(env.env.pro),
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.startsWith('lottie-') || tag.startsWith('marquee')
                }
            }
        }),
        visualizer({
            open: env.env.BUILDVIEW,
            gzipSize: true,
            brotliSize: true
        }) as any,
        {
            closeBundle() {
                fse.moveSync(resolve('./dist/index.html'), resolve(`./dist/${env.static}/index.html`))
            }
        }
    ]
    return plugin
}
