
var ListPageMixin = {
	props: {
		resetgrid : {
			type : Boolean,
			default : false,
		},
		page : {
			type : Number,
			default : 1,
		},
		search : {
			type : String,
			default : '',
		},
		fieldname : {
			type : String,
			default : '',
		},
		fieldvalue : {
			type : String,
			default : '',
		},
		sortby : {
			type : String,
			default : '',
		},
		sorttype : {
			type : String,
				default : '', //desc or asc
			},
			backbutton : {
				type : Boolean,
				default : true,
			},
			showheader : {
				type : Boolean,
				default : true,
			},
			showfooter: {
				type : Boolean,
				default : true,
			},
		},
		data: function () {
			return {
				loading : false,
				ready: false,
				loadcompleted : false,
				selected:[],
				allSelected: false,
				totalrecords :1,
				records : [],
				includeFilters : true,
				filterParams:{},
				deleting : null,
				currentpage : 1,
				orderby : '',
				ordertype : '',
				filterby : '',
				filterText : '',
				filtervalue : '',
				filterMsgs : [],
				searchtext : '',
				errorMsg : '',
				modalComponentName: '',
				modalComponentProps: '',
				popoverTarget : '',
				showError: false,
			}
		},
		computed: {
			apiUrl: function() {
				var path = this.apipath;
				if(this.filterby){
					path = path + '/' + encodeURIComponent(this.filterby) + '/' + encodeURIComponent(this.filtervalue);
				}
				var query = {
					page : this.currentpage,
					limit : this.pagelimit,
					orderby : this.orderby,
					ordertype : this.ordertype,
					search : this.searchtext,
				};
				if(this.includeFilters == true){
					query =  extend(query , this.filterParams);
				}
				var url = setApiUrl(path , query);
				return url;
			},
			shouldLoad: function(){
				if(this.$route.name != this.routename){
					return false;
				}
				else{
					if(this.loading || this.loadcompleted || !this.paginate){
						return false;
					}
					else{
						return true;
					}
				}
			},
			currentItemsCount: function(){
				return this.records.length;
			},
			setGridSize: function(){
				if(this.resetgrid){
					return 'col-sm-12 col-md-12 col-lg-12';
				}
			},
		},
		watch : {
			fieldvalue: function(){
				this.records = [];
				this.loadcompleted = false;
				this.filterby = this.fieldname;
				this.filtervalue = this.fieldvalue;
				this.load();
			},
			
			filterGroupChange: function(){
				this.filterGroup();
			},
		},
		methods:{
			sort: function(fieldname){
				this.orderby = fieldname;
				if(this.ordertype == 'desc'){
					this.ordertype = 'asc'
				}
				else{
					this.ordertype = 'desc'
				}
				this.records = [];
				this.load();
			},
			limitChanged: function(num){
				this.pagelimit = num;
				this.load();
			},
			changepage: function(page){
				this.currentpage = page;
				this.load();
			},
			dosearch: function(){
				if(this.searchtext){
					this.filterMsgs = ["Search: " +  this.searchtext];
				}
				else{
					this.filterMsgs = [];
				}
				this.includeFilters = false;
				this.records = [];
				this.load();
				this.includeFilters = true;
			},
			
			filter: function(filter){
				this.records = [];
				this.loadcompleted = false;
				this.filterParams = filter;
				this.load();
			},
			
			showPageModal: function(compProps){
				this.$root.$emit('showPageModal' , compProps);
			},
			
			deleteRecord : function(recid , index){
				var recids = recid || this.selected.toString();
				if(recids){
					var prompt = this.promptmessagebeforedelete;
					
					if (prompt != ""){
						if(!confirm(prompt)){
							return;
						}
					}
					var url = setApiUrl(this.pagename + '/delete/' + recids);
					this.deleting = recid;
					this.$http.get(url).then(function (response) {
						if(index){
							this.deleting = null;
							this.records.splice(index,1);
							if(this.msgafterdelete){
								this.$root.$emit('requestCompleted' , this.msgafterdelete);
							}
						}
						else{
							this.load();
						}
					},
					function (response) {
						this.deleting = null;
						this.errorMsg = response.statusText;
						this.showError = true;
					});
				}
			},
			exportRecord : function(){
				this.exportPage(this.$refs.datatable.innerHTML, this.pageTitle);
			},
		},
		mounted : function() {
			this.showError = false;
			this.filterby = this.fieldname;
			this.filtervalue = this.fieldvalue;
			this.pagelimit = this.limit;
			this.page = this.page;
			
			if(this.$route.query.sortby){
				this.orderby = this.$route.query.sortby;
			}
			else{
				this.orderby = this.sortby;
			}
			
			if(this.$route.query.sorttype){
				this.ordertype = this.$route.query.sorttype;
			}
			else{
				this.ordertype = this.sorttype;
			}

			this.searchtext = this.search;
			this.load();
		},

		created: function(){
			var vm = this;
			bus.$on('refresh' , function(){
				vm.load();
			});
		},
}

