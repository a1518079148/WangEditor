<template>
    <s-editor v-model:content="conf.content" ref="editor" :height="conf.height"></s-editor>
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue'

const conf = reactive({
    content: null,
    height: '300px'
})

const sendParentMessage = (obj: any) => {
    window.parent.postMessage(obj)
}

let w = null as any

const getMessage = (e: any) => {
    const action = e.data.action
    const data = e.data.data
    if (action === 'setEditor') {
        if (w !== null) {
            w()
            w = null
        }
        conf.content = data
        w = watch(
            () => conf.content,
            () => {
                sendParentMessage({
                    action: 'updateEditor',
                    data: conf.content
                })
            }
        )
    }
}

window.addEventListener('message', getMessage)
let appheight = -1

setInterval(() => {
    const app = document.getElementById('app') as HTMLDivElement
    if (appheight !== app.offsetHeight) {
        appheight = app.offsetHeight
        sendParentMessage({
            action: 'setEditorHeight',
            data: appheight
        })
    }
}, 50)

onMounted(() => {
    sendParentMessage({
        action: 'openEditor'
    })
})
</script>
<style lang="less" scoped></style>
