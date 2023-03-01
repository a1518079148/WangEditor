<template>
    <div class="editor">
        <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            mode="default"
        />
        <Editor
            :style="{ height: height }"
            style="overflow-y: hidden"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            mode="default"
            @onCreated="handleCreated"
        />
    </div>
</template>

<script lang="ts" setup>
import { IToolbarConfig } from '@wangeditor/editor'
//@ts-ignore
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import CookieUtil from '~/utils/CookieUtil'

const props = defineProps({
    content: { default: '<p></p>' },
    height: { default: '300px' }
})

const emit = defineEmits(['update:content'])
const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: [
        'insertLink',
        'insertTable',
        'headerSelect',
        'italic',
        'fullScreen',
        'group-more-style' // 排除菜单组，写菜单组 key 的值即可
    ]
}

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref(props.content)

watch(
    () => props.content,
    () => {
        if (props.content != valueHtml.value) valueHtml.value = props.content
    }
)

watch(valueHtml, () => {
    emit('update:content', valueHtml.value)
})

const getToken = () => {
    return CookieUtil.get('token')
}

const upToken = (token: any) => {
    if (token) if (token.length > 24) setToken(token.substring(0, token.length - 1))
}

const setToken = (token: string) => {
    CookieUtil.set('token', token)
}

const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
        uploadImage: {
            fieldName: 'file',
            maxFileSize: 50 * 1024 * 1024,
            server: '/file/uploadFile',
            maxNumberOfFiles: 1,
            headers: {
                token: getToken()
            },
            withCredentials: true,
            timeout: 60 * 1000,
            customInsert(res: any, insertFn: any) {
                upToken(res.tag)
                if (res.code == 200) insertFn(res.data, undefined, undefined)
            },
            base64LimitSize: 50 * 1024
        },
        uploadVideo: {
            fieldName: 'file',
            maxFileSize: 100 * 1024 * 1024,
            server: '/file/uploadFile',
            maxNumberOfFiles: 1,
            headers: {
                token: getToken()
            },
            withCredentials: true,
            timeout: 6000 * 1000,
            customInsert(res: any, insertFn: any) {
                upToken(res.tag)
                if (res.code == 200) insertFn(res.data, undefined, undefined)
            }
        }
    }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor: any) => {
    // console.log(editor.getAllMenuKeys());
    editorRef.value = editor // 记录 editor 实例，重要！
    //@ts-ignore
    document.activeElement.blur() //安卓不聚焦
    // console.log(editor.getAllMenuKeys())
}
</script>
<style lang="less" scoped>
.editor {
    &:deep(.w-e-bar-item) {
        height: 30px;
        padding: 0px;
    }

    &:deep(.w-e-bar-divider) {
        display: none;
    }

    &:deep(.w-e-bar-item-group .w-e-bar-item-menus-container) {
        margin-top: 30px;
    }
}
</style>
