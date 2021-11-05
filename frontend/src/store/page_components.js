export const pageComponents = {
	namespaced: true,
	state: {
		leftDrawer: true,
		leftDrawerMini: false,
		rightDrawer: false,
		pageErrors: [],
		pageComponent: '',
		pageUrl: '',
		pageDialog: false,
		imageViewerDialog: false,
		imageViewerCurrentSlide: 1,
		imageViewerImages: [],
		modelBind: {},
	},
	getters: {
		isDialogOpen(state) {
			if(state.pageDialog || state.rightDrawer){
				return true;
			}
			return false
		},
	},
	mutations: {
		setImageViewerDialog(state, value) {
			state.imageViewerDialog = value;
		},
		setImageViewerCurrentSlide(state, value) {
			state.imageViewerCurrentSlide = value;
		},
		setImageViewerImages(state, value) {
			state.imageViewerImages = value;
		},
		setLeftDrawer(state, value) {
			state.leftDrawer = value;
		},
		setLeftDrawerMini(state, value) {
			state.leftDrawerMini = value;
		},
		setRightDrawer(state, value) {
			state.rightDrawer = value;
		},
		setPageDialog(state, value) {
			state.pageDialog = value;
		},
		setPageComponent(state, value) {
			state.pageComponent = value;
		},
		setPageModelBind(state, value) {
			state.modelBind = value;
		},
		setPageUrl(state, value) {
			state.pageUrl = value;
		},
		setPageErrors(state, errors) {
			state.pageErrors = errors;
		},
	},
	actions: {
		openPageDrawer: ({ commit }, payload) => {
			const {pageUrl, pageComponent} = payload;
			let modelBind = payload.modelBind ?? {};
			commit("setPageModelBind", modelBind);
			commit("setPageUrl", pageUrl);
			commit("setPageComponent", pageComponent);
			commit("setRightDrawer", true);
		},
		openPageDialog: ({ commit }, payload) => {
			const {pageUrl, pageComponent} = payload;
			let modelBind = payload.modelBind ?? {};
			commit("setPageModelBind", modelBind);
			commit("setPageUrl", pageUrl);
			commit("setPageComponent", pageComponent);
			commit("setPageDialog", true);
		},
		openImageViewDialog: ({ commit }, payload) => {
			const {images, currentSlide} = payload;
			commit("setImageViewerDialog", true);
			commit("setImageViewerCurrentSlide", currentSlide);
			commit("setImageViewerImages", images);
		},
		showPageErrors: ({ commit }, errors) => {
			commit("setPageErrors", errors);
		},
	},
}