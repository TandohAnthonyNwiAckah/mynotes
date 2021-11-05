<template>
	<div class="row q-col-gutter-xs">
		<div v-for="(file, index) in files"  :key="index">
			<template v-if="removable">
				<q-chip square removable @remove="removeFile(index)" v-if="file.isImage">
					<q-avatar><image-viewer :src="file.path" :image-size="file.size"></image-viewer></q-avatar>
				</q-chip>
				<q-chip square :icon="icon" :label="label" removable @remove="removeFile(index)" clickable @click="openFile(file)" v-else></q-chip>
			</template>
			<template v-else>
				<q-btn no-caps unelevated color="accent" padding="xs" :icon="icon" :label="label" @click="openFile(file)">
					<q-tooltip content-class="bg-accent">
						{{ file.name }}
					</q-tooltip>
				</q-btn>
			</template>
		</div>
	</div>
</template>
<script>
    export default {
        props: {
            value: {
				type: String,
			},
			removable: {
				type: Boolean,
				default: false
			},
			label: {
				type: String,
				default: ""
			},
			icon: {
				type: String,
				default: "archive"
			},
			numDisplay: {
				type: Number, 
				required: false,
				default: 1
			}, 
        },
        data: function() {
            return {
				files: [],
            };
		},
		computed: {
			
		},
		watch: {
			value(){
				this.setFiles();
			},
			files: function(){
				let filePaths = [];
				this.files.forEach(file => {
					if(file.path){
						filePaths.push(file.path);
					}
				});
				this.$emit( 'input', filePaths.toString());
			},
		},
        methods: {
			openFile(file){
				if(file.path){
					let path = file.path
					let fullPath = this.$utils.getFileFullPath(path);
					window.open(fullPath, '_blank');
				}
			},
			setFiles(){
				if(this.value){
					let filePaths = this.value.toString().split(",");
					this.files = [];
					filePaths.forEach(path => {
						let fileName = path.split('\\').pop().split('/').pop();
						let ext = fileName.split('.').pop().toLowerCase();
						let imgExt = ['jpg', 'png', 'gif', 'jpeg', 'bmp'];
						let isImage = false;
						if(imgExt.indexOf(ext) > -1){
							isImage = true;
						}

						let size = "small"; //use resize image for the display
						if(path.indexOf("temp/") > -1){
							size = "";  //if image is still in temp folder use the original image
						}
						this.files.push({
							name: fileName,
							isImage: isImage,
							size: size,
							path: path
						})
					});
				}
			},
			removeFile(index){
				this.files.splice(index,1);
			}
		},
		mounted() {
			this.setFiles();
		},
    }
</script>
