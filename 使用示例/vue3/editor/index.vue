<template>
    <iframe
        :id="conf.id"
        src="/static_editor/index.html"
        style="border: 1px solid rgb(204, 204, 204); background-color: #00000000; width: 100%"
        :style="{ height: conf.height + 'px' }"
    ></iframe>
</template>

<script lang="ts" setup>
import { onUnmounted, reactive } from 'vue'

const props = defineProps({
    content: { default: '<p></p>' }
})

const emit = defineEmits(['update:content'])

const conf = reactive({
    id: 'editor-' + StrUtil.getId(),
    height: 350
})

const sendMessage = (obj: { action: string; data?: any }) => {
    const iframe = document.getElementById(conf.id) as HTMLIFrameElement
    iframe.contentWindow?.postMessage(obj, '*')
}

const getMessage = (e: any) => {
    //监听message 收到数据e.data;
    const action = e.data.action
    let data: any = e.data.data
    if (action === 'openEditor') {
        sendMessage({
            action: 'setEditor',
            data: props.content
        })
    } else if (action === 'updateEditor') {
        emit('update:content', data)
    } else if (action === 'setEditorHeight') {
        conf.height = data
    }
}

window.addEventListener('message', getMessage)
onUnmounted(() => {
    window.removeEventListener('message', getMessage)
})
</script>
<style lang="less" scoped></style>
