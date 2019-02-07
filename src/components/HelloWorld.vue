<template>
  <v-container>
    <v-layout
      wrap
    >
      <v-flex mr-4 ml-4 mt-4 mb-4 xs12>
        <h1 class="display-2 font-weight-bold mb-3">
            Welcome to SingleCell.io
        </h1>
        <br>
      </v-flex>

      <v-flex xs12>
        <v-flex
          mb-5
          xs12
        >
          <v-card>
            <v-card-title primary-title>
              <h2 class="headline font-weight-bold mb-3">Knowledge Base</h2>
            </v-card-title>
            <v-card-text pl-5>
              <p v-if="knowledgebase.length>1">
                <div
                  v-for="(KnowledgeArticle, i) in knowledgebase"
                  :key="i"
                >
                <h3 style="font-size:18px" ><router-link :to="`/article/${KnowledgeArticle.nid[0].value}/${getTitle(KnowledgeArticle.title[0].value)}`" exact >{{KnowledgeArticle.title[0].value}}</router-link></h3>
                <!-- <h3 style="font-size:18px" ><router-link :to="{ name: 'Article', params: { id: 22 }}" exact >{{KnowledgeArticle.title[0].value}}</router-link></h3> -->
                  <!-- <h3><a style="font-size:18px" v-on:click="getTheArticle(KnowledgeArticle.nid[0].value)">{{KnowledgeArticle.title[0].value}}</a></h3> -->
                  <p v-if="KnowledgeArticle.field_summary.length>0">
                    {{KnowledgeArticle.field_summary[0].value}}
                  </p>
                  <p v-else>Summary not included</p>
                </div>
              </p>
            </v-card-text>
          </v-card>
        </v-flex>

      </v-flex>



      <!--<v-flex xs7>
         <v-flex xs12 mb-5>
          <div v-if="!isAuthenticated">
            <v-text-field
              name="name"
              label="username"
              id="id"
              v-model="uName"
            ></v-text-field>
            <v-text-field
              name="name"
              label="Enter your password"
              hint="At least 8 characters"
              min="4"
              type="password"
              v-model="uPass"
            ></v-text-field>
          </div>
          <v-btn v-if="!isAuthenticated" v-on:click="loginFromForm" color="primary">Login</v-btn>
          <v-btn v-else v-on:click="logoutFromForm" color="primary">Logout</v-btn>

        </v-flex> -->

        <!-- <v-flex xs12 mb-5>
          <div v-if="isAuthenticated">
            <h4>Welcome {{this.current_user}}</h4>
            Your User id is: {{ current_user_uid }}
            <br>
            <br>
            <h4>Create a quick post</h4>
            <br>
            <v-flex xs12 sm12 md12>
              <v-text-field
                label="Title"
                solo
                v-model="postTitle"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <br><br>
              <wysiwyg v-model="postBody">
              </wysiwyg> -->

              <!-- <v-textarea
                solo
                name="input-7-4"
                label="Content"
                v-model="postBody"
              ></v-textarea> -->
            <!-- </v-flex>
            <v-flex xs12 sm12 md12>
              <div v-if="base64Img.length>0">
              </div>
              <input type="file" @change="onFileChange">
              <br>
              <img src="" height="200" >
            </v-flex> -->
            <!-- <v-btn v-on:click="createNewKnowledgeArticle" color="primary">Post</v-btn> -->
            <!-- <br>
            <br>
            <h4>Your posts: </h4>
            <p v-if="userPosts.length>1">
              <div
                v-for="(post, i) in userPosts"
                :key="i"
              >
                <h3><a v-on:click="getTheArticle(post.nid[0].value)">{{post.title[0].value}}</a></h3>
              </div>
            </p>

          </div>
        </v-flex>-->


      </v-flex>



      <div v-if="articleDialog">
        <v-dialog v-model="articleDialog" width="600px">
          <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">
                {{articleContent.title[0].value}}
              </span>
            </v-card-title>
            <v-card-text>
              {{articleContent.body[0].value}}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat="flat" @click="articleDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';
