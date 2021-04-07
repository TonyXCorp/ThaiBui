var socket = io('http://localhost:1212')
var app = new Vue({
	el:'#listAccount',
	data: {
		fileBase:[],
		doDai:'', 
		router:'1',
	},
	created: function () {
  	},
	methods:{
		_delete (a){console.log(a+'delete')},
		_deleteCache (a){console.log(a+'deleteCache')},
	},
	computed:{
	}
})
socket.emit('account_list')
	socket.on ('account_list',u=>{
		console.log(u)
		return this.app.fileBase=u})