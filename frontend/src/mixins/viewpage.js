export const ViewPageMixin = {
	props: {
		id: [String, Number],
		fieldName: {
			type: String,
			default: '',
		},
		fieldValue: {
			type: String,
			default: '',
		},
		editButton: {
			type: Boolean,
			default: true,
		},
		deleteButton: {
			type: Boolean,
			default: true,
		},
		exportButton: {
			type: Boolean,
			default: true,
		},
		msgBeforeDelete: {
			type: String,
			default: "Are you sure you want to delete this record?",
		},
		msgAfterDelete: {
			type: String,
			default: "Record deleted successfully",
		},
		showHeader: {
			type: Boolean,
			default: true,
		},
		showFooter: {
			type: Boolean,
			default: true,
		},
	},
	data: function () {
		return {
			filterBy: '',
			filterValue: '',
			ready: false,
			loading: false,
			showError: false,
			errorMsg: '',

		}
	},
	computed: {
		apiUrl: function () {
			if(this.id){
				let id = encodeURIComponent(this.id);
				let path = `/${this.pagePath}/${id}`;
				let query = this.$route.query;
				let queryParams = this.$utils.serializeQuery(query);
				if(queryParams){
					path += "?" + queryParams;
				}
				return path
			}
			return this.apiPath;
		},
	},
	methods: {
		load: function (apiUrl) {
			if (!this.loading) {
				this.loading = true;
				this.ready = false; // hide other components until main page is ready
				this.item = null;
				let url = apiUrl ?? this.apiUrl;
				this.$api.get(url).then(
					response => {
						this.loading = false;
						this.ready = true; // show other components
						this.item = response.data
					},
					response => {
						this.loading = false;
						this.showPageRequestError(response);
					}
				);
			}
		},
		deleteItem: function (id) {
			if (id) {
				let title = "Delete record";
				let prompt = this.msgBeforeDelete;
				this.$q.dialog({
					title: title,
					message: prompt,
					cancel: true,
					persistent: true
				}).onOk(() => {
					let url = this.pageName + '/delete/' + id
					let data = { id, url };
					this.deleteRecord(data).then(
						(response) => {
							if(this.isDialogOpen){
								this.closeDialogs()
							}
							else{
								this.$router.back();
							}
							this.flashMsg(this.msgAfterDelete);
						},
						(response) => {
							this.showPageRequestError(response);
						});
				}).onCancel(() => {
					// console.log('>>>> Cancel')
				}).onDismiss(() => {
					// console.log('I am triggered on both OK and Cancel')
				})
			}
		},
		exportRecord: function () {
			this.exportPage(this.$refs.datatable.innerHTML, this.pageTitle);
		},

		moveRecord: function (recid) {
			let id = encodeURIComponent(recid);
			let path = `/${this.pagePath}/${id}`;
			this.load(path);
		},
		moveToNextRecord: function () {
			this.moveRecord(this.item.nextRecordId);
		},
		moveToPreviousRecord: function () {
			this.moveRecord(this.item.previousRecordId);
		},
		
	},
	watch: {
		apiUrl: function () {
			this.load();
		},
	},
	created: function () {

	},
	mounted: function () {
		this.filterBy = this.fieldName;
		this.filterValue = this.fieldValue;
		this.load();
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	},
}