import jQuery from 'jquery';
global.jQuery = jQuery;
global.$ = jQuery;
var basic = require('basic-authorization-header');


  export default {
    components: {
    },
    props: {
      isAuthenticated:{
        type: Boolean,
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
          this.getUserPosts();
        }
      }
    },
    updated(){
      console.log("isAuthenticated", this.isAuthenticated)

    },
    mounted(){
      console.log("isAuthenticated in HelloWorld", this.isAuthenticated)

      // if (localStorage["username"] && localStorage["csrf_token"]) {
      //   this.current_user = localStorage.getItem("username");
      //   this.current_user_uid = localStorage.getItem("current_user_uid");
      //   this.csrf_token = localStorage.getItem("csrf_token");
      //   this.basicAuth = localStorage.getItem("basicAuth");
      //   this.getUserPosts();
      //   this.isAuthenticated = true;
      // }

      // console.log("basic auth", basic("adit", "Test1234!"))

      fetch(`https://singlecell.iobio.io/api/knowledgebase?_format=json`)
              .then(response => response.json())
              .then(data => {
                console.log(data);
                this.knowledgebase = data;
              })

    // axios.get(`https://singlecell.iobio.io/api/knowledgebase?_format=json`)
    //     .then(response => {
    //       // this.posts = response.data
    //       console.log("axios response ", response)
    //     })
    //     .catch(e => {
    //       // this.errors.push(e)
    //     })

    },
    beforeDestroy() {
    },
    methods: {
      getTheArticle(id){
        alert("id is "+  id );
        fetch(`https://singlecell.iobio.io/node/${id}?_format=json`)
                .then(response => response.json())
                .then(data => {
                  console.log(data);
                  this.articleContent = data;
                  this.articleDialog = true;
                })
      },
      loginFromForm(){
        var data = {
          "name": this.uName,
          "pass": this.uPass
        }
        var headers = {
          'Content-Type' : 'application/json',
        }

        axios.post(`https://singlecell.iobio.io/user/login?_format=json`, data, headers)
              .then(res =>{
                console.log(res);
                this.logout_token = res.data.logout_token;
                this.csrf_token = res.data.csrf_token;
                this.isAuthenticated = true;
                this.current_user = this.uName;
                this.current_user_uid = res.data.current_user.uid;
                this.basicAuth = basic(this.uName, this.uPass);
                this.uName = "";
                this.uPass = "";
                localStorage.setItem("username", this.current_user);
                localStorage.setItem("csrf_token", this.csrf_token);
                localStorage.setItem("current_user_uid", this.current_user_uid);
                localStorage.setItem("basicAuth", this.basicAuth);
                this.getUserPosts();
              })
              .catch(e =>{
                console.log(e)
              })
      },
      logoutFromForm(){
        this.isAuthenticated = false;
        localStorage.removeItem("username");
        localStorage.removeItem("csrf_token");
        localStorage.removeItem("current_user_uid");
        localStorage.removeItem("basicAuth");
      },
      getUserPosts(){
        fetch(`https://singlecell.iobio.io/api/knowledgebase/uid/${this.current_user_uid}?_format=json`)
                .then(response => response.json())
                .then(data => {
                  console.log(data);
                  this.userPosts = data;
                })
      },
      loginUser(){
        var data = {
          "name": "",
          "pass": "!"
        }
        var headers = {
          'Content-Type' : 'application/json',
        }

        axios.post(`https://singlecell.iobio.io/user/login?_format=json`, data, headers)
              .then(res =>{
                console.log(res);
                this.logout_token = res.data.logout_token;
                this.csrf_token = res.data.csrf_token;
                console.log(this.csrf_token)
              })
              .catch(e =>{
                console.log(e)
              })
      },
      getTitle(title){
        return title.replace(/\s+/g, '-');
      },
      logoutUser(){
        var data = {
        }
        var headers = {
          'Content-Type' : 'application/json',
        }

        axios.post(`https://singlecell.iobio.io/user/logout?_format=json&token=${this.logout_token}`)
              .then(res =>{
                console.log(res)
              })
              .catch(e =>{
                console.log(e)
              })
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
          alert("Article posted successfully!")
        })
        .catch(e =>{
          console.log(e)
        })
        // new config
        console.log("Create Article");
      }
    },
    data: () => ({
      csrf_token: "",
      logout_token: "",
      myHTML: "",
      knowledgebase: "",
      uName: "",
      uPass: "",
      // isAuthenticated: false,
      current_user: "",
      current_user_uid: "",
      userPosts: [],
      postBody: "",
      postTitle: "",
      articleContent: "",
      articleDialog: false,
      basicAuth: "",
      image: '',
      base64Img: '',
      previewUploadedImage: false,
    })
  }
</script>

<style>

</style>
