// noinspection JSAnnotator
// noinspection JSAnnotator
import Vue from 'vue';

import AutoCompleteSelect from 'components/AutoCompleteSelect.vue';
import PageSearch from 'components/PageSearch.vue';
import QUploaderInput from 'components/QUploaderInput.vue';
import ApiDataSource from 'components/ApiDataSource.vue';
import InlineEdit from 'components/InlineEdit.vue';
import RecordCount from 'components/RecordCount.vue';
import CheckDuplicate from 'components/CheckDuplicate.vue';
import ImageViewer from 'components/ImageViewer.vue';
import FileViewer from 'components/FileViewer.vue';
import FullQEditor from 'components/FullQEditor.vue';
import ImportData from 'components/ImportData.vue';
import MasterDetailBtn from 'components/MasterDetailBtn.vue';
import LangSwitcher from 'components/LangSwitcher.vue';

import { ValidationProvider, ValidationObserver, extend } from "vee-validate";

import * as rules from 'vee-validate/dist/rules';
// loop over all rules
for (let rule in rules) {
	extend(rule, rules[rule]);
}

import { utils } from './utils';
import { StorageService } from './services/storage';
import { ApiService } from './services/api';
import { AppMenus } from './menus';

Vue.config.productionTip = false;

Vue.prototype.$EventBus = new Vue(); // Global event bus




Vue.prototype.$appName = process.env.APP_NAME;


const apiUrl = process.env.API_URL; //get the api base url
Vue.prototype.$apiUrl = apiUrl;


const apiPath = process.env.API_PATH; //get the the api path
Vue.prototype.$apiPath = apiPath;


ApiService.init(apiPath);
//axio api service use for making api request
Vue.prototype.$api = ApiService;

//save data to localstorage
Vue.prototype.$localStore = StorageService;

//all application menu
Vue.prototype.$menus = AppMenus;

Vue.prototype.$utils = utils;


Vue.component('AutoCompleteSelect', AutoCompleteSelect);
Vue.component('PageSearch', PageSearch);
Vue.component('InlineEdit', InlineEdit);
Vue.component('ApiDataSource', ApiDataSource);
Vue.component('QUploaderInput', QUploaderInput);
Vue.component('RecordCount', RecordCount);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('CheckDuplicate', CheckDuplicate);
Vue.component('FileViewer', FileViewer);
Vue.component('ImageViewer', ImageViewer);
Vue.component('FullQEditor', FullQEditor);
Vue.component('ImportData', ImportData);
Vue.component('MasterDetailBtn', MasterDetailBtn);
Vue.component('LangSwitcher', LangSwitcher);