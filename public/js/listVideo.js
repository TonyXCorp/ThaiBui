var socket = io('http://localhost:1212')
var app = new Vue({
	el:'#listVideo',
	data: {
		fileBase:[],
		doDai:'', 
		router:'1',
	},
	created: function () {
  	},
	methods:{
		_getLink (a){console.log(a+'getLink')},
		_delete (a){console.log(a+'delete')},
		_deleteCache (a){console.log(a+'deleteCache')},
	},
	computed:{
	}
})
socket.emit('video_list')
	socket.on ('video_list',u=>{
		console.log(u)
		return this.app.fileBase=u})