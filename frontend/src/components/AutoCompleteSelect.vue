<template>
	<q-select
		:label="label"
		v-bind="$attrs"
		:loading="loading"
        v-model="model"
        use-input
		hide-selected
        fill-input
		emit-value 
		map-options
        :options="options"
        @filter="filterFn"
        @input="emitValue"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
</template>
<script>

export default {
	props: {
		apiPath: {
			type: String,
			default: ''
		},
		label: {
			type: String,
			default: ''
		},
		error: {
			type: Boolean,
			default: false
		},
		errorMessage: {
			type: String,
			default: ''
		},
		value: ''
	},
    data: function() {
        return {
			loading: false,
			model: null,
            options: []
        }
    },
    methods: {
        filterFn (val, update, abort) {
			if (!val) {
				abort()
				return
			}
			let qs = this.$utils.serializeQuery({search: val});
			let url = this.apiPath+ "?" + qs;
			this.loading = true;
			this.$api.get(url).then((response) => {
				this.loading = false;
				update(
					() => {
						this.options =  response.data ;
					}
				)
			},
			(response) => {
				this.loading = false;
			});
		},
		emitValue () {
			this.$emit('input', this.model)
		},
    },
	mounted() {
		if(this.value){
			this.model = this.value;
		}
	},
};
</script>