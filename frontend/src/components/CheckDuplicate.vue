<template>
    <api-data-source :api-path="apiPath" v-slot="apiProp">
		<slot :loading="apiProp.loading" :check="check" :exist="checkExits(apiProp.response)"></slot>
	</api-data-source>                 
</template>
<script>
    export default {
        props: {
            checkPath: '',
            value: '',
        },
        data: function() {
            return {
                error: '',
				loading: false,
				apiPath: '',
            };
		},
        methods: {
            check(){
				let val = this.value;
				if(val){
					this.apiPath = this.checkPath  + this.value;
				}
            },
            checkExits(val){
                // if the record already exist the backend should return true
                if(val){
                    val = val.toString().toLowerCase(); 
                    if(val === "true"){ // record already exit at the backend
                        return true;
                    }
                }
                return false;
            }
        },
    }
</script>
