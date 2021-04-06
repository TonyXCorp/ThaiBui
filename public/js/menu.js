var app = new Vue({
	el:'#app',
	data: {
		fileBase:[{
			"STT" : '1',
			"file" : 'https://hoitruyentranh.com/attachments/dung-khoc-chapter-18-p-6-1-jpg.296949/',
			"status" : 'Comple',
		},{
			"STT" : '2',
			"file" : 'https://hoitruyentranh.com/attachments/dung-khoc-chapter-18-p-6-1-jpg.296949/',
			"status" : 'Comple',
		},{
			"STT" : '3',
			"file" : 'https://hoitruyentranh.com/attachments/dung-khoc-chapter-18-p-6-1-jpg.296949/',
			"status" : 'Comple',
		},{
			"STT" : '4',
			"file" : 'https://hoitruyentranh.com/attachments/dung-khoc-chapter-18-p-6-1-jpg.296949/',
			"status" : 'Comple',
		},],
		doDai:'', 
		router:'1',
	},
	created: function () {
    	this.doDai=this.fileBase.length;
  	},
	methods:{
		_getLink (a){console.log(a+'getLink')},
		_delete (a){console.log(a+'delete')},
		_deleteCache (a){console.log(a+'deleteCache')},
	},
	computed:{
	}
})