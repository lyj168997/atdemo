<template>
    <div class="content">
        <h3>引用kindeditor插件(PC端)</h3>
        <div class="top">
            <button @click="getRemindContent">点击快捷调取@功能</button>
        </div>
        <textarea id="editor_id" name="content">
        </textarea>
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
import 'kindeditor/themes/default/default.css'
import 'kindeditor/kindeditor-all.js';
import 'kindeditor/lang/zh-CN.js';
import 'jquery.caret/dist/jquery.caret.min.js';
export default {
    data(){
        return {
            remindShow:false,
            maskShow:false,
            list:[{id:1,name:'张三'},{id:2,name:'李四'},{id:3,name:'王五'}],
            keyval:'',
            orglist:[{id:1,name:'张三'},{id:2,name:'李四'},{id:3,name:'王五'}],
            fromIn:'1',//1:输入@调取列表  2:快捷方式调取列表
            lastSelection:{
                range:null,
                selection:null
            }
        }
    },
    methods:{
        /* 初始化kindeditor编辑器 */
        initEditor(){
            let _this=this;
            KindEditor.ready(function(K){
                _this.editor=K.create("#editor_id",{
                    minWidth:'300',
                    minHeight:'200',
                    items:[],
                    afterCreate:function(){
						let self=this;
                        console.log(this.edit.doc);
                        console.log(KindEditor.query('.ke-content',this.edit.doc));
                        let ifr=$(".ke-edit-iframe")[0];
                        let ifrBody = ifr.contentDocument.body;
                        ifrBody.contentEditable = true;
                        $(ifrBody).on('input',function(e){
                            if(e.originalEvent.data=='@'){
                                _this.fromIn=1;
                                let selection = self.edit.doc.getSelection();
                                let range  = selection.getRangeAt(0);
                                _this.lastSelection={
                                    range:range,
                                    selection:selection
                                };
                                let offset = $(ifrBody).caret('offset', {iframe: ifr});
                                offset.left += $(ifr).offset().left;
                                offset.top += $(ifr).offset().top;
                                $('#remind-content')
                                .offset({left: offset.left, top: offset.top + offset.height + 2});
                                _this.remindShow=true;
                                _this.maskShow=true;
                                $(this).blur();
                            }
                        })
					}
                });
            })
        },
        /* 快捷方式键入@ */
        getRemindContent(){
            this.fromIn=2;
            let ifr=$(".ke-edit-iframe")[0];
            let ifrBody = ifr.contentDocument.body;
             let offset = $(ifrBody).caret('offset', {iframe: ifr});
            offset.left += $(ifr).offset().left;
            offset.top += $(ifr).offset().top;
            $('#remind-content')
            .offset({left: offset.left, top: offset.top + offset.height + 2});
            this.remindShow=true;
            this.maskShow=true;
        },
        /* 列表点击事件 */
        addReMind(val){
            if(this.fromIn==1){
                this.editorAt(val);
            }
            if(this.fromIn==2){
                this.insertAt(val);
            }
        },
        /* 添加@ */
        editorAt(val){
            let {selection,range} = this.lastSelection;
            let textNode=range.startContainer;
            //删除页面中@符号
            range.setStart(textNode,range.endOffset-1);
            range.setEnd(textNode,range.endOffset);
            range.deleteContents();
            this.insertAt(val)
        },
        insertAt(val){
            this.hideMask();
            this.editor.focus();
            this.editor.insertHtml(`<button contenteditable="false" >@${val.name}&nbsp;</button>`);
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
            this.remindShow=false;
            this.maskShow=false;
            this.keyval='';
        },
    },
    mounted(){
        this.initEditor();
    }
}
</script>
<style lang="less">
.ke-toolbar,.ke-statusbar{
    display: none !important;
}
</style>
<style lang="less" scoped>
.content{
    padding:100px;
    font-size:14px;
    position: relative;
    .top{
        margin-top:20px;
        margin-bottom:20px;
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