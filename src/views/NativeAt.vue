<template>
    <div class="content">
        <h3>原生js实现@功能(PC端)</h3>
        <div class="top">
            <button @click="getRemindContent">点击快捷调取@功能</button>
        </div>
        <div id="at-editor" class="at-editor" contenteditable="true" @input="listenIpt" @blur="getSelecRange"></div>
        <div id="remind-content">
            <div class="remind-body" v-show="remindShow">
                <input type="text" placeholder="关键词" class="search" id="search" @input="searchIpt" v-model="keyval" autocomplete="false" />
                <ul>
                    <li v-for="v in list" :key="v.id" class="col" v-html="brightenKeyword(v.name,keyval)" @click.stop="addReMind(v)"></li>
                </ul>
            </div>
        </div>
        <div class="whitemask" v-show="maskShow" @click="hideMask"></div>
    </div>
</template>
<script>
import 'jquery.caret/dist/jquery.caret.min.js';
export default {
    data(){
        return{
            remindShow:false,
            maskShow:false,
            list:[{id:1,name:'张三'},{id:2,name:'李四'},{id:3,name:'王五'}],
            keyval:'',
            orglist:[{id:1,name:'张三'},{id:2,name:'李四'},{id:3,name:'王五'}],
            lastSelection:{
                range:null,
                selection:null
            }
        }
    },
    methods:{
        /* 监听输入 */
        listenIpt(e){
            if(e.data=="@"){
                this.showAtContent();
            }
        },
         /* 获取输入框失去焦点时的光标位置 */
        getSelecRange(){
            let selection = getSelection(),
                range  = selection.getRangeAt(0);
            this.lastSelection={
                range:range,
                selection:selection
            };
        },
        /* 显示@框 */
        showAtContent(){
            this.remindShow=true;
            this.maskShow=true;
            //使用caret定位@框的位置
            var offset =  $("#at-editor").caret('offset');
            $('#remind-content').offset({left: offset.left + 30, top: offset.top });
            $("#search").focus();
        },
        /* 快捷方式调取@列表 */
        getRemindContent(){
            //如果selection没有内容-重新获取焦点获取选取信息
            if(!this.lastSelection.range){
                $("#at-editor").focus();
                let nselection = getSelection(),
                nrange  = nselection.getRangeAt(0);
                this.lastSelection={
                    range:nrange,
                    selection:nselection
                };
            }
            let {selection,range}=this.lastSelection;
            //手动添加@符号给信息框
            let  spanNode1=document.createElement("span");
            spanNode1.innerHTML='@';
            var frag=document.createDocumentFragment();
            let lastNode=frag.appendChild(spanNode1.firstChild);

            //填入内容并且重新设置焦点位置
            range.insertNode(frag);
            let contentRange = range.cloneRange();  //克隆选区
            contentRange.setStartAfter(lastNode);          //设置光标位置为插入内容的末尾
            contentRange.collapse(true);                   //移动光标位置到末尾
            selection.removeAllRanges();                  //移出所有选区
            selection.addRange(contentRange);//添加修改后的选区
            //显示@列表
            this.showAtContent();
        },
        /* 新增@人员 */
        addReMind(val){
            let {selection,range} = this.lastSelection;
            let textNode=range.startContainer;

            //删除页面中@符号
            range.setStart(textNode,range.endOffset-1);
            range.setEnd(textNode,range.endOffset);
            range.deleteContents();
            this.rangeAdd(val);
            this.remindShow=false;
            this.maskShow=false;
            this.keyval='';
        },
        /* 添加@内容及重新定义光标位置 */
        rangeAdd(item){
            let {selection,range} = this.lastSelection;
            //创建button存放@内容
            var button1=document.createElement("button");
            button1.setAttribute("contenteditable","false");
            button1.setAttribute("atuid",item.id);
            button1.innerHTML='@'+item.name+"&nbsp";
            button1.className='setatbutton';
            var frag=document.createDocumentFragment();
            let lastNode=frag.appendChild(button1);

            //填入内容并且重新设置焦点位置
            range.insertNode(frag);
            let contentRange = range.cloneRange();  //克隆选区
            contentRange.setStartAfter(lastNode);          //设置光标位置为插入内容的末尾
            contentRange.collapse(true);                   //移动光标位置到末尾
            selection.removeAllRanges();                  //移出所有选区
            selection.addRange(contentRange);//添加修改后的选区
        },
        /* 取消@ -@列表隐藏信息框重新定位光标位置*/
        cancleRemind(){
            let selection=this.lastSelection.selection;
            let range=this.lastSelection.range;
            let contentRange = range.cloneRange();  //克隆选区
            contentRange.collapse(true);      //移动光标位置到末尾
            selection.removeAllRanges();     //移出所有选区
            selection.addRange(contentRange);//添加修改后的选区
        },
        /* 监听搜索-输入框 */
        searchIpt(){
            let reg=new RegExp(`${this.keyval}`, 'gi');
            let data=[];
            this.orglist.forEach(function(item){
                reg.lastIndex=0;
                if(reg.test(item.name)){
                    data.push(item);
                }
            });
            this.list=data;
        },
        /* 高亮-关键词 */
        brightenKeyword(val,keyword) {
            val = val + '';
            if (val.indexOf(keyword) !== -1 && keyword !== '') {
                return val.replace(keyword, '<font style="color:red;">' + keyword + '</font>')
            } else {
                return val;
            }
        },
        /* 隐藏遮罩|@弹框 */
        hideMask(){
            this.cancleRemind();
            this.remindShow=false;
            this.maskShow=false;
            this.keyval='';
        }
    }
}
</script>
<style lang="less" scoped>
.content{
    padding:100px;
    font-size:14px;
    position: relative;
    .top{
        margin-top:20px;
        button{
            background: #41b883;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 12px;
            margin-left: 5px;
            height: 40px;
            text-align: center;
            line-height: 40px;
            padding:0 6px;
            border:none;
            outline: none;
        }
    }
    .at-editor{
        border:1px solid #ccc;
        width:300px;
        height:200px;
        margin-top:40px;
        padding:14px;
    }
    .remind-body{
        padding: 14px 10px 0;
        width: 230px;
        background: #fff;
        box-shadow: 0 0 8px rgba(0,0,0,0.1);
        height: 320px;
        position: absolute;
        z-index: 2;
        .search{
            width:100%;
            height:30px;
            border:1px solid #ccc;
            outline: none;
            padding:6px;
        }
        .col{
            line-height: 32px;
            padding-left:6px;
        }
    }
    .whitemask{
        position: fixed;
        background: #fff;
        z-index: 1;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
    }
}
</style>
