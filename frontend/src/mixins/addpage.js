export const AddPageMixin = {
	props: {
		msgAfterSave: {
			type: String,
			default: "Record added successfully",
		},
		showHeader: {
			type: Boolean,
			default: true,
		},
		showSubmitButton: {
			type: Boolean,
			default: true,
		},
		modelBind: {
			type: Object,
			default: function () { return {} }
		}
	},
	data: function () {
		return {
			record: {},
			inputSearch: "",
			id: "",
			saving: false,
			ready: false,
			isPwd: true,
		}
	},
	computed: {
		apiUrl: function () {
			return this.apiPath;
		},
	},
	watch: {
		modelBind: function () {
			this.updateFormData();
		}
	},
	methods: {
		async submit() {
			const isFormValid = await this.$refs.observer.validate();
			if (isFormValid) {
				this.saving = true;
				let payload = this.normalizedFormData();
				let url = this.apiUrl;
				let data = { url, payload }
				this.saveRecord(data).then((response) => {
					this.record = response.data
					this.saving = false;
					this.closeDialogs();// close page dialog that if opened
					this.$emit("submited", this.record);
				},
					(response) => {
						this.saving = false;
						this.$emit("error", response);
					});
			}
		},
		updateFormData: function () {
			for (const key in this.modelBind) {
				this.formData[key] = this.modelBind[key];
			}
		},
		uploadcompleted: function (arg) {
			this.formData[arg.field] = arg.result;
		},

	},
	created: function () {

	},
	mounted: function () {
		this.updateFormData();
		this.showError = false;
		this.ready = true;
	},
}