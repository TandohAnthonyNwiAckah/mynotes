<template>
    <span>
		<slot :dialog="dialog" :response="response"></slot>
		<q-dialog v-model="dialog" position="bottom">
			<q-card style="min-width:30vw">
				<q-uploader-input
				:label="label"
				:upload-path="uploadPath"
				accept=".csv"
				position="bottom"
				flat
				bordered
				style="width:100%"
				field-name="import"
				v-model="response"
				></q-uploader-input>
			</q-card>
		</q-dialog>
	</span>
</template>

<script>
export default {
    name: "ImportData",
    props: {
        uploadPath: {
            type: String,
            default: "filehelper/uploadfile",
        },
        label: {
            type: String,
            default: "Choose file to import",
        },
    },
    data: () => ({
        dialog: false,
        response: "",
	}),
	methods: {
		openDialog(){
			this.dialog = true;
		}
	}
};
</script>