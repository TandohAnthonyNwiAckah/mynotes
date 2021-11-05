<template>
	<div class="relative-position">
		<api-data-source :api-path="apiPath" v-slot="apiProp">
			<q-input @focus="showResult()" debounce="1000" v-bind="$attrs" v-model="searchText">
				<template v-if="icon" v-slot:append>
					<q-icon :name="icon"></q-icon>
				</template>
			</q-input>
			<q-popup-proxy :content-class="menuClass" :auto-close="autoClose" fit no-focus breakpoint="0" :target="true" no-parent-event v-model="show">
				<slot :records="getRecords(apiProp.response)" :searchText="searchText" :loading="apiProp.loading"></slot>
			</q-popup-proxy>
		</api-data-source>
	</div>
</template>
<script>
	export default {
		props: {
			searchPage: {
				type: String,
				default: ''
			},
			menuClass: {
				type: String,
				default: ''
			},
			icon: {
				type: String,
				default: ''
			},
			autoClose: {
				type: Boolean,
				default: true
			},
		},
		data: function() {
			return {
				searchText: '',
				show: false,
			}
		},
		computed: {
			apiPath () {
				let search = this.searchText;
				if(search){
					let qs = this.$utils.serializeQuery({ search });
					return this.searchPage + "?" + qs;
				}
				return "";
			},
		},
		methods: {
			getRecords (response) {
				if (response.records){
					return response.records;
				}
				return [];
			},
			showResult () {
				this.show = this.searchText != '';
				return this.show;
			},
			hideResult () {
				this.show = false;
			},
		},
		watch: {
			searchText: function() {
                this.showResult();
			},
		},
	};
</script>