var ViewPageMixin = {
	props: {
		id : {
			type : String,
			default : '',
		},
		fieldname : {
			type : String,
			default : '',
		},
		fieldvalue : {
			type : String,
			default : '',
		},
		isModal : {
			type : Boolean,
			default : false,
		},
		backbutton : {
			type : Boolean,
			default : true,
		},
		showheader : {
			type : Boolean,
			default : true,
		},
		showfooter: {
			type : Boolean,
			default : true,
		},
	},
	data : function() {
		return {
			filterby : '',
			filtervalue : '',
			ready : false,
			loading : false,
			showError: false,
			errorMsg : '',
		}
	},
	computed: {
		setGridSize: function(){
			if(this.resetgrid){
				return 'col-sm-12 col-md-12 col-lg-12';
			}
		},
		apiUrl: function() {
			var path = this.apipath;
			if(this.filterby){
				path = path + '/' + this.filterby + '/' + this.filtervalue;
			}
			else{
				path = path + '/' + this.id
			}
			var url = setApiUrl(path);
			return url;
		},
	},
	methods :{
		load : function(){
			this.resetData();
			this.loading = true;
			this.showError = false;
			this.ready = false;
			this.$http.get(this.apiUrl).then(function (response) {
				this.loading = false;
				this.ready = true;
				if(response.body){
					this.data = response.body;
				}
				else{
					this.$root.$emit('requestError' , response);
				}
				
			},
			function (response) {
				this.loading = false;
				this.$root.$emit('requestError' , response);
			});
		},
		deleteRecord : function(recid){
			var recid = this.id;
			var prompt = this.promptmessagebeforedelete;
			if (prompt != ""){
				if(!confirm(prompt)){
					return;
				}
			}
			var url = setApiUrl( this.pagename + '/delete/' + recid);
			this.$http.get(url).then(function (response) {
				if(this.msgafterdelete){
					this.$root.$emit('requestCompleted' , this.msgafterdelete);
					this.$router.push(url);
				}
			},
			function (response) {
				this.errorMsg = response.statusText;
				this.showError = true;
			});
		},
		showPageModal: function(compProps){
			this.$root.$emit('showPageModal' , compProps);
		},
		
		exportRecord : function(){
			this.exportPage(this.$refs.datatable.innerHTML, this.pageTitle);
		}
	},
	watch : {
		id : function(){
			if(this.id){
				this.load();
			}
		},
		fieldname : function(){
			this.filterby = this.fieldname;
			this.filtervalue = this.fieldvalue;
			this.load();
		},
		fieldvalue : function(){
			this.filterby = this.fieldname;
			this.filtervalue = this.fieldvalue;
			this.load();
		},
		'$route': function(route){
			if(route.name == this.routename ){
				this.SetPageTitle( this.pageTitle );
			}
		},
	},
	created: function(){
		var vm = this;
		bus.$on('refresh' , function(){
			vm.records = [];
			vm.load();
		});
	},
	mounted : function() {
		this.filterby = this.fieldname;
		this.filtervalue = this.fieldvalue;
		this.load();
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	},
}

var AddPageMixin = {
	props:{
		resetgrid : {
			type : Boolean,
			default : false,
		},
		showheader : {
			type : Boolean,
			default : true,
		},
		
		submitAction : {
			type : String,
			default : 'submit',
		},
		informwizard : {
			type : Boolean,
			default : false,
		},
		
		modelBind: {
			type: Object,
			default: function () { return {} }
		}
	},
	data : function() {
		return {
			saving : false,
			ready : false,
			errorMsg : '',
			showError: false,
		}
	},
	computed: {
		setGridSize: function(){
			if(this.resetgrid){
				return 'col-sm-12 col-md-12 col-lg-12';
			}
		}
	},
	watch: {
		'$route': function(route){
			if(route.name == this.routename ){
				this.SetPageTitle( this.pageTitle );
			}
		},
	},
	methods : {
		
	},
	created: function(){
		
	},
	mounted : function() {
		this.showError = false;
		this.ready = true;
	},
}

