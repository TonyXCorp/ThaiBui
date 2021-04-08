var socket = io('http://localhost:1212')
var app = new Vue({
	el:'#index',
	data: {
		slA:"",
		slV:""
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
		return this.app.slA=u.length})
	socket.emit('video_list')
	socket.on ('video_list',u=>{
		return this.app.slV=u.length})