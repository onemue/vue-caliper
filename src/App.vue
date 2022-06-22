<template>
  <div id="app">
    <!-- <header>
      <h1>{{ title }}</h1>
    </header> -->
    <main>   
      <div class="container">
        <el-tabs v-if="operationMap.length!==0" v-model="tabsActive" type="border-card" editable @tab-click="handleClick">
          <el-tab-pane v-for="item,index in operationMap" :key="index" :label="item.label" :name="item.name">
            <vc-operate v-if="item.name!=='start'" :data="item.data"></vc-operate>
            <div v-else class="image-cotainer none" @click="getImageUrl" @drop.prevent="getImageUrlDrag"
              @dragleave.prevent @dragenter.prevent @dragover.prevent>
              <span>点击或拖拽图片</span>
            </div>
          </el-tab-pane>
        </el-tabs>
          <!-- <div v-show="imageUrl" class="image-cotainer" :class="imageUrl?'':'none'" ref="imageCotainer"
            @mousemove="mouseMove"
            @mousedown="mouseDown"
            @mouseup="mouseUp"
          > 
            <div class="caliper"></div>
            <img class="select-image" :src="imageUrl" alt="选中的图片">
            <div class="historys">
              <div v-for="item in operationRecord" :key="item.id" class="historys-caliper" :data-size="item.size" :style="item.style">
                <div class="close" @click="closeOperationRecord(item.id)">x</div>
              </div>
            </div>
            <div class="selector"></div>
          </div> -->
          <!-- 拖拽上传图片 -->
      </div>
    </main>
    <footer>
      <span v-for="item,index in Bus.footerDefault" :key="index" :title="item.title">
        {{
          footerItem(item)
        }}
      </span>
      <span v-for="item,index in Bus.footer" :key="index" :title="item.title">
        {{
          footerItem(item)
        }}
      </span>
    </footer>
  </div>
</template>

<script>
import VcOperate from "@/components/VcOperate.vue";
export default {
  components: {VcOperate},
  data() {
    return {
      title: 'Caliper',
      copyright: '© 2020 Caliper',
      newSize: '0*0',
      imageUrl: '',
      operationMap: [{
        label: '开始',
        name: 'start',
        closable: true,
      }],
      operationRecord: [],
      historys: [],
      tabsActive: 'start',
      isMouseDown: false,
      caliper: document.querySelector('.caliper'),
      start: {
          x: 0,
          y: 0
      },
      end: {
          x: 0,
          y: 0
      },
    }
  },
  methods: {
    footerItem(item){
      if (item.icon) return `<i class="${item.icon}"></i>`
      if (item.content) return item.content
      if (item.text) return item.text
      if (item.title) return item.title
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    closeOperationRecord(id){
      this.operationRecord = this.operationRecord.filter(item=>item.id!=id);
    },
    getImageUrl() {
      let input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e)=>{
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e)=>{
          this.imageUrl = e.target.result;
          this.operationMap.push({
              label: `caliper·${this.operationMap.length}`,
              name: `caliper_${this.operationMap.length}`,
              data: {
                url: e.target.result,
                scale: 1,
                position: [0,0],
                operationRecord: []
              }
          })
          this.tabsActive = `caliper_${this.operationMap.length-1}`
        }
      }
      input.click();
    },
    getImageUrlDrag (e){
        e.stopPropagation();
        e.preventDefault();
        var dt = e.dataTransfer;
        for (var i = 0; i !== dt.files.length; i++) {
            this.uploadFile(dt.files[i]);
            
        }
    },
    uploadFile: function (file) {
        if (/^image\/.*$/.test(file.type)) {
            var reader = new FileReader(file);
            reader.onload = (e) => {
                this.imageUrl = e.target.result;
            };
            reader.readAsDataURL(file);
            this.operationMap.push({
              label: `caliper·${this.operationMap.length}`,
              name: `caliper_${this.operationMap.length}`,
              data: {
                url: file,
                scale: 1,
                position: [0,0],
                operationRecord: []
              }
            })
            this.tabsActive = `caliper_${this.operationMap.length-1}`
        }
    },
    mouseMove(e) {
      let x = e.pageX;
      let y = e.pageY;
      if (this.isMouseDown) {
          // console.log(JSON.stringify(start), JSON.stringify(end), JSON.stringify(mouse));

          if (x<=this.start.x) {
              this.start.x = x;
          } else {
              this.end.x = x;
          }
          if (y<=this.start.y) {
              this.start.y = y;
          } else {
              this.end.y = y;
          }
          this.draw();
      }
      },
    mouseDown(e) {
          let x = e.pageX;
          let y = e.pageY;
          let mouse = {
              x: x,
              y: y
          };
          this.isMouseDown = true;
          this.start = JSON.parse(JSON.stringify(mouse));
          this.end = JSON.parse(JSON.stringify(mouse));
          this.draw();
      },
    mouseUp(e) {
          let x = e.pageX;
          let y = e.pageY;
          let screenWidth = window.innerWidth;
          let screenHeight = window.innerHeight;
          let newOperation = {
            id: this.historys.length,
            start: JSON.parse(JSON.stringify(this.start)),
            end: JSON.parse(JSON.stringify(this.end)),
            size: `${this.end.x-this.start.x}x${this.end.y-this.start.y}`,
            style: {
                left: `${this.start.x}px`,
                top: `${this.start.y}px`,
                right: `${screenWidth - this.end.x}px`,
                bottom: `${screenHeight - this.end.y}px`,
                zIndex: this.historys.length
            }
          }
          let mouse = {
              x: x,
              y: y
          };
          this.end = mouse;
          this.isMouseDown = false;
          // 小于4像素的矩形不显示
          if((this.end.x-this.start.x)>4 && (this.end.y-this.start.y)>4){
            this.historys.push(newOperation)
            this.operationRecord.push(newOperation)
            this.$store.addHistorys(newOperation)
            this.$store.addOperationRecord(newOperation)
          }

          let caliper = document.querySelector('.caliper')
          caliper.classList.remove('active');
      },
      draw() {
        let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;
        let caliper = document.querySelector('.caliper')

        caliper.style.display = 'block';
        caliper.style.top = this.start.y+'px';
        caliper.style.left = this.start.x+'px';
        caliper.style.bottom = Math.abs(screenHeight - this.end.y)+'px';
        caliper.style.right = Math.abs(screenWidth - this.end.x)+'px';
        caliper.setAttribute('data-size', `${this.end.x - this.start.x}x${this.end.y - this.start.y}`);
        this.newSize = `${this.end.x - this.start.x}✖${this.end.y - this.start.y}`;
        caliper.classList.add('active');
    }
  },
  mounted() {
    // var dropbox = document.querySelector('.image-cotainer.none');
    // dropbox.addEventListener('dragenter', this.onDrag, false);
    // dropbox.addEventListener('dragover', this.onDrag, false);
    // dropbox.addEventListener('drop', this.onDrop, false);
  }
}
</script>

