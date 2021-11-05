export const ListPageMixin = {
	props: {
		paginate: {
			type: Boolean,
			default: true,
		},
		showHeader: {
			type: Boolean,
			default: true,
		},

		showFooter: {
			type: Boolean,
			default: true,
		},
		showBreadcrumbs: {
			type: Boolean,
			default: true,
		},
		showSearch: {
			type: Boolean,
			default: true,
		},
		addButton: {
			type: Boolean,
			default: true,
		},
		editButton: {
			type: Boolean,
			default: true,
		},
		deleteButton: {
			type: Boolean,
			default: true,
		},
		viewButton: {
			type: Boolean,
			default: true,
		},

		exportButton: {
			type: Boolean,
			default: true,
		},
		importButton: {
			type: Boolean,
			default: false,
		},
		listSequence: {
			type: Boolean,
			default: true,
		},
		multiCheckbox: {
			type: Boolean,
			default: true,
		},
		emptyRecordMsg: {
			type: String,
			default: "No record found",
		},
		msgBeforeDelete: {
			type: String,
			default: "Are you sure you want to delete this record?",
		},
		msgAfterDelete: {
			type: String,
			default: "Record deleted successfully",
		},
		page: {
			type: Number,
			default: 1,
		},
		limit: {
			type: Number,
			default: 10,
		},
		search: {
			type: String,
			default: '',
		},
		fieldName: String,
		fieldValue: String,
		sortBy: {
			type: String,
			default: '',
		},
		sortType: {
			type: String,
			default: '', //desc or asc
		},
		exportFormats: {
			type: Array,
			default: function () { return ['print', 'pdf', 'csv', 'excel'] },
		},
	},
	data: function () {
		return {
			totalRecords: 0,
			recordCount: 0,
			loading: false,
			ready: false,
			singleSelect: false,
			selectedItems: [],
			pagination: {
				page: 1,
				rowsPerPage: 20,
				sortBy: '',
				rowsNumber: 10,
				descending: true,

			},
			deleting: false,
			includeFilters: true,
			filters: {},
			filtersLabel: {},
			searchText: '',
			errorMsg: ''
		}
	},
	computed: {
		apiUrl: function () {
			let path = this.apiPath;
			if (this.fieldName) {
				path = path + '/' + encodeURIComponent(this.fieldName) + '/' + encodeURIComponent(this.fieldValue);
			}
			let route = this.$route.query;


			if (this.sortBy) {
				this.pagination.sortBy = this.sortBy;
			}
			else if (route.sortby) {
				this.pagination.sortBy = route.sortby;
			}

			if (this.sortType) {
				this.pagination.descending = (this.sortType.toLowerCase() == 'desc');
			}
			else if (route.sorttype) {
				this.pagination.descending = (route.sorttype.toLowerCase() == 'desc');
			}

			if (route.search) {
				this.searchText = route.search;
			}
			let orderType = this.pagination.descending ? 'desc' : 'asc';
			let query = {
				page: this.pagination.page,
				limit: this.pagination.rowsPerPage,
				orderby: this.pagination.sortBy ?? '',
				ordertype: orderType,
			};

			if (this.searchText) {
				query.search = this.searchText;
			}
			let filters = this.filters;
			for (var key in filters) {
				if (filters[key] && filters[key].toString() != '') {
					query[key] = filters[key]
				}
			}
			
			const queryParams = this.$utils.serializeQuery(query);
			return path + "?" + queryParams;
		},
		recordsPosition: function () {
			return Math.min(this.pagination.page * this.pagination.rowsPerPage, this.totalRecords);
		},
		totalPages: function () {
			if (this.totalRecords > this.pagination.rowsPerPage) {
				return Math.ceil(this.totalRecords / this.pagination.rowsPerPage);
			}
			return 1;
		},

		finishedLoading: function () {
			if (this.recordCount < this.pagination.rowsPerPage && this.records.length) {
				return true;
			}
			return false;
		},
		canLoadMore: function () {
			if (this.loading || this.finishedLoading) {
				return false;
			}
			return true;
		},
	},
	methods: {
		setPagination: function (props) {
			let { page, rowsPerPage, rowsNumber, sortBy, descending } = props.pagination
			this.pagination.sortBy = sortBy;
			this.pagination.descending = descending;
		},
		reload: function () {
			this.records = []
			let query = this.$route.query;
			if (query.limit) {
				this.limit = query.limit;
			}
			if (query.page) {
				this.page = query.page;
			}
			if (query.sortby) {
				this.pagination.sortBy = query.sortby;
			}
			if (query.sorttype) {
				this.pagination.descending = (query.sorttype == 'desc');
			}
			if (query.search) {
				this.searchText = query.search;
			}
			this.pagination.rowsPerPage = this.limit;
			this.pagination.page = this.page;
			this.load();
		},
		doSearch: function () {
			this.includeFilters = false;
		},
		deleteItem: function (id) {
			if (Array.isArray(id)) {
				id = id.map(value => value[this.primaryKey]);
			}
			if (id) {
				let title = "Delete record";
				let prompt = this.msgBeforeDelete;
				this.$q.dialog({
					title: title,
					message: prompt,
					cancel: true,
					persistent: true
				}).onOk(() => {
					var url = this.pageName + '/delete/' + id.toString()
					var data = { id, url };
					this.deleteRecord(data).then(
						(response) => {
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
	},
	mounted: function () {
		this.showError = false;
		this.singleSelect = !this.multiCheckbox;
		this.reload();
	},
	created: function () {
		this.$on('RefreshPage', () => {
			this.load();
		});
	},
}