var socket = io('http://103.151.52.169:1212')
var app = new Vue({
	el:'#listVideo',
	data: {
		isShow:'none',
		link:'',
		fileBase:[],
		doDai:'', 
		viTri:3,
		rt:1,
		tongtab:'',
	},
	created: function () {
  	},
	methods:{
		_getLink (a){
			socket.emit("getLink", a)
		},
		_delete (a){
			socket.emit("delVideo", a)
			socket.emit('video_list')
				socket.on ('video_list',u=>{
				return app.fileBase=u,app.doDai=u.length,app.tongtab=Math.floor(u.length/50)+1})
		},
		_deleteCache (a){socket.emit("delCache", a)},
		_rt(n){
			this.rt=this.viTri+n-3
			if (this.rt>this.tongtab-2){
			this.vitri=this.tongtab-2} else
			if (this.rt-3<=0) {this.viTri=3}  else this.viTri=this.rt
			return this.viTri,this.rt
		}
	},
	computed:{
	}
})
socket.emit('video_list')
	socket.on ('video_list',u=>{
		console.log(u)
		return this.app.fileBase=u,this.app.doDai=u.length,this.app.tongtab=Math.floor(u.length/50)+1})
socket.on("alert", data=>{
	this.app.link=data
	this.app.isShow='block'
})