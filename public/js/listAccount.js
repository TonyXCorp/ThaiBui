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
		_delete (a){
			socket.emit('delAccount',a)
			socket.emit('account_list')
				socket.on ('account_list',u=>{
				return app.fileBase=u})
		},
	},
	computed:{
	}
})
socket.emit('account_list')
	socket.on ('account_list',u=>{
		console.log(u)
		return this.app.fileBase=u})