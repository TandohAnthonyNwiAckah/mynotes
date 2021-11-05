export const EditPageMixin = {
	props: {
		id: [String, Number],
		msgAfterUpdate: {
			type: String,
			default: "Record updated successfully",
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
			inputSearch: "",
			errorMsg: "",
			loading: false,
			ready: false,
			saving: false,
			record: {},
		}
	},
	computed: {
		apiUrl: function () {
			if(this.id){
				return this.apiPath + '/' + encodeURIComponent(this.id);
			}
			return this.apiPath;
		},
	},
	methods: {
		async submit() {
			const isFormValid = await this.$refs.observer.validate();
			if (isFormValid) {
				this.saving = true;
				let id = this.id;
				let url = this.apiUrl;
				let payload = this.normalizedFormData();
				let data = { id, url, payload }
				this.updateRecord(data).then((response) => {
					this.record = response.data
					this.saving = false;
					this.closeDialogs();// close page dialog that if opened
					this.$emit("submited", this.id);
				},
					(response) => {
						this.saving = false;
						this.$emit("error", response);
					});
			}
		},
		load: function () {
			var url = this.apiUrl;
			this.loading = true;
			this.ready = false; // hide other components until main page is ready
			this.$api.get(url).then((response) => {
				this.loading = false;
				this.ready = true;
				this.formData = response.data;
				this.updateFormFields();
			},
				(response) => {
					this.resetForm();
					this.loading = false;
					this.showPageRequestError(response);
				}
			);
		},
	},
	watch: {
		$route(to, from) {
			//only fetch data when navigated to this page
			if (to.name == this.routeName) {
				this.load();
			}
		},
		apiUrl: function () {
			this.load();
		},
		modelBind: function () {
			for (key in this.modelBind) {
				this.formData[key] = this.modelBind[key];
			}
		}
	},
	mounted: function () {
		this.load();
	},
}