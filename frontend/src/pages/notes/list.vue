<template>
    <div class="main-page">
        <template v-if="showHeader">
            <q-card bordered   class="page-section q-py-sm q-px-md q-mb-md nice-shadow-18">
                <div class="container-fluid">
                    <div class="row justify-between q-col-gutter-md">
                        <div class="col-12 col-md-auto ">
                            <div class="">
                                <api-data-source   api-path="components_data/notes_languagecode_option_list"  v-slot="req">
                                    <div class="">
                                        <q-btn-dropdown icon="language" label="Select Language" rounded color="primary" class="full-width">
                                            <q-list dense rounded nav>
                                                <q-item v-for="(option, index) in req.response" :active="filters.notes_languagecode == option.value" :key="index" @click="setFilter(option, 'notes_languagecode')" v-ripple clickable v-close-popup>
                                                    <q-item-section>{{ option.label }}</q-item-section>
                                                </q-item>
                                            </q-list>
                                        </q-btn-dropdown>
                                    </div>
                                </api-data-source>
                            </div>
                        </div>
                        <div class="col-md-auto col-12 ">
                            <!--<q-btn       :rounded="true"  size=""  color="primary" no-caps  unelevated   :to="`/notes/add`" class="full-width">-->
                                <!--<q-icon name="add"></q-icon>                                -->
                                <!--Add New Notes -->
                            <!--</q-btn>-->
                        </div>
                        <div class="col-md-auto col-12 ">
                            <q-input debounce="1000" outlined dense  placeholder="Search" v-model="searchText">
                            <template v-slot:append>
                                <q-icon name="search"></q-icon>
                            </template>
                            </q-input>
                        </div>
                    </div>
                </div>
            </q-card>
        </template>
        <section class="page-section q-mb-md">
            <div class="container-fluid">
                <div class="row q-col-gutter-md">
                    <div class="col comp-grid">
                        <div>
                            <q-chip v-if="searchText" icon="search" removable @remove="searchText='';$route.query.search=''">
                            Search: <strong class="q-ml-sm"> {{ searchText }} </strong>
                            </q-chip>
                            <q-chip v-if="filters.notes_languagecode" removable @remove="filters.notes_languagecode = ''">
                            Languagecode:  
                            <strong class="q-ml-sm">{{ filtersLabel.notes_languagecode.toString() }}</strong>
                            </q-chip>
                        </div>
                        <div class="">
                            <div>
                                <template v-if="showBreadcrumbs">
                                    <q-breadcrumbs class="q-pa-md" v-if="searchText || fieldName">
                                        <template v-if="fieldName">
                                            <q-breadcrumbs-el v-if="$route.query.tag" icon="arrow_back" class="text-capitalize" :label="$route.query.tag" to="/notes"></q-breadcrumbs-el>
                                            <q-breadcrumbs-el v-else icon="arrow_back" class="text-capitalize" :label="fieldName|readable" to="/notes"></q-breadcrumbs-el>
                                            <q-breadcrumbs-el v-if="$route.query.label" :label="$route.query.label"></q-breadcrumbs-el>
                                            <q-breadcrumbs-el v-else :label="fieldValue"></q-breadcrumbs-el>
                                        </template>
                                    </q-breadcrumbs>
                                </template>
                                <div class="relative-position">
                                    <template >
                                        <q-table :loading="loading" hide-bottom  grid card-container-class="q-col-gutter-md justify-start" 
                                        :columns="$menus.NotesTableHeaderItems" 
                                        :data="records" 
                                        row-key="title" 
                                        :pagination.sync="pagination"
                                        @request="setPagination" 
                                        no-data-label="No Record Found">
                                        <template v-slot:item="props">
                                            <div class="col-sm-6 col-md-3 col-12">
                                                <q-card  :bordered="false" class="nice-shadow-18">
                                                    <q-item>
                                                        <q-item-section>
                                                            <q-item-label v-ripple @click="navigateTo(`/notes/view/${props.row.title}`)" class="text-primary text-bold cursor-pointer" lines="2">{{ props.row.title }}</q-item-label>
                                                            <q-item-label class="text-caption" lines="2">{{ props.row.notes }}</q-item-label>
                                                        </q-item-section>
                                                        <q-item-section side top class="text-right">
                                                            <q-card-actions class="row q-col-gutter-xs justify-end">
                                                                <q-btn icon="menu" padding="xs" round flat color="grey">
                                                                    <q-menu transition-show="flip-right"  transition-hide="flip-left" self="center middle" anchor="center middle">
                                                                        <q-list dense rounded nav>
                                                                            <q-item link clickable v-ripple :to="`/notes/view/${props.row.title}`">
                                                                                <q-item-section>
                                                                                    <q-icon color="primary"  size="sm" name="visibility"></q-icon>
                                                                                </q-item-section>
                                                                                <q-item-section>View</q-item-section>
                                                                            </q-item>


                                                                            <!--<q-item link clickable v-ripple :to="`/notes/edit/${props.row.title}`">-->
                                                                                <!--<q-item-section>-->
                                                                                    <!--<q-icon color="positive"  size="sm" name="edit"></q-icon>-->
                                                                                <!--</q-item-section>-->
                                                                                <!--<q-item-section>Edit</q-item-section>-->
                                                                            <!--</q-item>-->


                                                                            <q-item link clickable v-ripple @click="deleteItem(props.row.title)">
                                                                                <q-item-section>
                                                                                    <q-icon color="negative"  size="sm" name="clear"></q-icon>
                                                                                </q-item-section>
                                                                                <q-item-section>Delete</q-item-section>
                                                                            </q-item>
                                                                        </q-list>
                                                                    </q-menu>
                                                                </q-btn>
                                                            </q-card-actions>
                                                        </q-item-section>
                                                    </q-item>
                                                </q-card></div>
                                            </template>
                                            </q-table>
                                        </template>
                                        <template v-if="loading">
                                            <q-inner-loading :showing="loading">
                                                <q-spinner color="primary" size="30px"> 
                                                </q-spinner>
                                            </q-inner-loading>
                                        </template>
                                        <template v-if="!loading && !records.length">
                                            <q-card :flat="$q.screen.gt.md">
                                                <q-card-section>
                                                    <div class="text-grey text-h6 text-center">
                                                        No note found
                                                    </div>
                                                </q-card-section>
                                            </q-card>
                                        </template>
                                        <div v-if="showFooter" class="">
                                            <div class="q-pa-sm q-my-md" v-show="!loading">
                                                <div class="row justify-between">
                                                    <div class="row q-col-gutter-md">
                                                        <div>
                                                            <q-btn v-if="exportButton"    :rounded="true"  no-caps  unelevated   color="accent" class="q-my-xs" padding="xs" @click="openExportPage()" label="Export"  title="Export" icon="print">
                                                            </q-btn>
                                                        </div>
                                                        <div>
                                                            <import-data label="Select a file to import" ref="dataimport" upload-path="notes/importdata">
                                                            <q-btn class="q-my-xs" @click="$refs.dataimport.openDialog()" icon="import_export"    :rounded="true"  no-caps  unelevated   color="accent" padding="xs" label="Import Data" >
                                                            </q-btn>
                                                            </import-data>
                                                        </div>
                                                    </div>
                                                    <div v-if="paginate && totalRecords > 0" class="row q-col-gutter-md justify-center">
                                                        <div class="col-auto">
                                                            <q-chip>Records {{recordsPosition}} of {{totalRecords}}</q-chip>
                                                        </div>
                                                        <div>
                                                            <q-pagination  color="primary" flat glossy  input v-model="pagination.page" :direction-links="true" :boundary-links="true" :max-pages="5" :boundary-numbers="true" :max="totalPages"></q-pagination>
                                                        </div>
                                                    </div>
                                                </div>  
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </template>
    <script>
	import { PageMixin } from "../../mixins/page.js";
	import { ListPageMixin } from "../../mixins/listpage.js";
	import { mapActions, mapGetters, mapState } from "vuex";
	export default {
		name: 'listNotesPage',
		components: {
        },
		mixins: [PageMixin, ListPageMixin ],
		props: {
			primaryKey : {
				type : String,
				default : '',
			},
			pageName : {
				type : String,
				default : 'notes',
			},
			routeName : {
				type : String,
				default : 'noteslist',
			},
			apiPath : {
				type : String,
				default : 'notes/index',
			},
			importButton: {
				type: Boolean,
				default: true,
			},
			multiCheckbox: {
				type: Boolean,
				default: false,
			},
			emptyRecordMsg: {
				type: String,
				default: "No note found",
			},
			msgBeforeDelete: {
				type: String,
				default: "Are you sure you want to delete this record?",
			},
			exportFormats: {
				type: Array,
				default: function () { return ['pdf','excel','csv'] },
			},
		},
		data() {
            return {
				filters: {notes_languagecode: ''},
			filtersLabel: {},
			}
		},
		computed: {
			pageTitle:{
				get: function () {
					//set browser page title
					return "Notes"
				}
			},
			records: {
				get: function () {
					return this.$store.getters["notes/records"];
				},
				set: function (value) {
					this.$store.commit("notes/setRecords", value);
				},
			},
		},
		meta () {
			return {
				title: this.pageTitle
			}
		},
		watch: {
			apiUrl: function () {
				this.load();
			},
			$route (to, from){
				//only fetch data when navigated to this page
				if(to.name == this.routeName){
					this.load();
				}
			},
		},
		methods: {
			...mapActions("notes", ["fetchRecords", "deleteRecord"]),
			load: function() {
				if (!this.loading) {
					this.loading = true;
					let url = this.apiUrl;
					let payload = {
						url,
						merge: false
					}
					this.fetchRecords(payload).then(
						(response) => {
							this.loading = false;
							this.ready = true;
							this.totalRecords = response.total_records;
							this.recordCount = response.record_count;
							this.pagination.rowsNumber = this.totalRecords;
							window.scrollTo(0, 0);
						},
						(response) => {
							this.loading = false;
							this.showPageRequestError(response);
						}
					);
				}
			},	
		},
	};
</script>
<style scoped>
</style>
