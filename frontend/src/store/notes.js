

import { ApiService } from '../services/api'
export const notes = {
	namespaced: true,
	state: {
		currentRecord: {},
		records: [],
		requestError: null,
	},
	getters: {
		records(state) {
			return state.records
		},
	},
	mutations: {
		setRecords(state, records) {
			state.records = records
		},
		mergeRecords(state, records) {
			state.records = state.records.concat(records);
		},
		addRecord(state, record) {
			if(Array.isArray(record)){
				for (let index = 0; index < record.length; index++) {
					state.records.unshift(record[index]);
				}
			}
			else{
				state.records.unshift(record);
				state.currentRecord = record;
			}
		},
		updateRecord(state, record) {
			const item = state.records.find(item => item[''] === record['']);
			if(item){
				Object.assign(item, record);
			}
		},
		deleteRecord(state, id) {
			if(Array.isArray(id)){
				id.forEach((itemId) => {
					let itemIndex = state.records.findIndex(item => item[''] == itemId);
					if(itemIndex!=-1){
						state.records.splice(itemIndex, 1);
					}
				})
			}
			else{
				let itemIndex = state.records.findIndex(item => item[''] == id);
				if(itemIndex!=-1){
					state.records.splice(itemIndex, 1);
				}
			}
		},
		setError(state, errors) {
			state.requestError = error
		},
	},
	actions: {
		fetchRecords: ({ commit }, payload) => {
			return new Promise((resolve, reject) => {
				let url = payload.url;
				let merge = payload.merge;
				ApiService.get(url).then(resp => {
					let data = resp.data;
					if (data.records) {
						let records = data.records;
						if (merge){
							commit("mergeRecords", records);
						}
						else{
							commit("setRecords", records);
						}
						resolve(data);
					}
					else {
						reject("invalid json data");
					}
				}).catch(err => {
					reject(err)
				})
			})
		},
		fetchRecord: ({ commit }, url) => {
			return new Promise((resolve, reject) => {
				ApiService.get(url).then(resp => {
					resolve(resp)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		saveRecord: ({ commit }, data) => {
			return new Promise((resolve, reject) => {
				let url = data.url;
				let payload = data.payload;
				ApiService.post(url, payload).then(resp => {
					let record = resp.data;
					commit("addRecord", record);
					resolve(resp);
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		updateRecord: ({ commit }, data) => {
			return new Promise((resolve, reject) => {
				let url = data.url;
				let payload = data.payload;
				ApiService.post(url, payload).then(resp => {
					let record = resp.data;
					commit("updateRecord", record);
					resolve(resp)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		deleteRecord: ({ commit }, data) => {
			return new Promise((resolve, reject) => {
				let url = data.url;
				let id = data.id;
				ApiService.get(url).then(resp => {
					commit("deleteRecord", id);
					resolve(resp);
				})
				.catch(err => {
					reject(err)
				})
			})
		},
	}
}