<style>
/* header */
header {
  height: 64px;
}
header h1{
  font-size: 24px;
  line-height: 64px;
  color: #333;
}

/* main */
main {
  height: calc(100vh - 32px);
  overflow: hidden;
}
.container{
  height: 100%;
}
.caliper {
    background-color: transparent;
    border: 1px solid blue;
    position: absolute;
}

.caliper:hover:after,
.caliper.active:after {
    display: inline-block;
    line-height: 24px;
    transform: translateY(-24px) translateX(-1px);
    padding: 0 8px;
    content: attr(data-size);
    color: #ffffff;
    background: rgba(0, 0, 0, 0.3);
}

.historys-caliper{
  background-color: transparent;
  border: 1px solid blue;
  position: absolute;
}

.historys-caliper:hover{
  background: rgba(0, 0, 0, 0.3);
}

.historys-caliper .close{
  display: none;
  position: absolute;
  text-align: center;
  line-height: 24px;
  top: -24px;
  width: 24px;
  height: 24px;
  line-height: 24px;
  right: -1px;
}

.historys-caliper:hover >.close{
  display: block;
  background: rgba(0, 0, 0, 0.3);
  color: #ffffff;
}

.historys-caliper:hover:after {
  display: inline-block;
  line-height: 24px;
  position: absolute;
  bottom: -24px;
  transform: translateY(-24px) translateX(-1px);
  padding: 0 8px;
  content: attr(data-size);
  color: #ffffff;
  background: rgba(0, 0, 0, 0.3);
}
.select-image{
  pointer-events: none;
  display: block;
  margin: 0 auto;
}
.image-cotainer{
  height: 100%;
}
.image-cotainer.none{
  background: #F5F6F7;
}
.image-cotainer.none{
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 4px);
  text-align: center;
  font-size: 24px;
  color: #bbb;
}
.image-cotainer.none>span{
  height: 64px;
  line-height: 64px;
}
.selector{
  width: 100%;
  height: 100%;
  z-index: 99999;
}
/* footer */
footer {
  height: 32px;
  line-height: 32px;
  color: #eee;
  background: rgb(0, 122, 204);
}
footer span {
  display: inline-block;
  padding: 0 8px;
  height: 32px;
  line-height: 32px;
  margin-right: 16px;
}
footer span:hover{
  background: rgb(0, 122, 164);
}

.el-tabs.el-tabs--top.el-tabs--border-card{
  height: 100%;
}
.el-tabs--border-card>.el-tabs__content.el-tabs__content{
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.el-tab-pane {
  height: 100%;
  overflow-y: auto;
}
</style>
