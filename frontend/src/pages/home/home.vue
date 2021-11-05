<template>
    <q-page  class="main-page">
        <section class="page-section q-pa-md">
            <div class="container-fluid">
                <div class="row q-col-gutter-md">
                    <div class="col comp-grid">
                        <div class="">
                            <div class="row  items-center q-col-gutter-sm q-px-sm">
                                <div class="col">
                                    <div class="text-h6 text-bold">Home</div>
                                </div>
                            </div>
                        </div>
                        <q-separator class="q-my-sm"></q-separator>
                    </div>
                </div>
            </div>
        </section>
        <section class="page-section q-mb-md">
            <div class="container-fluid">
                <div class="row q-col-gutter-md">
                    <div class="col-sm-4 col-md-4 col-12 comp-grid">
                        <record-count api-path="components_data/getcount_notes" max="" v-slot="record">
                        <q-btn align="left"  unelevated    :rounded="true"  block no-caps text-color="white" color="red" :to="`notes`" padding="md" class="full-width animated zoomIn">
                            <q-icon class=" q-mr-md" color="blue-1" style="opacity:1" size="40px" name="event_note"></q-icon>
                            <div class="flex-column text-left">
                                <div class="text-bold">NOTES</div>
                                <div class="text-caption">Total English </div>
                            </div>
                            <div class="text-h5 absolute-top-right q-ma-md q-mt-lg">
                                <span v-if="!record.loading">{{ record.num }}</span>
                                <q-spinner v-else size="14px" />
                            </div>
                        </q-btn>
                        </record-count>
                    </div>
                    <div class="col-sm-4 col-md-4 col-12 comp-grid">
                        <record-count api-path="components_data/getcount_remarque" max="" v-slot="record">
                        <q-btn align="left"  unelevated    :rounded="true"  block no-caps text-color="white" color="yellow" :to="`notes`" padding="md" class="full-width animated zoomIn">
                            <q-icon class=" q-mr-md" color="white" style="opacity:1" size="40px" name="library_books"></q-icon>
                            <div class="flex-column text-left">
                                <div class="text-bold">REMARQUE</div>
                                <div class="text-caption">Totale French</div>
                            </div>
                            <div class="text-h5 absolute-top-right q-ma-md q-mt-lg">
                                <span v-if="!record.loading">{{ record.num }}</span>
                                <q-spinner v-else size="14px" />
                            </div>
                        </q-btn>
                        </record-count>
                    </div>
                    <div class="col-sm-4 col-md-4 col-12 comp-grid">
                        <record-count api-path="components_data/getcount_all" max="" v-slot="record">
                        <q-btn align="left"  unelevated    :rounded="true"  block no-caps text-color="white" color="green" :to="`notes`" padding="md" class="full-width animated zoomIn">
                            <q-icon class=" q-mr-md" color="white" style="opacity:1" size="40px" name="all_inclusive"></q-icon>
                            <div class="flex-column text-left">
                                <div class="text-bold">ALL</div>
                                <div class="text-caption">All Notes</div>
                            </div>
                            <div class="text-h5 absolute-top-right q-ma-md q-mt-lg">
                                <span v-if="!record.loading">{{ record.num }}</span>
                                <q-spinner v-else size="14px" />
                            </div>
                        </q-btn>
                        </record-count>
                    </div>
                </div>
            </div>
        </section>
        <section class="page-section q-mb-md">
            <div class="container-fluid">
                <div class="row q-col-gutter-md">
                    <div class="col comp-grid">
                        <div class="">
                            <div class="reset-grid">
                                <list-notes-page ref="notesListPage"  :limit="10" :show-header="true" :show-breadcrumbs="true" :show-footer="true" :paginate="true" v-if="ready">
                                    </list-notes-page>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </q-page>
    </template>
    <script>
	import listNotesPage from "../notes/list.vue";
	import { PageMixin } from "../../mixins/page.js";
	export default {
		name: 'HomeComponent',
		components: {
			listNotesPage,
		},
		mixins: [PageMixin ],
		props: {
		},
		data: function() {
			return {
				ready: false,
			}
		},
		methods: {
		},
		mounted: function(){
			this.ready = true;
		}
	};
</script>
