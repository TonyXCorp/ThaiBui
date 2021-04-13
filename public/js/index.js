var socket = io('http://localhost:1212')
var app = new Vue({
	el:'#index',
	data: {
		totalV:"",
		totalA:"",
		completeV: "",
		errorV: "",
		pendingV: "",
		erruploadV: ""
	},
	created: function () {
  	},
	methods:{
	},
	computed:{
	}
})
socket.emit('account_list')
	socket.on ('account_list',u=>{
		return this.app.totalA=u.length})
	socket.emit('video_list')
	socket.on ('video_list',u=>{
		return this.app.totalV=u.length})
	socket.emit('complete_list')
	socket.on ('complete-list',u=>{
		return this.app.completeV=u.length})
	socket.emit('error_list')
	socket.on ('error_list',u=>{
		return this.app.errorV=u.length})
	socket.emit('pending_list')
	socket.on ('pending_list',u=>{
		return this.app.pendingV=u.length})
	socket.emit('errupload_list')
	socket.on ('errupload_list',u=>{
		return this.app.erruploadV=u.length})	