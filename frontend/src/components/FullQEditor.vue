<template>
    <div>
        <q-editor
            ref="editor"
            v-model="qeditor"
            @input="update"
            :dense="$q.screen.lt.md"
            :definitions="{
                upload: {
                    tip: 'Insert image',
                    icon: 'photo',
                    handler: showImageDialog,
                },
            }"
            :toolbar="[
                ['left', 'center', 'right', 'justify'],
                [
                    'bold',
                    'italic',
                    'strike',
                    'underline',
                    'subscript',
                    'superscript',
                ],
                ['hr', 'link', 'upload'],
                [
                    {
                        icon: $q.iconSet.editor.fontSize,
                        fixedLabel: true,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                            'size-1',
                            'size-2',
                            'size-3',
                            'size-4',
                            'size-5',
                            'size-6',
                            'size-7',
                        ],
                    },
                    'removeFormat',
                ],
                ['quote', 'unordered', 'ordered'],

                ['undo', 'redo'],
                ['viewsource'],
            ]"
            :fonts="{
                arial: 'Arial',
                arial_black: 'Arial Black',
                comic_sans: 'Comic Sans MS',
                courier_new: 'Courier New',
                impact: 'Impact',
                lucida_grande: 'Lucida Grande',
                times_new_roman: 'Times New Roman',
                verdana: 'Verdana',
            }"
        >
        </q-editor>
        <q-dialog v-model="imageDialog">
            <q-card style="width: 500px; max-width: 80vw">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">Insert Image</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-card-section>
                    <div class="q-mb-md">
                        <q-input
                            ref="imageUrl"
                            v-model="imageUrl"
                            outlined
                            dense
                            placeholder="Enter Image Url"
                            label="Image Url"
                        />
                    </div>
                    <div class="row q-col-gutter-md">
                        <div class="col">
                            <q-input
                                v-model="imageWidth"
                                outlined
                                dense
                                placeholder="Width"
                                label="Width"
                            />
                        </div>
                        <div class="col">
                            <q-input
                                v-model="imageHeight"
                                outlined
                                dense
                                placeholder="Height"
                                label="Height"
                            />
                        </div>
                    </div>
                </q-card-section>
                <q-card-actions align="center">
                    <q-btn
                        @click="insertImage"
                        color="primary"
                        flat
                        label="Insert Image"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
export default {
    props: {
        value: "",
    },
    data: function () {
        return {
            qeditor: "",
            imageDialog: false,
            imageWidth: "",
            imageHeight: "",
            imageUrl: "",
        };
    },
    methods: {
        saveWork() {
            this.$q.notify({
                message: "Saved your text to local storage",
                color: "green-4",
                textColor: "white",
                icon: "cloud_done",
            });
        },
        update() {
            this.$emit('input', this.qeditor)
        },
        showImageDialog() {
            this.imageDialog = true;
        },
        insertImage() {
            if (this.imageUrl) {
                this.imageDialog = false;
                const edit = this.$refs.editor;
                edit.caret.restore();
                edit.runCmd(
                    "insertHTML",
                    `<img width="${this.imageWidth}" height="${this.imageHeight}" src="${this.imageUrl}"/>`
                );
                edit.focus();
            } else {
                this.$refs.imageUrl.focus();
            }
        },
    },
    mounted:function(){
        this.qeditor = this.value;
    },
};
</script>
