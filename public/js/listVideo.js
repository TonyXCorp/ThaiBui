var socket = io('http://localhost:1212')
var app = new Vue({
	el:'#listVideo',
	data: {
		fileBase:[],
		doDai:'', 
		viTri:3,
		rt:1,
		tongtab:'',
	},
	created: function () {
  	},
	methods:{
		_getLink (a){console.log(a+'getLink')},
		_delete (a){console.log(a+'delete')},
		_deleteCache (a){console.log(a+'deleteCache')},
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