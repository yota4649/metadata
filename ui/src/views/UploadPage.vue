<template>
  <section class="upload">
    <h1>ファイルアップロード</h1>
    <file-dropzone
        button="false"
        multiple="multiple"
        v-on:drop="sendFile"
        v-on:drop-all="sendAllFiles"
        v-on:file-dblclick="openFile">
      <div slot="intro">
        <p><strong>ここにファイルをドロップするかクリックしてファイルを選択してください</strong></p>
        <em>(ファイルは自動的にアップロードされます)</em>
      </div>
    </file-dropzone>
    タグ名：
    <input v-model="tagList" placeholder="タグリスト(複数指定の場合はカンマで区切る)">
    <button class="btn btn-primary" v-on:click="buttonClicked()">メタデータ作成</button>
  </section>
</template>

<script>
import axios from "axios";
export default {
  name: 'UploadPage',
  components: {},
  props: ['type'],
  data() {
    const self=this;
    return {
      tagList:"",
    }
  },
  computed: {},
  methods: {
    sendFile(e) {
      var progress = e.detail;
      console.log(['sendFile', progress]);

      progress.update(0);
      this.$store
        .dispatch('crud/' + this.type + '/create', {
          // Note: spaces in names/id's are not accepted, not even encoded.
          id: encodeURIComponent(
            '/upload/' + progress.file.name.replace(/\s/g, '_')
          ),
          data: progress.file,
          format: 'binary'
        })
        .then(function(response) {
          progress.id = response.id;
          if (!response.isError) {
            progress.update(100);
          } else {
            progress.error(response.error);
          }
        });
    },
    sendAllFiles(e) {
      var all = e.detail;
      console.log(['sendAllFiles', all]);
    },
    openFile(e) {
      var progress = e.detail;
      console.log(['openFile', progress]);
      this.$router.push({
        name: 'root.view',
        params: { id: progress.id }
      });
    },
    buttonClicked(){
        var para = {};
        para["rs.tagList"] = this.tagList;
        window.alert("Generate Metadata with : "+this.tagList);

        axios
          .put("/v1/resources/generateMeta?rs:tagList="+encodeURIComponent(this.tagList), para)
          .then((response) => {
             console.log("Successfully generated")
             this.$router.go({path: this.$router.currentRoute.path, force: true});
          })
          .catch((e) => {
              console.log(e);
          });
    },
  }
};
</script>

<style lang="less" scoped>
</style>
