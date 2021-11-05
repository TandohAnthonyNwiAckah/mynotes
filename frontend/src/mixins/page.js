export const PageMixin = {
	data : function() {
		return {
			inputSearch : "",
		}
	},
	computed: {
		isDialogOpen: function () {
			return this.$store.getters["pageComponents/isDialogOpen"];
		},
	},
	methods: {
		openPageDialog: function (pageComponent, pageUrl, modelBind) {
			this.$store.commit("pageComponents/setRightDrawer", false);
			this.$store.dispatch('pageComponents/openPageDialog', {pageComponent, pageUrl, modelBind});
		},
		openPageDrawer: function (pageComponent, pageUrl, modelBind) {
			this.$store.commit("pageComponents/setPageDialog", false);
			this.$store.dispatch('pageComponents/openPageDrawer', {pageComponent, pageUrl, modelBind});
		},
		closeDialogs: function () {
			this.$store.commit("pageComponents/setRightDrawer", false);
			this.$store.commit("pageComponents/setPageDialog", false);
		},
		setPageTitle: function (title, pagename) {
			document.title = title;
		},
		flashMsg: function (message, color, position, icon) {
			color = color || "positive";
			position = position || "top";
			icon = icon || "";
			if(message){
				this.$q.notify({
					message,
					position,
					icon,
					color
				});
			}
		},
		navigateTo: function (path) {
			if(this.$route.path !== path){
				this.$router.push(path)
			}
		},
		showPageRequestError: function (request) {
			let defaultMsg = "Error processing request!";
			let errorMsgs = [defaultMsg];
			if (request.response) {
				let error = request.response.data;
				if(Array.isArray(error)){
					errorMsgs = error;
				}
				else if(typeof(error) === 'object'){
					errorMsgs = Object.values(error);
				}
				else{
					errorMsgs = [error.toString()]
				}
			}
			this.$store.dispatch('pageComponents/showPageErrors', errorMsgs);
			
		},
		openExportPage: function () {
			let actions = [];
			this.exportFormats.forEach(format => {
				actions.push(this.$menus.exportFormats[format]);
			});
			let message = "Export";
			this.$q.bottomSheet({
				message,
				grid: false,
				actions
			}).onOk(action => {

				let exportFormat = this.$menus.exportFormats[action.id];
				let url = this.apiUrl;
				let queryParam = {
					export: action.id
				}
				let exportUrl = this.$utils.setApiPath(url, queryParam);
				let fileName = new Date().toISOString().slice(0, 10) + '-' + this.pageName + "-report." + exportFormat.ext;
				this.$api.download(exportUrl).then((response) => {
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', fileName);
					document.body.appendChild(link);
					link.click();
					link.remove();
				},
				(response) => {
					console.error(response);
					alert("Unable to download file")
				});
			}).onCancel(() => {
				// console.log('Dismissed')
			}).onDismiss(() => {
				// console.log('I am triggered on both OK and Cancel')
			})
		},
		setFilter: function(options, fieldName) {
			if(Array.isArray(options)){
				let selectedOptions = this.filters[fieldName];
				if(Array.isArray(selectedOptions)){
					let labels = [];
					for (var i in options) {
						if (selectedOptions.indexOf(options[i].value) > -1) {
							labels.push(options[i].label);
						}
					}
					this.filtersLabel[fieldName] = labels;
				}
				else if(selectedOptions.label){
					this.filtersLabel[fieldName] = selectedOptions.label;
				}
				else{
					let option = options.find(item => item.value === selectedOptions);
					this.filtersLabel[fieldName] = option.label;
				}
			}
			else if(options.label){
				this.filters[fieldName] = options.value;
				this.filtersLabel[fieldName] = options.label;
			}
			else{
				this.filters[fieldName] = options;
				this.filtersLabel[fieldName] = options;
			}
		},
		normalizedFormData: function(){
			let payload = this.formData || this.arrFormData;
			if(Array.isArray(payload)){
				payload.forEach(function(obj){
					Object.keys(obj).forEach(function(key){
						if(Array.isArray(obj[key])){
							obj[key] = obj[key].toString()
						}
					});
				})
			}
			else{
				Object.keys(payload).forEach(function(key){
					if(Array.isArray(payload[key])){
						payload[key] = payload[key].toString()
					}
				});
			}
			return payload;
		},
		mapOptionField: function(response, fieldname){
			let currentValue = this.formData[fieldname];
			if(currentValue){
				if(Array.isArray(currentValue)){
					let mapSelectedOptions = [];
					let mapSelectedOptionsValue = [];
					currentValue.forEach( val =>{
						let option = response.find(v => v.value == val);
						mapSelectedOptions.push(option);
						mapSelectedOptionsValue.push(option.value)
					});
					this.formData[fieldname] = mapSelectedOptions; // update the select label
					this.formData[fieldname] = mapSelectedOptionsValue; // this will emit the value.
				}
				else{
					let mapSelectedOption = response.find(v => v.value == currentValue);
					this.formData[fieldname] = mapSelectedOption; // update the select label
					this.formData[fieldname] = mapSelectedOption.value;  // this will emit the value.
				}
			}
		},
		
	}
}