var EditPageMixin = {
	props: {
		id : {
			type : String,
			default : '',
		},
		resetgrid : {
			type : Boolean,
			default : false,
		},
		
		showheader : {
			type : Boolean,
			default : true,
		},
		informwizard : {
			type : Boolean,
			default : false,
		},
		
		submitAction : {
			type : String,
			default : 'submit',
		},
		backbutton : {
			type : Boolean,
			default : true,
		},
		ismodal : {
			type : Boolean,
			default : false,
		},
		modelBind: {
			type: Object,
			default: function () { return {} }
		}
	},
	data: function() {
		return {
			errorMsg : '',
			showError: false,
			loading : false,
			ready: false,
			saving : false,
		}
	},
	computed: {
		setGridSize: function(){
			if(this.resetgrid){
				return 'col-sm-12 col-md-12 col-lg-12';
			}
		}
	},
	methods: {
		
	},
	watch: {
		id: function(newVal, oldVal) {
			if(this.id){
				this.load();
			}
		},
		'$route': function(route){
			if(route.name == this.routename ){
				this.SetPageTitle( this.pageTitle );
			}
		},
	},
	created: function(){

	},
	mounted: function() {
		this.load();
	},
}
/*
var GoogleMapMixin = {
	props: {
		resetgrid : {
			type : Boolean,
			default : false,
		},
		
	},
	data: function () {
		return {
			map: null,
			loading: false,
			placesService: null,
			geocoder: null,
			markers:[ {
				position:{lat: 5.559256, lng: -0.275351},
				animation:2,
				label:'',
			}],
			marker:{},
			placeSearchText:'',
			places:[],
			placesFilters:[],
			placeRadius:500,
			center: { lat: 5.559256, lng: -0.275351 },
			currentPlace:null,
			infoContent: '',
			infoWindowPos: null,
			infoWinOpen: false,
		}
	},

	computed: {
		
	},

	watch : {
		placesFilters: function(){
			var latLng = this.marker.position
			this.getNearByPlaces(latLng);
		},
	},

	methods:{
		setCurrentPlace: function(place) {
			this.currentPlace = place;
		},
		mapClick: function(evt){
			var latLng = evt.latLng;
			this.getNearByPlaces(latLng);
		},
		openInfoWindow: function(evt, marker) {
			this.infoWindowPos = evt.latLng;
			this.infoContent = marker.infoText;
			this.infoWinOpen = true;
		},
		getNearByPlaces:function(latLng){
			var request = {
				location: latLng,
				radius: this.placeRadius,
				type: this.placesFilters,
				fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry'],
			};
			var self = this;
			this.placesService.nearbySearch(request, 
				function (results, status) {
					if(status == google.maps.places.PlacesServiceStatus.OK) {
						console.log(results);
						self.places = results
					}
				}
			);
		},
		geocodeAddress: function (address, marker) {
       		this.geocoder.geocode({ 'address': address }, function (results, status) {
	            if (status == 'OK') {
                    marker.position = results[0].geometry.location;
	            } 
	            else {
	                console.log('Geocode was not successful for the following reason: ' + status);
	            }
	        });
	    },
		getPlaceDetail:function(placeId){
			var request = {
				placeId: placeId,
			};
			var self = this;
			this.placesService.nearbySearch(request, 
				function (results, status) {
					if(status == google.maps.places.PlacesServiceStatus.OK) {
						console.log(results);
						self.place = results
						//self.createMarkers(results)
					}
				}
			);
		},

		getPlaceSearch:function(place){
			var self = this;

			var request = {
			    query: self.placeSearchText,
			    fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry'],
			};

			this.placesService.findPlaceFromQuery(request, 
				function (results, status) {
					if(status == google.maps.places.PlacesServiceStatus.OK) {
						console.log(results);
						self.places = results
						//self.createMarkers(results)
					}
				}
			);
		},
		createMarkers:function (places) {
		    var bounds = new google.maps.LatLngBounds();
		    var image = {
		      url: place.icon,
		      size: new google.maps.Size(71, 71),
		      origin: new google.maps.Point(0, 0),
		      anchor: new google.maps.Point(17, 34),
		      scaledSize: new google.maps.Size(25, 25)
		    };
		    var marker = new google.maps.Marker({
		      map: this.map,
		      icon: image,
		      title: place.name,
		      position: place.geometry.location
		    });
			bounds.extend(place.geometry.location);
			this.map.fitBounds(bounds);
		},

		getUserLocation: function(){
			navigator.geolocation.getCurrentPosition(
				// Success callback
				function(position) {
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;
					var altitude = position.coords.altitude;
					var accuracy = position.coords.accuracy;
					var altitudeAccuracy = position.coords.altitudeAccuracy;
					var heading = position.coords.height;
					var speed = position.coords.speed;
					var timestamp = position.timestamp;

					this.center = {lat:latitude,lng:longitude};

				},
				// Error callback
				function(error){
					var code = error.code;
					var message = error.message;
					alert(message)
				}
			);
		}
	},
	mounted : function() {
		var self =this;
		self.$refs.mapCanvas.$mapPromise.then(function(){
		  	self.map =  self.$refs.mapCanvas.$mapObject;
		  	self.$gmapApiPromiseLazy().then(function(){ 
				var bounds = new google.maps.LatLngBounds();
				self.placesService = new google.maps.places.PlacesService(self.map);
				self.geocoder = new google.maps.Geocoder();
			})
		})
		//this.getUserLocation();
	},
	created: function(){
		var vm = this;
		bus.$on('refresh' , function(){

		});
	},
}*/