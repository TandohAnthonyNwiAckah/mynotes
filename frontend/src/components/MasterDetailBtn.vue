<template>
	<q-btn @click="openPage()" no-caps :padding="padding"
    :glossy="glossy"
    :round="round"
    :rounded="rounded"
    :flat="flat"
    :outline="outline"
    :color="color"
    :size="size"
    :unelevated="unelevated">
        <slot></slot>    
    </q-btn>       
</template>
<script>
	import { PageMixin } from "../mixins/page.js";
    export default {
        name: "MasterDetailBtn",
        props: {
            detailPage: {
                type: String,
                default: ''
            },
			detailPageId: null,
			pageFormData: {
                type: Object,
			    default: function () { return {} }
            },
            displayMode: {
                type: String,
                default: 'dialog' // dialog || drawer
            },

            padding: {
                type: String,
                default: "xs"
            },
            color: {
                type: String,
                default: "primary"
            },
            size: {
                type: String,
                default: ""
            },

            unelevated: {
                type: Boolean,
                default: false
            },
            flat: {
                type: Boolean,
                default: false
            },
            round: {
                type: Boolean,
                default: false
            },
            rounded: {
                type: Boolean,
                default: false
            },
            outline: {
                type: Boolean,
                default: false
            },
            glossy: {
                type: Boolean,
                default: false
            },
		},
		mixins: [PageMixin],
        data: function() {
            return {
               	showPageDialog: false,
            };
		},
        methods: {
            openPage: function() {
                if(this.displayMode == 'drawer'){
                    this.openPageDrawer(this.detailPage, {id: this.detailPageId, formData: this.pageFormData});
                }
                else{
                    this.openPageDialog(this.detailPage, {id: this.detailPageId, formData: this.pageFormData});
                }
            },
        },
        mounted: function() {
			
        },
    }
</script>