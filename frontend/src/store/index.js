import Vue from 'vue'
import Vuex from 'vuex'
import { pageComponents } from "./page_components.js"
import { notes } from "./notes.js"
Vue.use(Vuex)
export default function (/* { ssrContext } */) {
	const Store = new Vuex.Store({
		modules: {
			pageComponents,
			notes
		},
		// enable strict mode (adds overhead!)
		// for dev mode only
		strict: process.env.DEV
	})
	return Store
}