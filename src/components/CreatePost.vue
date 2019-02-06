<template>
  <div>
    <div v-if="isAuthenticated">
      <center class="headline text-uppercase mt-5">
        Welcome {{this.current_user}}
      </center>
    </div>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 mb-2 mt-5>
          <v-card v-if="isAuthenticated">
            <v-card-title>
              <span class="headline">
                Create new post
              </span>
            </v-card-title>
            <v-card-text>
              <v-flex xs12 sm12 md12>
                <v-text-field
                  label="Title"
                  solo
                  v-model="postTitle"
                ></v-text-field>
              </v-flex>
            </v-card-text>

            <v-card-text>
              <v-flex xs12 sm12 md12>
                <br><br>
                <wysiwyg v-model="postBody">
                </wysiwyg>
              </v-flex>
            </v-card-text>

            <v-card-text>
              <v-flex xs12 sm12 md12>
                <div v-if="base64Img.length>0">
                </div>
                <input type="file" @change="onFileChange">
                <br>
                <img src="" height="200" >
              </v-flex>
            </v-card-text>
            <v-btn v-on:click="createNewKnowledgeArticle" color="primary">Post</v-btn>

          </v-card>
          <v-card v-else>
            <h1>Please login!</h1>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>


  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
      isAuthenticated: Boolean
    },
  data(){
    return {
      uName: "",
      uPass: "",
      current_user: "",
      current_user_uid: "",
      basicAuth: "",
      csrf_token: "",
      logout_token: "",
      postBody: "",
      postTitle: "",
      base64Img: '',
    }
  },
  created(){
  },
  methods: {
    createNewKnowledgeArticle(){
      console.log("this.basicAuth", this.basicAuth)
      axios({
        method: "post",
        url: `https://singlecell.iobio.io/node?_format=json`,
        data:{
          "type":[{"target_id":"knowledgebase"}],
          "title": [
            {
              "value": this.postTitle
            }
          ],
          "body": [
            {
              "value": this.postBody
            }
          ],
          "field_base64image": [
            {
              "value": this.base64Img
            }
          ]
        },
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : this.basicAuth
        }
      }).then(res =>{
        console.log(res)
        alert("Article posted successfully!");
        this.postBody = "";
        this.postTitle = "";
        this.base64Img = "";

      })
      .catch(e =>{
        console.log(e)
      })
      // new config
      console.log("Create Article");
    },
    onFileChange(e) {
      var preview = document.querySelector('img');
      var file    = document.querySelector('input[type=file]').files[0];
      var reader  = new FileReader();

      reader.addEventListener("load", function () {
        preview.src = reader.result;
        callToSetThebase64Img(reader.result);
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
      var callToSetThebase64Img = (img)=>{
        this.setThebase64Img(img);
      }
    },
    setThebase64Img(img){
      this.base64Img = img;
    },
  },
  watch:{
    isAuthenticated(){
      console.log("isAuthenticated is changing from HelloWorld", this.isAuthenticated)
      if(this.isAuthenticated){
        this.current_user = localStorage.getItem("username");
        this.current_user_uid = localStorage.getItem("current_user_uid");
        this.csrf_token = localStorage.getItem("csrf_token");
        this.basicAuth = localStorage.getItem("basicAuth");
        // this.getUserPosts();
      }
    }
  },
  mounted(){
    console.log("isAuthenticated", this.isAuthenticated);
    if(this.isAuthenticated){
      this.current_user = localStorage.getItem("username");
      this.current_user_uid = localStorage.getItem("current_user_uid");
      this.csrf_token = localStorage.getItem("csrf_token");
      this.basicAuth = localStorage.getItem("basicAuth");
      // this.getUserPosts();
    }
    this.$emit("someprops", "value of props")
  }
}
</script>

<style>

</style>
