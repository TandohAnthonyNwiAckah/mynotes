<template>
    <div class="main-page">
        <template v-if="showHeader">
            <q-card bordered   class="page-section q-py-sm q-px-md q-mb-md nice-shadow-18">
                <div class="container">
                    <div class="row justify-between q-col-gutter-md">
                        <div class="col-12 col-md-auto ">
                            <div class="">
                                <div class="row  items-center q-col-gutter-sm q-px-sm">
                                    <div class="col">
                                        <div class="text-h6 text-primary">Notes Details</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </q-card>
        </template>
        <section class="page-section q-mb-md">
            <div class="container">
                <div class="row q-col-gutter-md">
                    <div class="col comp-grid">
                        <q-card bordered   class=" nice-shadow-18">
                            <div>
                                <div class="relative-position" style="min-height:200px">
                                    <template v-if="!loading && item">
                                        <q-item>
                                            <q-item-section>
                                                <q-item-label caption>TITLE: </q-item-label>
                                                <q-item-label class="text-bold">{{ item.title }}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                        <q-separator></q-separator>
                                        <q-item>
                                            <q-item-section>
                                                <q-item-label caption>NOTES: </q-item-label>
                                                <q-item-label class="text-bold">{{ item.notes }}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                        <q-separator></q-separator>
                                        <q-item>
                                            <q-item-section>
                                                <q-item-label caption>LANGUAGE: </q-item-label>
                                                <q-item-label class="text-bold">{{ item.languagecode }}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                        <q-separator></q-separator>
                                        <q-card-actions class="row q-col-gutter-xs justify-end">
                                            <q-btn icon="menu" padding="xs" round flat color="grey">
                                                <q-menu transition-show="flip-right"  transition-hide="flip-left" self="center middle" anchor="center middle">
                                                    <q-list dense rounded nav>


                                                        <!--<q-item link clickable v-ripple :to="`/notes/edit/${item.title}`">-->
                                                            <!--<q-item-section>-->
                                                                <!--<q-icon color="positive"  size="sm" name="edit"></q-icon>-->
                                                            <!--</q-item-section>-->
                                                            <!--<q-item-section>Edit</q-item-section>-->
                                                        <!--</q-item>-->



                                                        <q-item link clickable v-ripple @click="deleteItem(item.title)">
                                                            <q-item-section>
                                                                <q-icon color="negative"  size="sm" name="clear"></q-icon>
                                                            </q-item-section>
                                                            <q-item-section>Delete</q-item-section>
                                                        </q-item>
                                                    </q-list>
                                                </q-menu>
                                            </q-btn>
                                        </q-card-actions>
                                    </template>
                                    <template v-if="loading">
                                        <div class="q-pa-sm text-center">
                                            <q-inner-loading :showing="loading">
                                                <q-spinner :size="40" color="primary" indeterminate>
                                                </q-spinner>
                                            </q-inner-loading>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </q-card>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script>
	import { PageMixin } from "../../mixins/page.js";
	import { ViewPageMixin } from "../../mixins/viewpage.js";
	import { mapActions, mapGetters, mapState } from "vuex";
	export default {
		name: 'viewNotesPage',
		components: {
		},
		mixins: [PageMixin, ViewPageMixin ],
		props: {
			pageName: {
				type : String,
				default : 'notes',
			},
			idName: {
				type: String,
				default: '',
			},
			routeName : {
				type : String,
				default : 'notesview',
			},
			pagePath: {
				type : String,
				default : 'notes/view',
			},
			apiPath: {
				type : String,
				default : 'notes/view',
			},
		},
		data() {
            return {
				item: {
					default :{
					},
				},
			}
		},
		computed: {
			pageTitle:{
				get: function () {
					return "Notes Details"
				}
			}
		},
		meta () {
			return {
				title: this.pageTitle
			}
		},
		methods: {
			...mapActions("notes", [ "fetchRecord", "deleteRecord"]),
		},
		watch: {
			$route (to, from){
				//only fetch data when navigated to this page
				if(to.name == this.routeName){
					this.load();
				}
			},
		},
	};
</script>
<style scoped>
</style>
