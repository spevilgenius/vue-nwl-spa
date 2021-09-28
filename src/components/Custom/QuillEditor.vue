<template>
  <div ref="editor"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Quill from 'quill'

@Component({
  name: 'quill-editor',
  props: {
    value: {
      type: String,
      default: ''
    }
  }
})
export default class QuillEditor extends Vue {
  // gitrdone
  /* editor?: any

  mounted() {
    this.editor = new Quill(this.$refs.editor, {
      modules: {
        toolbar: [[{ header: [1, 2, 3, 4, false] }], ['bold', 'italic', 'underline']]
      },
      theme: 'bubble',
      formats: ['bold', 'underline', 'header', 'italic']
    })

    this.editor.root.innerHTML = this.$props.value
    this.editor.on('text-change', () => this.update())
  }

  public update() {
    this.$emit('input', this.editor.getText() ? this.editor.root.innerHTML : '')
  } */
}
</script>

<style></style>
