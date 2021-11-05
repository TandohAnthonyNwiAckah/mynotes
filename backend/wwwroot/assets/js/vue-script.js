	
	String.prototype.trimLeft = function(charlist) {
	  if (charlist === undefined)
		charlist = "\s";

	  return this.replace(new RegExp("^[" + charlist + "]+"), "");
	};
	
	String.prototype.trimRight = function(charlist) {
	  if (charlist === undefined)
		charlist = "\s";

	  return this.replace(new RegExp("[" + charlist + "]+$"), "");
	};
	
	function valToArray(val) {
		if(val){
			if(Array.isArray(val)){
				return val;
			}
			else{
				return val.split(",");
			}
		}
		else{
			return [];
		}
	};
	
	function debounce(fn, delay) {
	  var timer = null;
	  return function () {
		var context = this, args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function () {
		  fn.apply(context, args);
		}, delay);
	  };
	}
	
	function extend(obj, src) {
		for (var key in src) {
			if (src.hasOwnProperty(key)) obj[key] = src[key];
		}
		return obj;
	}
	
	function setApiUrl(path , queryObj){
		var url;
		if(queryObj){
			var str = [];
			for(var k in queryObj){
				var v = queryObj[k]
				if (queryObj.hasOwnProperty(k) && v !== '') {
					str.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
				} 
			}
			
			var qs = str.join("&");
			
			if(path.indexOf('?') > 0){
				url = path + '&' + qs;  
			}
			else{
				url = path + '?' + qs;  
			}
			
		}
		else{
			url = apiUrl + path
		}
		
		return url;
	}
	
	function randomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	
	var DataImport = Vue.component('DataImport', {
		template:'#DataImport',
		props: {
			accept: {
				type:String,
				default:''
			},
			extensions: {
				type:String, 
				default:'csv'
			},
			maximum: {
				type:Number, 
				default:5
			},
			filesize: {
				type:Number, 
				default: 0
			},
			multiple:{
				type:Boolean, 
				default:false
			},
			directory: {
				type:Boolean, 
				default:false
			},
			buttontext:{
				type:String, 
				default:'Import Data'
			},
			dropmsg:{
				type:String, 
				default:'Drop files anywhere to upload'
			},
			drop:{
				type:Boolean, 
				default:true
			},
			dropDirectory:{
				type:Boolean, 
				default:true
			},
			addIndex: {
				type:Boolean, 
				default:false
			},
			thread: {
				type:Number, 
				default:3
			},
			postAction: {
				type:String, 
				default:''
			},
			putAction: {
				type:String, 
				default:''
			},
			headers: {
				type:Object, 
				default:function () { return {} }
			},
			uploadAuto:{
				type:Boolean, 
				default:true
			},
			fieldname:{
				type:String, 
				default:''
			},
			uploadpath:{
				type:String, 
				default:'random'
			},
			value:null
		},
		data: function() {
			return {
				postData:{},
				files: [],
				name:'file',
				uploadMsg: '',
				showUploadPanel:false
			}
		},
		methods: {
			inputFile:function (newFile, oldFile) {
				if (newFile && oldFile && newFile.success && !oldFile.success) {
					var response = newFile.response;
					var msg = 'Total Rows Imported : <b>' + response.total_rows + '</b>';
					this.uploadMsg = msg;
					bus.$emit('refresh');
				}
				if (newFile.error && !oldFile.error) {
					console.log('error');
					this.uploadMsg = newFile.xhr.statusText;
				}
				if (newFile && oldFile) {
					// update
					if (newFile.active && !oldFile.active) {
						// beforeSend
						// min size
						if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
							this.$refs.upload.update(newFile, { error: 'size' })
						}
					}
					if (newFile.progress !== oldFile.progress) {
					  // progress
					}
					
					if (newFile.success && !oldFile.success) {
					  // success
					}
				}
				if (!newFile && oldFile) {
					// remove
					if (oldFile.success && oldFile.response.id) {
					  // $.ajax({
					  //   type: 'DELETE',
					  //   url: '/upload/delete?id=' + oldFile.response.id,
					  // })
					}
				}

				if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
					if (this.uploadAuto && !this.$refs.upload.active) {
					  this.$refs.upload.active = true
					}
				}
			},
			
			bytesToSize:function(bytes) {
				var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
				if (bytes === 0) return 'n/a';
				let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
				if (i === 0) return bytes + ' ' + sizes[i];
				return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
			},
			closePanel:function() {
				this.files = [];
				this.uploadMsg = '';
			},
			getFileName:function(url) {
				return url.split('/').pop();
			},
		},
		computed: {
			size:function () {
				return this.filesize * 1024 * 1024;
			},
		},
		
	});

	var HtmlEditorComponent = Vue.component('HtmlEditor',{
		template: "#HtmlEditor",
		props: {
			model: {
				required: true,
				twoWay: true
			},
			language: {
				type: String,
				required: false,
				default: "en-US"
			},
			height: {
				type: Number,
				required: false,
				default: 160
			},
			minHeight: {
				type: Number,
				required: false,
				default: 160
			},
			maxHeight: {
				type: Number,
				required: false,
				default: 800
			},
			name: {
				type: String,
				required: false,
				default: ""
			},
			toolbar: {
				type: Array,
				required: false,
				default: function() {
					return [
						["font", ["bold", "italic", "underline", "clear"]],
						["fontsize", ["fontsize"]],
						["para", ["ul", "ol", "paragraph"]],
						["color", ["color"]],
						["insert", ["link", "hr"]]
					];
				}
			}
		},
		created: function() {
			this.isChanging = false;
			this.control = null;
		},
		
		mounted: function() {
			//  initialize the summernote
			if (this.minHeight > this.height) {
				this.minHeight = this.height;
			}
			if (this.maxHeight < this.height) {
				this.maxHeight = this.height;
			}
			var me = this;
			this.control = $(this.$el);
			this.control.summernote({
				lang: this.language,
				height: this.height,
				minHeight: this.minHeight,
				maxHeight: this.maxHeight,
				toolbar: this.toolbar,
				callbacks: {
					onInit: function() {
						me.control.summernote("code", me.model);
					},
					onChange: function() {
						if (!me.isChanging) {
							me.isChanging = true;
							var code = me.control.summernote("code");
							me.model = (code === null || code.length === 0 ? null : code);
							me.$nextTick(function() {
								me.isChanging = false;
							});
						}
						me.$parent.text = code

					}
				}
			})
		},
		watch: {
			'model': function(val) {
				if (!this.isChanging) {
					
					this.isChanging = true;
					var code = (val === null ? "" : val);
					this.control.summernote("code", code);
					this.isChanging = false;
				}
			}
		},
	});

	var NiceFormWizard = Vue.component('NiceFormWizard',{
		template: "#NiceFormWizard",
		props: {
			submitatonce:{
                type: Boolean,
                default: false
            },
			shape:{
                type: String,
                default: 'square'
            },
			color:{
                type: String,
                default: '#0066cc'
            },
			stepsize:{
                type: String,
                default: 'md'
            },
			
		},
		data: function() {
            return {
				saving: false,
				payload: {},
            };
        },
		methods: {
			moveNext: function() {
				vm.$refs.wizard.nextTab();
			},
		},
		mounted: function() {
			
		},
		created: function(){
			var vm = this;
			
			bus.$on('movewizard' , function(arr){
				var data = arr[0];
				var apipath = arr[1];
				var action = arr[2];
				
				var payload = extend( vm.payload, data ); // form data into one object
				
				if(action == 'movenext'){
					vm.$refs.wizard.nextTab();
				}
				else{
					vm.saving = true;
					console.log(payload);
					console.log(apipath);
					vm.$http.post(apipath , payload, {emulateJSON:true}).then(function (response) {
						var result = response.body;
						console.log(result);
						vm.saving = false;
						vm.$refs.wizard.nextTab();
					},
					function (response) {
						vm.saving = false;
						console.log('Error!:', response.body);
					});
				}
			});
			bus.$on('movenext' , function(){
				vm.$refs.wizard.nextTab();
			});
			
		},
		watch: {
			
		},
	});

	var WizardBtn = Vue.component('WizardBtn',{
		template: "#WizardBtn",
		props: {
			text:{
                type: String,
                default: 'Next'
            },
			icon:{
                type: String,
                default: 'vradicon[arrow_forward]vradicon'
            },
		},
		data: function() {
            return {
				payload: {},
            };
        },
		methods: {
			moveNext: function() {
				bus.$emit('movenext');
			},
		},
	});
	
	var OptionList = Vue.component('OptionList', {
		template:'#OptionList',
		props: {
			datapath: {
                type: String,
                default: ''
            },
        },
        data: function() {
            return {
				options:[],
            };
        },
        
        mounted: function() {
			var apipath = setApiUrl(this.datapath);
			this.$http.get(apipath).then(function (response) {
				var result = response.body;
				this.options = result;
			},
			function (response) {
				console.log('Error!:', response.body);
			});
        },
	});
	
	var NiceImg = Vue.component('NiceImg', {
		template:'#NiceImg',
		props: {
			path:null,
			nullpath:{
				type: String,
                default: ''
			},
			errorpath:{
				type: String,
                default: 'assets/images/no-image-available.png'
			},
			
			link: {
                type: String,
                default: ''
            },
			single: {
                type: Boolean,
                default: false
            },
			resize: {
                type: Boolean,
                default: true
            },
			width: {
                type: String,
                default: '100'
            },
			
			height: {
                type: String,
                default: '100'
            },
			maxwidth: {
                type: String,
                default: '760'
            },
			maxheight: {
                type: String,
                default: '600'
            },
			
			imgclass: {
                type: String,
                default: 'img-fluid'
            },
        },
		data: function() {
            return {
				imgPath:[],
            };
        },
        
        mounted: function() {
			this.imgPath = this.path;
        },
        methods: {
			setPreviewSize: function(src){
				if(this.resize){
					return setApiUrl('helpers/timthumb.php?src=' + src + '&w=' + this.maxwidth + '&h=' + this.maxheight)
				}
				return src;
			},
			setResizeSrc: function(src){
				if(this.resize){
					return setApiUrl('helpers/timthumb.php?src=' + src + '&w=' + this.width + '&h=' + this.height);
				}
				return src;
			},
			openGallery: function(index){
				bus.$emit('showGallery', [this.arrSrc, index]);
			},
			imgOnError: function() {
				this.imgPath = this.errorpath;
			}
        },
		watch: {
			path: function(){
				this.imgPath = this.path;
			},
        },
		computed: {
            arrSrc: function(){
				if(this.imgPath){
					var arrimg = valToArray(this.imgPath);
					if(this.single && arrimg.length){
						return [arrimg[0]];
					}
					else{
						return arrimg;
					}
				}
				if (this.nullpath){
					return [this.nullpath];
				}
				else{
					return [];
				}
			},
        },
	})
	
	var NiceCarousel = Vue.component('NiceCarousel', {
		template:'#NiceCarousel',
		data: function() {
            return {
				show: false,
				startIndex: 0,
				arrSrc:[],
            }
        },
		props: {
			nullpath:{
				type: String,
                default: 'assets/images/avatar.png'
			},
			errorpath:{
				type: String,
                default: 'assets/images/no-image-available.png'
			},
			
			resize: {
                type: Boolean,
                default: true
            },
			width: {
                type: String,
                default: '1024'
            },
			height: {
                type: String,
                default: '600'
            },
        },
        methods: {
			setResizeSrc: function(src){
				if(this.resize){
					return setApiUrl('helpers/timthumb.php?src=' + src + '&w=' + this.width + '&h=' + this.height);
				}
				return src;
			},
        },
		computed: {
			showControls: function(){
				if(this.arrSrc && this.arrSrc.length>1){
					return true;
				}
				return false;
			},
        },
		
		created: function(){
			var vm = this;
			bus.$on('showGallery' , function(data){
				vm.startIndex = data[1];
				vm.arrSrc = valToArray(data[0]);
				vm.show = true;
			});
		},
	})

	var DataSelect = Vue.component('DataSelect', {
		template:'#DataSelect',
		props: {
			name: {
                type: String,
                default: ''
            },
			
			disabled: {
                type: Boolean,
                default: false
            },
			multiple: {
                type: Boolean,
                default: false
            },
			limit: {
                type: Number,
                default: -1
            },
			placeholder: {
                type: String,
                default: ''
            },
			datapath: {
                type: String,
                default: ''
            },
			datasource:{
				type: Array,
				default: function () { return [] }
			},
			value: {
                type: String,
                default: ''
            },
        },
        data: function() {
            return {
				options: [],
				loading: false,
				selected: [],
            };
        },
		methods: {
			loadOptions: function() {
				if(this.datapath){
					var apipath = setApiUrl(this.datapath);
					this.loading = true;
					this.$http.get(apipath).then(function (response) {
						this.loading = false;
						var result = response.body;
						this.options = valToArray(result) ;
					},
					function (response) {
						this.loading = false;
						console.log('Error!:', response.body);
					});
				}
				else{
					this.options = valToArray(this.datasource);
				}
			},
		},
		watch: {
            datapath: function() {
				this.loadOptions();
            },
			value: function(oldval,newval) {
				 if(this.value != this.selected.toString()){
					if(this.multiple){
						this.selected = valToArray(this.value);
					}
					else{
						this.selected = this.value;
					}
				}
            },
			selected: function(oldval,newval) {
				if(this.multiple){
					if(this.selected.length > this.limit && this.limit > 0 ){
						this.selected.splice(0,1);
					}
				}
				if(this.selected != undefined){
					this.$emit('input',this.selected.toString());
				}
				else{
					this.$emit('input','');
				}
            },
		},
        mounted: function() {
			this.loadOptions();
			
			if(this.multiple){
				if(this.value){
					this.selected = valToArray(this.value);
				}
				else{
					this.selected = [];
				}
			}
			else{
				if(this.value){
					this.selected = this.value;
				}
				else{
					this.selected = '';
				}
			}
        },
		
	})

	var DataVSelect = Vue.component('DataVSelect', {
		template:'#DataVSelect',
		props: {
			multiple: {
                type: Boolean,
                default: true
            },
			disabled: {
                type: Boolean,
                default: false
            },
			
			limit: {
                type: Number,
                default: -1
            },
			
			placeholder: {
                type: String,
                default: ''
            },
			datapath: {
                type: String,
                default: ''
            },
			searchpath: {
                type: String,
                default: ''
            },
			error: {
                type: String,
                default: ''
            },
			datasource:{
				type: Array,
				default: function () { return [] }
			},
			value: {
                type: String,
                default: ''
            },
        },
        data: function() {
            return {
				options:[],
				selected:null,
            };
        },
        methods: {
			loadOptions: function() {
				if(this.datapath){
					var apipath = setApiUrl(this.datapath);
					this.$http.get(apipath).then(function (response) {
						var result = response.body;
						this.options = valToArray(result) ;
					},
					function (response) {
						console.log('Error!:', response.body);
					});
				}
				else{
					this.options = valToArray(this.datasource);
				}
			},
			onSearch: function(text, loading) {
				if(this.searchpath){
					loading(true);
					this.search(loading,text,this);
				}
			},
			search: debounce(function(loading,text,vm){
					var apipath = setApiUrl(vm.searchpath + "/" + encodeURIComponent(text));
					vm.$http.get(apipath).then(function (response) {
						var result = response.body;
						vm.options = valToArray(result);
						loading(false);
					},
					function (response) {
						loading(false);
					});
				},1000),
			
			makesearch: function(q, loading) {
				if(this.searchpath){
					var vm = this;
					debounce(function(){
						loading(true);
						var apipath = setApiUrl(vm.searchpath + "/" + encodeURIComponent(q));
						vm.$http.get(apipath).then(function (response) {
							var result = response.body;
							vm.options = valToArray(result);
							loading(false);
						},
						function (response) {
							console.log('Error!:', response.body);
							loading(false);
						});
					},1000);
				}
			},
			getSelectedValues: function() {
				if(this.multiple){
					return this.selected.map(function(a) {return a.value;});
				}
				else{
					if(this.selected.value){
						return this.selected.value;
					}
					return this.selected;
				}
			},
		},
		
		watch: {
			datapath: function() {
				this.loadOptions();
            },
            value: function(oldval,newval) {
				
				if(this.value.toString() != this.getSelectedValues(this.selected).toString()){
					if(this.multiple){
						this.selected = valToArray(this.value);
					}else{
						this.selected = this.value;
					}
					
				}
            },
			selected: function(oldval,newval) {
				var arr = this.getSelectedValues(this.selected);
				if(arr.length > this.limit && this.limit > 0 ){
					this.selected = arr.splice(0,1);
				}
				
				if(this.selected != undefined){
					this.$emit('input', this.getSelectedValues(this.selected).toString());
				}
				else{
					this.$emit('input','');
				}
            },
		},
        mounted: function() {
			if(this.datapath){
				var apipath = setApiUrl(this.datapath);
				this.$http.get(apipath).then(function (response) {
					var result = response.body;
					this.options = result;
				},
				function (response) {
					console.log('Error!:', response.body);
				});
			}
			else{
				this.options = valToArray(this.datasource);
			}
			
			if(this.multiple){
				if(this.value){
					this.selected = valToArray(this.value);
				}
				else{
					this.selected = [];
				}
			}
			else{
				this.selected = this.value;
			}
        },
	})

	var DataCheck = Vue.component('DataCheck', {
		template:'#DataCheck',
		props: {
			value: null,
			name: {
                type: String,
                default: ''
            },
			limit: {
                type: Number,
                default: -1
            },
			btnvariant:{
				type: String,
				default:'secondary'
			},
			checkclass:{
				type: String,
				default:'btn btn-sm btn-secondary'
			},
			isbutton: {
                type: Boolean,
                default: false
            },
            btnvertical: {
                type: Boolean,
                default: true
            },
			datapath: {
                type: String,
                default: ''
            },
			datasource:null,
        },
        data: function() {
            return {
				options:[],
				loading: false,
				selected:[]
            };
        },
        
		watch: {
            selected: function() {
              this.$emit('input' , this.selected.toString());
            },
			value: function() {
				this.selected = valToArray(this.value);
            },
		},
        mounted: function() {
			if(this.datapath){
				var apipath = setApiUrl(this.datapath);
				this.loading = true;
				this.$http.get(apipath).then(function (response) {
					var result = response.body;
					this.options = valToArray(result);
					this.loading = false;
				},
				function (response) {
					this.loading = false;
					console.log('Error!:', response.body);
				});
			}
			else{
				this.options = valToArray(this.datasource);
			}
        },
	});

	var DataRadio = Vue.component('DataRadio', {
		template:'#DataRadio',
		props: {
			value: null,
			name: {
                type: String,
                default: ''
            },
			limit: {
                type: Number,
                default: -1
            },
			isbutton: {
                type: Boolean,
                default: false
            },
			btnvariant:{
				type: String,
				default:'secondary'
			},
			checkclass:{
				type: String,
				default:'btn btn-sm btn-secondary'
			},
			isbutton: {
                type: Boolean,
                default: false
            },
            btnvertical: {
                type: Boolean,
                default: true
            },
			datapath: {
                type: String,
                default: ''
            },
			datasource:null,
        },
        data: function() {
            return {
				options:[],
				loading: false,
				selected:''
            };
        },
		watch: {
			selected: function() {
				this.$emit('input' , this.selected);
            },
			value: function() {
				this.selected = this.value;
            },
		},
        mounted: function() {
			this.selected = this.value
			if(this.datapath){
				this.loading = true;
				var apipath = setApiUrl(this.datapath);
				this.$http.get(apipath).then(function (response) {
					var result = response.body;
					this.options = valToArray(result);
					this.loading = false;
				},
				function (response) {
					this.loading = false;
					console.log('Error!:', response.body);
				});
			}
			else{
				this.options = valToArray(this.datasource);
			}
        },
	});

	var NiceToggle = Vue.component('NiceToggle', {
		template:'#NiceToggle',
		props: {
			value: null,
			shape: {
				default: 'round'
			},
			disabled: {
				default: false
			},
			textEnabled: {
				default: ''
			},
			textDisabled: {
				default: ''
			},
			colorclass: {
				default: 'bg-primary'
			},
			valueselected: {
				default : 'true'
			},
			valuenotselected: {
				default:''
			}
		},
		data: function() {
			return {
				checked:false,
			};
		},
		methods: {
		   setCurrentStatus: function(){
				if( this.value == this.valueselected ){
					this.checked = true;
				}
				else{
					this.checked = false;
				}
		   }
		},
		watch: {
			checked: function(){
				if(this.checked == true){
					this.$emit('input', this.valueselected);
				}
				else{
					this.$emit('input', this.valuenotselected);
				}
			},
			value: function(){
				this.setCurrentStatus();
			}
		},
		computed: {
			setBgColor:function() {
				if(this.checked){
					return this.colorclass + ' ' + this.shape;
				}
				else{
					return this.shape
				}
			},
		},
		mounted:function() {
			this.setCurrentStatus();
		}
	});

	var NiceChart = Vue.component('NiceChart', {
		template:'#NiceChart',
		props: {
            
			charttype: {
                type: String,
                default: 'line'
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
			datapath: {
                type: String,
                default: ''
            },
			labels: {
				type:Array, 
				default:function(){return [] }
            },
            datasets:{
				type:Array, 
				default:function(){return [] }
			},
        },
        data: function() {
            return {
                chart: undefined,
				chartData: {
					labels:[],
					datasets:[],
				},
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
            };
        },
        methods: {
            renderChart: function() {
                this.chart = new Chart(
					this.$refs.canvas.getContext('2d'), {
						type : this.charttype,
						data : this.chartData,
						options : this.options,
					}
				)
            },
			setDatasetColor: function(dataset,prop) {
				
                if(dataset[prop] == 'RANDOMSINGLECOLOR'){
					dataset[prop] = randomColor();
				}
				else if(dataset[prop] == 'RANDOMDIFFERENTCOLOR'){
					dataset[prop] = [];
					for(var j=0; j < dataset.data.length; j++){
						dataset[prop].push(randomColor());
					}
				}
				else if(dataset[prop] == 'DEFAULT' || dataset[prop] == 'NOCOLOR' || dataset[prop] == ''){
					delete dataset[prop]
				}
				
            },
			fetchData: function() {
				var apipath = setApiUrl(this.datapath);
				this.$http.get(apipath).then(function (response) {
					var result = response.body;
					this.chartData.labels = result.labels;
					
					for(var i = 0; i < result.datasets.length; i++){
						var dataset = this.chartData.datasets[i];
						
						dataset['data'] = result.datasets[i];
						
						this.setDatasetColor(dataset,'backgroundColor');
						this.setDatasetColor(dataset,'borderColor');
						this.setDatasetColor(dataset,'pointBackgroundColor');
					}
					
					this.renderChart()
				},
				function (response) {
					console.log('Error!:', response.body);
				});
               
            }
			
        },
        watch: {
            options: function(){
                this.renderChart()
            },
			datapath: function(){
                this.fetchData()
            },
        },
        mounted: function() {
			
			this.chartData.labels = this.labels
			this.chartData.datasets = this.datasets
			
			if(this.datapath!=''){
				this.fetchData();
			}
			var scale = this.options.scales;
			
			scale.xAxes[0].gridLines.display = this.gridlines;
			scale.xAxes[0].ticks.display = this.ticks;
			
			scale.yAxes[0].gridLines.display = this.gridlines;
			scale.yAxes[0].ticks.display = this.ticks;
			
			if(this.xlabel){
				scale.xAxes[0].scaleLabel.labelString = this.xlabel;
			}
			
			if(this.ylabel){
				scale.yAxes[0].scaleLabel.labelString = this.ylabel;
			}
			
            this.renderChart();
        },
        destroyed: function() {
            if (this.chartist) {
                this.chartist.detach();
            }
        }
	});

	var NiceUpload = Vue.component('NiceUpload', {
		template:'#NiceUpload',
		props: {
			accept: {
				type:String,
				default:'image/png,image/gif,image/jpeg,image/webp'
			},
			extensions: {
				type:String, 
				default:''
			},
			maximum: {
				type:Number, 
				default:3
			},
			filesize: {
				type:Number, 
				default: 0
			},
			multiple:{
				type:Boolean, 
				default:false
			},
			directory: {
				type:Boolean, 
				default:false
			},
			buttontext:{
				type:String, 
				default:'Browse'
			},
			
			controlClass:{
				type:String, 
				default:'upload-control'
			},
			dropmsg:{
				type:String, 
				default:'Drop files anywhere to upload'
			},
			drop:{
				type:Boolean, 
				default:true
			},
			dropDirectory:{
				type:Boolean, 
				default:true
			},
			addIndex: {
				type:Boolean, 
				default:false
			},
			thread: {
				type:Number, 
				default:3
			},
			
			postAction: {
				type:String, 
				default: setApiUrl('filehelper/uploadfile')
			},
			putAction: {
				type:String, 
				default:''
			},
			headers: {
				type:Object, 
				default:function () { return {} }
			},
			
			uploadAuto:{
				type:Boolean, 
				default:true
			},
			fieldname:{
				type:String, 
				default:''
			},
			uploadpath:{
				type:String, 
				default:'random'
			},
			filenameformat:{
				type:String, 
				default:'random'
				
				//supported formats:
				/* 
					{{random}} : uses alphanumeric random character as the filename
					{{timestamp}} : uses unix timestamp as filename
					{{date}} : uses current  as filename
					{{file_name}} : uses the original filename
					{{dirlistsequence}} : uses the incremental file count in the directory as the filename
					
					NB: You can equally use the combination of any of them eg: {{file_name}}{{date}}
				*/
			},
			returnfullpath:{
				type:Boolean, 
				default:true
			},
			filenameprefix:{
				type:String, 
				default:''
			},
			value:null
		},
		data: function() {
			return {
				files: [],
				name:'file',
				uploadedData:[],
				
			}
		},
		methods: {
			inputFile:function (newFile, oldFile) {
				if (newFile && oldFile && newFile.success && !oldFile.success) {
					if(this.multiple){
						this.uploadedData.push(newFile.response);
					}
					else{
						this.uploadedData = [newFile.response];
					}
				}

				if (newFile && oldFile && newFile.error && !oldFile.error) {
					console.log('error')
				}

				if (newFile && oldFile) {
					// update
					if (newFile.active && !oldFile.active) {
					  // beforeSend
					  // min size
					  if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
						this.$refs.upload.update(newFile, { error: 'size' })
					  }
					}
					if (newFile.progress !== oldFile.progress) {
					  // progress
					}
					if (newFile.error && !oldFile.error) {
					  // error
					}
					if (newFile.success && !oldFile.success) {
					  // success
					}
				}
				if (!newFile && oldFile) {
					// remove
					if (oldFile.success && oldFile.response.id) {
					  // $.ajax({
					  //   type: 'DELETE',
					  //   url: '/upload/delete?id=' + oldFile.response.id,
					  // })
					}
				}
				if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
					if (this.uploadAuto && !this.$refs.upload.active) {
					  this.$refs.upload.active = true
					}
				}
			},
			inputFilter:function (newFile, oldFile, prevent) {
				if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
					newFile.blob = ''
					var URL = window.URL || window.webkitURL
					if (URL && URL.createObjectURL) {
						newFile.blob = URL.createObjectURL(newFile.file)
					}
					newFile.thumb = ''
					if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
						newFile.thumb = newFile.blob
					}
				}
			},
			bytesToSize:function(bytes) {
				var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
				if (bytes === 0) return 'n/a';
				let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
				if (i === 0) return bytes + ' ' + sizes[i];
				return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
			},
			removeFile:function(file,index) {
				this.$refs.upload.remove(file);
				this.uploadedData.splice(index,1);
			},
			removeUpload:function(index) {
				this.uploadedData.splice(index,1);
			},
			getFileName:function(url) {
				return url.split('/').pop();
			},
		},
		computed: {
			data:function () {
				var obj={
					uploadDir : this.uploadpath,
					returnfullpath : this.returnfullpath,
					filenameprefix : this.filenameprefix,
					limit : this.maximum,
					maxSize : this.filesize,
					title : "{{" + this.filenameformat + "}}",
				}
				return obj
			},
			
			size:function () {
				return this.filesize * 1024 * 1024;
			},
		},
		watch: {
			//when all upload completed
			uploadedData:function(){
				if(this.$refs.upload.uploaded){
					this.$emit( 'input', this.uploadedData.toString() );
				}
			},
			value: function(){
				if(this.value){
					this.uploadedData = valToArray(this.value);
				}
				else{
					this.uploadedData = []
				}
			},
		},
		mounted:function(){
			if(this.value){
				this.uploadedData = valToArray(this.value);
			}
			else{
				this.uploadedData = []
			}
		},
		created: function(){
			var vm = this;
			bus.$on('refresh' , function(){
				vm.uploadedData = [];
				vm.files = [];
			});
		},
	});
	
	var NiceMenu = Vue.component('NiceMenu', {
		template:'#NiceMenu',
		props: {
			menus:{
				type: Array,
				default: function () { return [] }
			},
			submenu:{
				type:Boolean,
				default:false
			},
			menuclass:{
				type:String,
				default:'nav nav-tabs nav-stacked'
			},
		},
		methods: {
			noClick:function(){
				return false;
			}
		},
		computed: {
			setmenuclass:function(){
				if(this.submenu==true){
					return "dropdown-menu";
				}
				else{
					return this.menuclass;
				}
			}
		},
		mounted:function(){
			
		}
	});
	
	var DataMenu = Vue.component('DataMenu', {
		template:'#DataMenu',
		props: {
			datapath:{
				type: String,
				default: ''
			},
			title:{
				type: String,
				default: ''
			},
			labelkey:{
				type: String,
				default: ''
			},
			valuekey:{
				type: String,
				default: ''
			},
			defaultmenu:{
				type: String,
				default: 'None'
			},
			pagelinkpath:{
				type: String,
				default: ''
			},
			responsive:{
				type: Boolean,
				default: true
			},
			menuclass:{
				type:String,
				default:'nav nav-tabs nav-stacked'
			},
		},
		data: function() {
			return {
				menus:[],
				collapseClass: 'd-none d-sm-block',
				loading: false
			}
		},
		methods: {
			setMenuLink: function(menu){
				if(menu[this.valuekey]){
					return this.pagelinkpath + '/' + menu[this.valuekey];
				}
				else{
					return this.pagelinkpath + '/';
				}
			},
			setMenuLabel: function(menu){
				if(menu[this.labelkey]){
					return  menu[this.labelkey];
				}
				else if(menu[this.valuekey]){
					return  menu[this.valuekey];
				}
				else{
					return  "";
				}
			},
			
			toggleCollaps: function(){
				if(this.responsive){
					if (this.collapseClass == ''){
						this.collapseClass = 'd-none d-sm-block'
					}
					else{
						this.collapseClass = ''
					}
				}
				else{
					this.collapseClass = ''
				}
			},
			fetchData: function(){
				if(this.datapath){
					this.loading = true;
					var apipath = setApiUrl(this.datapath);
					this.$http.get(apipath).then(function (response) {
						this.loading = false;
						this.menus = response.body
					},
					function (response) {
						this.loading = false;
						//console.log('Error!:', response.body);
					});	
				}
			},
		},
		computed: {
			setCollapseClass: function(menu){
				if(this.responsive){
					return this.collapseClass
				}
				else{
					return ''
				}
			},
		},
		watch: {
			datapath: function(path){
				this.fetchData();
			},
		},
		
		mounted:function(){
			this.fetchData();
		}
	});
	
	var DataDropMenu = Vue.component('DataDropMenu', {
		template:'#DataDropMenu',
		props: {
			datasource:{
				type: Array,
				default: function () { return [] }
			},
			datapath:{
				type: String,
				default: ''
			},
			defaultitem:{
				type: String,
				default: ''
			},
			
			fieldname:{
				type: String,
				default: ''
			},
			
			labelkey:{
				type: String,
				default: 'label'
			},
			
			valuekey:{
				type: String,
				default: 'value'
			},
			variant:{
				type:String,
				default:'primary'
			},
			size:{
				type:String,
				default:''
			},
			value:{
				type:String,
				default:''
			},
			
		},
		data: function() {
			return {
				menus:[],
				activeMenu:null,
				loading:false
			}
		},
		methods: {
			setMenuLabel: function(menu){
				if(menu[this.labelkey]){
					return  menu[this.labelkey];
				}
				else if(menu[this.valuekey]){
					return  menu[this.valuekey];
				}
				else{
					return  menu;
				}
			},
			setActiveMenu: function(menu){
				var val = '';
				if(menu[this.valuekey]){
					val =  menu[this.valuekey];
				}
				else{
					val =  menu;
				}
				return (val == this.activeMenu);
			},
			
			filter: function(menu){
				var val = "";
				
				if(menu[this.valuekey]){
					val =  menu[this.valuekey];
				}
				else{
					val =  menu;
				}
				
				this.activeMenu = val;
				this.$emit('input' , val);
			},
			
			fetchData: function(){
				if(this.datapath){
					this.loading = true;
					var apipath = setApiUrl(this.datapath);
					this.$http.get(apipath).then(function (response) {
						this.loading = false;
						this.menus = response.body;
					},
					function (response) {
						this.loading = false;
						//console.log('Error!:', response.body);
					});
				}
			},
		},
		watch: {
			datapath: function(path){
				this.fetchData();
			},
			value: function(val){
				this.activeMenu = val
			},
		},
		mounted:function(){
			if(this.datapath){
				this.fetchData();
			}
			else{
				this.menus = this.datasource;
			}
		}
	});
	
	var DataNavMenu = Vue.component('DataNavMenu', {
		template:'#DataNavMenu',
		props: {
			datasource:{
				type: Array,
				default: function () { return [] }
			},
			datapath:{
				type: String,
				default: ''
			},
			defaultitem:{
				type: String,
				default: ''
			},
			fieldname:{
				type: String,
				default: ''
			},
			
			labelkey:{
				type: String,
				default: 'label'
			},
			
			valuekey:{
				type: String,
				default: 'value'
			},
			pill:{
				type:Boolean,
				default: true
			},
			tab:{
				type:Boolean,
				default: false
			},
			fill:{
				type:Boolean,
				default: false
			},
			justify:{
				type:Boolean,
				default: false
			},
			vertical:{
				type:Boolean,
				default: false
			},
			value:{
				type:String,
				default: ''
			},
			
			
		},
		data: function() {
			return {
				menus:[],
				activeMenu:null,
				loading: false
			}
		},
		methods: {
			setMenuLabel: function(menu){
				if(menu[this.labelkey]){
					return  menu[this.labelkey];
				}
				else if(menu[this.valuekey]){
					return  menu[this.valuekey];
				}
				else{
					return  menu;
				}
			},
			setActiveMenu: function(menu){
				var val = '';
				if(menu[this.valuekey]){
					val =  menu[this.valuekey];
				}
				else{
					val =  menu;
				}
				return (val == this.activeMenu);
			},
			
			filter: function(menu){
				var val = "";
				
				if(menu[this.valuekey]){
					val =  menu[this.valuekey];
				}
				else{
					val =  menu;
				}
				
				this.activeMenu = val;
				this.$emit('input' , val);
			},
			
			fetchData: function(){
				if(this.datapath){
					this.loading = true;
					var apipath = setApiUrl(this.datapath);
					this.$http.get(apipath).then(function (response) {
						this.loading = false;
						this.menus = response.body
					},
					function (response) {
						this.loading = false;
						//console.log('Error!:', response.body);
					});
				}
			},
		},
		
		watch: {
			datapath: function(path){
				this.fetchData();
			},
			value: function(val){
				this.activeMenu = val
			},
			
		},
		
		mounted:function(){
			if(this.datapath){
				this.fetchData();
			}
			else{
				this.menus = this.datasource;
			}
		}
	});

	var RecordCount = Vue.component('RecordCount', {
		template:'#RecordCount',
		props: {
			datapath: {
				type: String,
				required: true,
				default:''
			},
			
			link: {
				type: String,
				default:''
			},
			
			icon: {
				type: String,
				default:''
			},
			desc: {
				type: String,
				default:''
			},
			
			cssclass: {
				type: String,
				default:'record-count'
			},
			animate: {
				type: String,
				default:'zoomIn'
			},
			
			prefix: {
				type: String,
				default:''
			},
			suffix: {
				type: String,
				default:''
			},
			title: {
				type: String,
				default:''
			},
			variant: {
				type: String,
				default:'info'
			},
			displaystyle: {
				type: String,
				default:'alert'
			},
			progressmax: {
				type: Number,
				default:0
			},
		},
		data: function() {
			return {
				recordcount:null,
			}
		},
		computed: {
			setCssStyle : function(){
				var t= this.displaystyle + ' ' + this.displaystyle + '-' + this.variant + ' ' + this.animate ;
				return t;
			},
		},
		methods: {
			getRecordCount : function(){
				var apipath = setApiUrl(this.datapath);
				this.$http.get(apipath).then(function (response) {
					this.recordcount = parseFloat(response.body);
				},
				function (response) {
					console.log('Error!:', response.body);
				});
			},
			navigate : function(){
				if(this.link != ''){
					this.$router.push(this.link);
				}
			},
			
		},
		mounted:function(){
			this.getRecordCount();
		}
	});

	var RecordProgress = Vue.component('RecordProgress', {
		template:'#RecordProgress',
		props: {
			datapath: {
				type: String,
				required: true,
				default:''
			},
			
			link: {
				type: String,
				default:''
			},
			
			icon: {
				type: String,
				default:''
			},
			desc: {
				type: String,
				default:''
			},
			
			cssclass: {
				type: String,
				default:'record-count'
			},
			animate: {
				type: String,
				default:'zoomIn'
			},
			
			prefix: {
				type: String,
				default:''
			},
			suffix: {
				type: String,
				default:''
			},
			title: {
				type: String,
				default:''
			},
			variant: {
				type: String,
				default:'info'
			},
			displaystyle: {
				type: String,
				default:'alert'
			},
			progressmax: {
				type: Number,
				default:0
			},
			diameter: {
				type: Number,
				default:80
			},
			layout: {
				type: String,
				default:'flex'
			},
		},
		data: function() {
			return {
				recordcount:0,
			}
		},
		computed: {
			setCssStyle : function(){
				var t= this.displaystyle + ' ' + this.displaystyle + '-' + this.variant + ' ' + this.animate ;
				return t;
			},
			
			setStartColor : function(){
				var color="#0066cc";
				var variant = this.variant.toLowerCase();
				
				if(variant == 'success'){
					color = "#239B56";
				}
				else if(variant == 'info'){
					color = "#2E86C1";
				}
				else if(variant == 'danger'){
					color = "#CB4335";
				}
				else if(variant == 'warning'){
					color = "#F39C12";
				}
				return color;
			},
			
			setStopColor : function(){
				var color="#0066cc";
				var variant = this.variant.toLowerCase();
				
				if(variant == 'success'){
					color = "#82E0AA";
				}
				else if(variant == 'info'){
					color = "#85C1E9";
				}
				else if(variant == 'danger'){
					color = "#F5B7B1";
				}
				else if(variant == 'warning'){
					color = "#F7DC6F";
				}
				return color;
			},
			
		},
		methods: {
			getRecordCount : function(){
				var apipath = setApiUrl(this.datapath);
				this.$http.get(apipath).then(function (response) {
					this.recordcount = parseFloat(response.body);
				},
				function (response) {
					console.log('Error!:', response.body);
				});
			},
			navigate : function(){
				if(this.link != ''){
					this.$router.push(this.link);
				}
			},
			
		},
		mounted:function(){
			this.getRecordCount();
		}
	});
	
	var ThSort = Vue.component('ThSort', {
		template:'#ThSort',
		props: {
			fieldname: {
				type: String,
				default:''
			},
			title: {
				type: String,
				default:''
			},
			currentorderby: {
				type: String,
				default:''
			},
			currentordertype: {
				type: String,
				default:''
			},
		},
		methods: {
			sort : function(){
				this.$emit('sort' , this.fieldname);
			}
		},
		mounted:function(){
			
		}
	});
	
	var Pagination = Vue.component('Pagination', {
		template: '#Pagination',
		props: {
			
			showRecordCount: {
				type: Boolean,
				default: true
			},
			
			showPageCount: {
				type: Boolean,
				default: true
			},
			showPageLimit: {
				type: Boolean,
				default: true
			},
			itemsPerPage: {
				type: Number,
				default: 10
			},
			page: {
				type: Number,
				default: 1
			},
			
			currentItemsCount: {
				type: Number,
				default: 0
			},
			
			totalItems: {
				type: Number,
				default: 1
			},
			
			offset: {
				type: Number,
				default: 8,
			},
			firstText : {
				type : String,
				default : 'vradicon[first_page]vradicon',
			},
			nextText : {
				type : String,
				default : 'vradicon[arrow_forward]vradicon',
			},
			lastText : {
				type : String,
				default : 'vradicon[last_page]vradicon',
			},
			prevText : {
				type : String,
				default : 'vradicon[arrow_back]vradicon',
			},
			
		},
		computed: {
			totalPages:function() {
				return Math.ceil(this.totalItems / this.itemsPerPage);
			},
			
			recordPosition:function() {
				return Math.min((this.currentpage * this.itemsPerPage) , this.totalItems);
			},
			
		},
		
		data: function() {
			return {
				currentpage:1,
				pageLimit:10,
			}
		},
		methods: {
			pageChanged : function() {
				this.$emit('changepage', this.currentpage);
			},
			limitChanged : function() {
				var num = parseInt(this.pageLimit);
				if(num && num > 0){
					this.$emit('limit-changed', num);	
				}
			},
		},
		
		mounted: function() {
			this.pageLimit = this.itemsPerPage;
		}
	});
	
	var RadialProgress = Vue.component('RadialProgress', {
		template:'#RadialProgress',
		props: {
			diameter: {
			  type: Number,
			  required: false,
			  default: 200
			},
			totalSteps: {
			  type: Number,
			  required: true,
			  default: 10
			},
			completedSteps: {
			  type: Number,
			  required: true,
			  default: 0
			},
			startColor: {
			  type: String,
			  required: false,
			  default: '#bbff42'
			},
			stopColor: {
			  type: String,
			  required: false,
			  default: '#429321'
			},
			strokeWidth: {
			  type: Number,
			  required: false,
			  default: 5
			},
			animateSpeed: {
			  type: Number,
			  required: false,
			  default: 1000
			},
			innerStrokeColor: {
			  type: String,
			  required: false,
			  default: 'rgba(0,0,0,0.1)'
			},
			fps: {
			  type: Number,
			  required: false,
			  default: 60
			},
			timingFunc: {
			  type: String,
			  required: false,
			  default: 'linear'
			}
		},
		data:function () {
			return {
			  gradient: {
				fx: 0.99,
				fy: 0.5,
				cx: 0.5,
				cy: 0.5,
				r: 0.65
			  },
			  gradientAnimation: null,
			  currentAngle: 0,
			  strokeDashoffset: 0
			}
		},
		computed: {
			radius:function() {
			  return this.diameter / 2
			},
			circumference:function () {
			  return Math.PI * this.innerCircleDiameter
			},
			stepSize:function () {
			  if (this.totalSteps === 0) {
				return 0
			  }
			  return 100 / this.totalSteps
			},
			finishedPercentage:function () {
			  return this.stepSize * this.completedSteps
			},
			circleSlice:function () {
			  return 2 * Math.PI / this.totalSteps
			},
			animateSlice:function () {
			  return this.circleSlice / this.totalPoints
			},
			innerCircleDiameter:function () {
			  return this.diameter - (this.strokeWidth * 2)
			},
			innerCircleRadius:function () {
			  return this.innerCircleDiameter / 2
			},
			totalPoints:function () {
			  return this.animateSpeed / this.animationIncrements
			},
			animationIncrements:function () {
			  return 1000 / this.fps
			},
			hasGradient:function () {
			  return this.startColor !== this.stopColor
			},
			containerStyle:function () {
			  return {
				height: this.diameter + 'px',
				width: this.diameter + 'px',
				
			  }
			},
			progressStyle:function () {
			  return {
				height: this.diameter + 'px',
				width: this.diameter + 'px',
				strokeWidth: this.strokeWidth + 'px',
				strokeDashoffset: this.strokeDashoffset,
				transition: 'stroke-dashoffset ' + this.animateSpeed+ 'ms ' + this.timingFunc 
			  }
			},
			strokeStyle:function () {
			  return {
				height: this.diameter + 'px',
				width: this.diameter + 'px',
				strokeWidth: this.strokeWidth + 'px',
			  }
			},
			innerCircleStyle:function () {
			  return {
				width: this.innerCircleDiameter + 'px'
			  }
			}
		},
		methods: {
			getStopPointsOfCircle:function (steps) {
			  var points = []
			  for (var i = 0; i < steps; i++) {
				var angle = this.circleSlice * i
				points.push(this.getPointOfCircle(angle))
			  }
			  return points
			},
			getPointOfCircle:function (angle) {
			  var radius = 0.5
			  var x = radius + (radius * Math.cos(angle))
			  var y = radius + (radius * Math.sin(angle))
			  return { x:x, y:y }
			},
			gotoPoint: function() {
			  var point = this.getPointOfCircle(this.currentAngle)
			  this.gradient.fx = point.x
			  this.gradient.fy = point.y
			},
			changeProgress:function (isAnimate) {
				if(isAnimate === undefined){
					isAnimate = true
				}
			  this.strokeDashoffset = ((100 - this.finishedPercentage) / 100) * this.circumference
			  if (this.gradientAnimation) {
				clearInterval(this.gradientAnimation)
			  }
			  if (!isAnimate) {
				this.gotoNextStep()
				return
			  }
			  var angleOffset = (this.completedSteps - 1) * this.circleSlice
			  var i = (this.currentAngle - angleOffset) / this.animateSlice
			  var incrementer = Math.abs(i - this.totalPoints) / this.totalPoints
			  var isMoveForward = i < this.totalPoints
			  this.gradientAnimation = setInterval(function(){
				if (isMoveForward && i >= this.totalPoints ||
					!isMoveForward && i < this.totalPoints) {
				  clearInterval(this.gradientAnimation)
				  return
				}
				this.currentAngle = angleOffset + (this.animateSlice * i)
				this.gotoPoint()
				i += isMoveForward ? incrementer : -incrementer
			  }, this.animationIncrements)
			},
			gotoNextStep:function () {
			  this.currentAngle = this.completedSteps * this.circleSlice
			  this.gotoPoint()
			}
		},
		watch: {
			totalSteps:function () {
			  this.changeProgress({ isAnimate: true })
			},
			completedSteps:function () {
			  this.changeProgress({ isAnimate: true })
			},
			diameter:function () {
			  this.changeProgress({ isAnimate: true })
			},
			strokeWidth:function () {
			  this.changeProgress({ isAnimate: true })
			}
		},
		created:function () {
			this.changeProgress({ isAnimate: false })
		}
	});
	
	
	__allvuecomponentscript
	Vue.component('componentnotfound',ComponentNotFound);
	Vue.component('appheader',AppHeader);
	
	
	Vue.component('pagination',Pagination);
	Vue.component('thsort',ThSort);
	Vue.component('recordcount',RecordCount);
	Vue.component('recordprogress', RecordProgress);
	Vue.component('nicemenu',NiceMenu);
	Vue.component('datamenu',DataMenu);
	Vue.component('datadropmenu',DataDropMenu);
	Vue.component('datanavmenu',DataNavMenu);
	Vue.component('FileUpload',VueUploadComponent);
	Vue.component('niceupload',NiceUpload);
	Vue.component('nicechart',NiceChart);
	Vue.component('htmleditor',HtmlEditor);
	Vue.component('v-select', VueSelect.VueSelect);
	Vue.component('optionlist', OptionList);
	Vue.component('dataselect', DataSelect);
	Vue.component('datavselect', DataVSelect);
	Vue.component('datacheck', DataCheck);
	Vue.component('dataradio', DataRadio);
	Vue.component('nicetoggle', NiceToggle);
	Vue.component('radialprogress', RadialProgress);
	Vue.component('niceimg', NiceImg);
	Vue.component('niceformwizard', NiceFormWizard);
	Vue.component('wizardbtn', WizardBtn);
	Vue.component('nicecarousel', NiceCarousel);
	Vue.component('vueSlider', window[ 'vue-slider-component' ]);
	Vue.component('dataimport', DataImport);
	
	__vueflatpickrcomponent
	__vuetrumbowygcomponent
	
	Vue.component('PulseLoader',VueSpinner.PulseLoader);
	Vue.component('GridLoader',VueSpinner.GridLoader);
	Vue.component('ClipLoader',VueSpinner.ClipLoader);
	Vue.component('RiseLoader',VueSpinner.RiseLoader);
	Vue.component('BeatLoader',VueSpinner.BeatLoader);
	Vue.component('SyncLoader',VueSpinner.SyncLoader);
	Vue.component('RotateLoader',VueSpinner.RotateLoader);
	Vue.component('FadeLoader',VueSpinner.FadeLoader);
	Vue.component('SquareLoader',VueSpinner.SquareLoader);
	Vue.component('PacmanLoader',VueSpinner.PacmanLoader);
	Vue.component('ScaleLoader',VueSpinner.ScaleLoader);
	Vue.component('SkewLoader',VueSpinner.SkewLoader);
	Vue.component('MoonLoader',VueSpinner.MoonLoader);
	Vue.component('BounceLoader',VueSpinner.BounceLoader);
	Vue.component('DotLoader',VueSpinner.DotLoader);


	Vue.filter('toUSD', function (value) {
		return '$'+ value;
	});
	Vue.filter('upper', function (value) {
		return value.toUpperCase();
	});
	Vue.filter('lower', function (value) {
		return value.toLowerCase();
	});
	Vue.filter('proper', function (value) {
		return value.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	});
	Vue.filter('truncate', function (text, length, suffix) {
		return text.substring(0, length) + suffix;
	});
	Vue.filter('toFixed', function (price, limit) {
		return price.toFixed(limit);
	});
	
	Vue.filter('min', function (values) {
		return Math.min(values);
	});
	
	Vue.filter('max', function (values) {
		return Math.max(values);
	});
	Vue.filter('humanDate', function (datestr) {
		var timeStamp = new Date(datestr);
		return timeStamp.toDateString();
	});
	Vue.filter('humanTime', function (datestr) {
		var timeStamp = new Date(datestr);
		return timeStamp.toLocaleTimeString();
	});
	
	Vue.filter('toLocaleString', function (val) {
		return val.toLocaleString();
	});
	
	Vue.filter('relativeTime', function (datestr) {
		if(!datestr) {
			return "Null Date";
		}
		
		var msPerMinute = 60 * 1000;
		var msPerHour = msPerMinute * 60;
		var msPerDay = msPerHour * 24;
		var msPerMonth = msPerDay * 30;
		var msPerYear = msPerDay * 365;
		
		var current= new Date();
		
		var previous= new Date(datestr);
		
		var timestamp = Date.parse(datestr);

		if (isNaN(timestamp) == true) {
			return "Invalid Date";
		}
		
		var d = new Date(timestamp);
		var elapsed = current - previous;
		if (elapsed < msPerMinute) {
			 return Math.round(elapsed/1000) + ' seconds ago';   
		}
		else if (elapsed < msPerHour) {
			 return Math.round(elapsed/msPerMinute) + ' minutes ago';   
		}
		else if (elapsed < msPerDay ) {
			 return Math.round(elapsed/msPerHour ) + ' hours ago';   
		}
		else if (elapsed < msPerMonth) {
			return  Math.round(elapsed/msPerDay) + ' days ago';   
		}
		else if (elapsed < msPerYear) {
			return Math.round(elapsed/msPerMonth) + ' months ago';   
		}
		else {
			return Math.round(elapsed/msPerYear ) + ' years ago';   
		}
		
	});
	
	Vue.filter('shuffle', function (values) {
		for (var i = values.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = values[i];
			values[i] = values[j];
			values[j] = temp;
		}
		return values;
	});
	Vue.filter('repeat', function (string, times) {
		return string.repeat(times);
	});	