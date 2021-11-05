<template>
    <div>
		<slot :num="num" :maxValue="maxValue" :percent="percent" :loading="loading"></slot>
	</div>                 
</template>
<script>
    export default {
        props: {
            apiPath: '',
            max: '',
        },
        data: function() {
            return {
                num: 0,
                maxValue: 100,
                loading: false,
            };
		},
		computed:  {
           percent(){
			   let percent =Math.round((this.num / this.maxValue) * 100);
			   return percent;
		   }
        },
        methods: {
            getRecordCount: function() {
                if(this.apiPath){
                    var url = this.apiPath;
					this.loading = true;
					
                    this.$api.get(url).then( (response) => {
                        this.loading = false;
						var result = response.data;
                        if(result.num){
							this.num = parseFloat(result.num);
							if(result.max_value){
								this.maxValue = result.max_value;
							}
						}
						else{
							this.num = parseFloat(result);
						}
                    },
                     (response) => {
                        this.loading = false;
                    });
                }
            },
        },
        watch: {
            apiPath: function() {
                this.getRecordCount();
            },
        },
        mounted: function() {
			this.maxValue = this.max;
            this.getRecordCount();
        },
    }
</script>
