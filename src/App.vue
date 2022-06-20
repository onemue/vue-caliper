<template>
  <div id="app">
    <header>
      <h1>{{ title }}</h1>
    </header>
    <main>
      <div class="container">
          <div v-show="imageUrl" class="image-cotainer" :class="imageUrl?'':'none'" ref="imageCotainer"
            @mousemove="mouseMove"
            @mousedown="mouseDown"
            @mouseup="mouseUp"
          > 
            <div class="caliper"></div>
            <img  :src="imageUrl" alt="选中的图片">
            <div class="historys">
              <div v-for="item in operationRecord" :key="item.id" class="historys-caliper" :data-size="item.size" :style="item.style">
                <div class="close" @click="closeOperationRecord(item.id)">x</div>
              </div>
            </div>
            <div class="selector"></div>
          </div>
          <!-- 拖拽上传图片 -->

          <div v-show="!imageUrl" class="image-cotainer none" @click="getImageUrl" @drop.prevent="getImageUrlDrag"
            @dragleave.prevent @dragenter.prevent @dragover.prevent>
            <span>点击或拖拽图片</span>
          </div>
      </div>
    </main>
    <footer>
      <span>{{ copyright }}</span>
      <span>{{ newSize }}</span>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Caliper',
      copyright: '© 2020 Caliper',
      newSize: '0x0',
      imageUrl: '',
      operationRecord: [],
      historys: [],
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
        }
      }
      input.click();
    },
    closeOperationRecord(id){
      this.operationRecord = this.operationRecord.filter(item=>item.id!=id);
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
        // var item = {
        //     name: file.name,
        //     uploadPercentage: 67
        // };
        if (/^image\/.*$/.test(file.type)) {
            var reader = new FileReader(file);
            reader.onload = (e) => {
                this.imageUrl = e.target.result;
            };
            reader.readAsDataURL(file);
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
        this.newSize = `${this.end.x - this.start.x}x${this.end.y - this.start.y}`;
        caliper.classList.add('active');
    }
  },
  mounted() {
    var dropbox = document.querySelector('.image-cotainer.none');
    dropbox.addEventListener('dragenter', this.onDrag, false);
    dropbox.addEventListener('dragover', this.onDrag, false);
    dropbox.addEventListener('drop', this.onDrop, false);
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
  height: calc(100vh - 96px);
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

.caliper:after,
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
  buttom: -24px;
  transform: translateY(-24px) translateX(-1px);
  padding: 0 8px;
  content: attr(data-size);
  color: #ffffff;
  background: rgba(0, 0, 0, 0.3);
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
  height: 32px;
  line-height: 32px;
  margin-right: 16px;
}
</style>
