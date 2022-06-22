<template>
  <div class="vc-operate">
    <div class="container" ref="container" 
      @mousedown.stop="moveContainerStart"
      @mousemove.stop="moveContainer"
      @mouseup.stop="moveContainerEnd"

      :style="{
        transform: `scale(${scale}) translateX(${translate.x/20}px) translateY(${translate.y/20}px)`
      }"
    >
      <img class="img" :src="data.url" alt="" srcset="" 
        @mouseup.stop  
        @mousedown.stop
        @mousemove.stop
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  },
  data(){
    return {
      scale: 1,
      isMove: false,
      translate: {
        x:0,
        y:0
      }
    }
  },
  mounted() {
    this.scale = this.data.scale
    console.log(this)
    //    给页面绑定鼠标滚轮事件,针对火狐的非标准事件 
    this.$refs.container.addEventListener("DOMMouseScroll", e=>this.scrollFunc(e), false)
    //    给页面绑定鼠标滚轮事件，针对Google，mousewheel非标准事件已被弃用，请使用 wheel事件代替
    this.$refs.container.addEventListener("wheel", e=>this.scrollFunc(e), false)
    //    ie不支持wheel事件，若一定要兼容，可使用mousewheel
    this.$refs.container.addEventListener("mousewheel", e=>this.scrollFunc(e), false)
  },
  methods:{
    scrollFunc(e) {
      // eslint-disable-next-line no-redeclare
      var e = e || window.event;
      if (e.wheelDelta) {
        if (e.wheelDelta > 0) {     //当鼠标滚轮向上滚动时
          this.scale+=0.1
        }
        if (e.wheelDelta < 0) {     //当鼠标滚轮向下滚动时
          this.scale-=0.1 
        }
      } else if (e.detail) {
        if (e.detail < 0) {   //当鼠标滚轮向上滚动时
          this.scale+=0.1
        }
        if (e.detail > 0) {   //当鼠标滚轮向下滚动时
          this.scale-=0.1 
        }
      }
      if(this.scale<=0) {
        this.scale = 0.1
      }
    },
    moveContainerStart(e){
      if(!e.ctrlKey){
        return
      }
      this.isMove = true

      this.startMove = {
        x: e.pageX,
        y: e.pageY
      }
    },
    moveContainer(e){
      if(!e.ctrlKey){
        return
      }
      if(!this.isMove){
        return
      }
      this.translate = {
        x: this.translate.x + (e.pageX - this.startMove.x),
        y: this.translate.y + (e.pageY - this.startMove.y)
      }
    },
    moveContainerEnd(){
      this.isMove = false
    }
  }
}
</script>

<style scoped>
.vc-operate {
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
}

.container {
  width: 100%;
  height: 100%;
}

.img {
  display: block;
  margin: 0 auto;
  -webkit-user-select: none;
  cursor: default;
  pointer-events: none;
}
</style>
