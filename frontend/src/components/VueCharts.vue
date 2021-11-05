<template>
  	<div>  
		<canvas :width="width" :height="height" ref="canvas" id="canvas"></canvas>      
  	</div>          
</template>
<script>
	import Chart from 'chart.js';
    export default {
		props: {
			chartType: {
				type: String,
				default: 'bar'
			},
			responsive: {
				type: Boolean,
				default: true
			},
			gridlines: {
				type: Boolean,
				default: true
			},
			ticks: {
				type: Boolean,
				default: true
			},
			beginzero: {
				type: Boolean,
				default: true
			},
			width: {
				type: String,
				default: '400'
			},
			height: {
				type: String,
				default: '300'
			},
			xlabel: {
				type: String,
				default: ''
			},
			ylabel: {
				type: String,
				default: ''
			},
			chartDesign: {
				type: Array,
				default: []
			},
			chartData: {
				labels:[],
				datasets:[],
			},
		},
		data: function() {
			return {
				chart: undefined,
				options: {
					scales: {
						yAxes: [{
							gridLines:{ display: true },
							ticks: {
								beginAtZero: this.beginzero,
								display:true
							},
							scaleLabel: {
								display: true,
								labelString: ''
							}
						}],
						xAxes: [{
							gridLines:{ display: true},
							ticks: { display: true },
							scaleLabel: {
								display: true,
								labelString: ''
							}
						}],
					},
					maintainAspectRatio : true,
					responsive : this.responsive,
				},
				loading: false,
			};
		},
		methods: {
			renderChart: function() {
				if (this.chart) {
					this.chart.destroy();
				}
				
				this.chartData.datasets.forEach((element, index) => {
					let design = this.chartDesign[index];
					if(design.hasOwnProperty("backgroundColor")){
						
						if(design.backgroundColor == "--RandomColor--"){
							design.backgroundColor = this.$utils.randomColor();
						}

						if(design.backgroundColor == "--RandomBarColors--"){
							let barColors = [];
							this.chartData.labels.forEach((element, index) => {
								barColors.push(this.$utils.randomColor());
							});
							design.backgroundColor = barColors;
						}
					}
					this.$utils.extend(element, design);
				});

				this.chart = new Chart(
					this.$refs.canvas.getContext('2d'), {
						type : this.chartType,
						data : this.chartData,
						options : this.options,
					}
				)
			},
		},
		watch: {
			options: function(){
				this.renderChart()
			},
			chartData: function(){
				this.renderChart()
			},
		},
		mounted: function() {

		},
		destroyed: function() {
			if (this.chart) {
				this.chart.destroy();
			}
		}
	}
</script>