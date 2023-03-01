import editor from '~/components/editor/index.vue'

const plugin = {
    install(Vue: { component: (arg0: string, arg1: any) => void }) {
        Vue.component('s-editor', editor)
    }
}
export default plugin
