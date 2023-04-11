<template>
  <div>
  <!--  <transition-group name="fade" mode="out-in">  -->
    <div class="table-responsive">
      <table class="table table-hover table-striped mb-0">
        <thead>
          <tr>
<!--
            <th style="width:50px;">Preview</th>
-->
            <th style="width:50px;">分類</th>
            <th style="width:150px;">更新日時</th>
            <th>ファイルパス</th>
            <th>形式</th>
            <th>アクセス数</th>
            <th>詳細表示</th>
            <th>タグ</th>
            <th>ファイル表示</th>
          </tr>
        </thead>
        <tbody>
        <tr v-for="(result, $index) in results" :key="$index" class="result">

<!--
          <h4>
            <router-link :to="{ name: 'root.view', params: { id: result.id } }">
                 {{ resultLabel(result) }}
            </router-link>
          </h4>


            <td><img v-bind:src="getImgUrl(result.partImage)" class="previewImage" /></td>
-->
            <td>{{ result.category }}</td>
            <td>{{ result.update }}</td>
            <td>{{ result.filePath }}</td>
            <td>{{ result.fileType }}</td>
            <td>{{ result.noa }}</td>

            <td>
              <router-link :to="{ name: 'root.view', params: { id: result.uri },}" >
                詳細 
              </router-link>
            </td>
            <td>
               {{result.collections}}
            </td>
            <td>
               <a :href="result.pdfhref" >表示</a>
            </td>
        </tr>
        </tbody>
      </table>
    </div>
  <!-- </transition-group> -->
  </div>
</template>

<script>
export default {
  name: 'ml-results',
  props: {
    results: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  methods: {
    resultLabel(result) {
      console.log("--------RESULT-------");
      console.log(result);
      console.log("--------RESULT-------");
      return result.label || result.uri.split('/').pop();
    },
 /*   getImgUrl(imgName) {
       console.log("imgName"); console.log(imgName);
       var images = require.context('../../assets/images/parts/', false, /\.png$/)
       return images('./' + imgName)
    },
*/
  }
};
</script>
