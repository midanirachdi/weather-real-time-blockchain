<template>
  <div>
    <v-navigation-drawer
      app
      fixed
      clipped
      v-model="drawer"
      :width="250"
      class="Vuely-sidebar"
      :style="sidebarImage"
      :class="{'background-none': !backgroundImageToggle}"
      :right="ifRtlLayout">
      <!-- App Sidebar -->
      <app-sidebar></app-sidebar>
    </v-navigation-drawer>
    <v-toolbar class="navbar-default" app fixed :clipped-left="!ifRtlLayout" :clipped-right="ifRtlLayout">
      <!-- App Logo -->
      <div class="site-logo">
        <!--<router-link to="/"><img src="/static/img/site-logo.png" alt="site logo" width="98" height="30"></router-link>-->
        <img src="../../assets/vuetify.png" alt="Vuetify.js" style="vertical-align:middle;transform:rotate(180deg);" width="30" height="30"/>
        <span style="color:white  "><b>Nammumu</b></span>
      </div>
      <v-toolbar-title>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="right-nav">
        <!-- App Searchbar -->

        <v-btn icon @click="toggleFullScreen" class="d-inline-50">
          <i class="ti-fullscreen"></i>
        </v-btn>
        <v-btn icon @click.prevent="logout" class="d-inline-50">
          <i class="ti-power-off"></i>
        </v-btn>

        <!--<v-btn icon @click.stop="chatSidebar = !chatSidebar" class="d-inline-50">-->
        <!--<i class="ti-comments"></i>-->
        <!--</v-btn>-->
        <!--<v-menu offset-y class="d-inline-50">-->
        <!--<v-btn icon slot="activator">-->
        <!--<i class="ti-bell"></i>-->
        <!--</v-btn>-->
        <!--<v-list>-->
        <!--<v-list-tile v-for="item in items" :key="item.title" @click="">-->
        <!--<v-icon class="">{{item.icon}}</v-icon>-->
        <!--<v-list-tile-title>{{ item.title }}</v-list-tile-title>-->
        <!--</v-list-tile>-->
        <!--</v-list>-->
        <!--</v-menu>-->
        <!--<v-menu offset-y>-->
        <!--<div slot="activator" class="drop-menu">-->
        <!--<img width="30px" height="30px" src="/static/img/user-7.jpg" class="rounded-circle">-->
        <!--<span>Gregory A.</span>-->
        <!--</div>-->
        <!--<v-list>-->
        <!--<v-list-tile to="/users/user-profile">-->
        <!--<v-icon class="mr-3 font-lg text-gray">ti-user</v-icon>-->
        <!--<v-list-tile-title>View Profile</v-list-tile-title>-->
        <!--</v-list-tile>-->
        <!--<v-list-tile to="/inbox">-->
        <!--<v-icon class="mr-3 font-lg text-gray">ti-email</v-icon>-->
        <!--<v-list-tile-title>Inbox</v-list-tile-title>-->
        <!--</v-list-tile>-->
        <!--<v-list-tile to="/users/users-list">-->
        <!--<v-icon class="mr-3 font-lg text-gray">ti-bell</v-icon>-->
        <!--<v-list-tile-title>Users List</v-list-tile-title>-->
        <!--</v-list-tile>-->
        <!--<v-list-tile to="/session/login">-->
        <!--<v-icon class="mr-3 font-lg text-gray">ti-power-off</v-icon>-->
        <!--<v-list-tile-title @click.prevent="logout">Log Out</v-list-tile-title>-->
        <!--</v-list-tile>-->
        <!--</v-list>-->
        <!--</v-menu>-->

      </div>
    </v-toolbar>
    <!-- Chat Searchbar -->
    <v-navigation-drawer fixed v-model="chatSidebar" :width="250" :right="!rtlLayout" temporary app>
      <chat-sidebar></chat-sidebar>
    </v-navigation-drawer>
  </div>
</template>

<script>
  /* eslint-disable */
  import Sidebar from "../Sidebar/Sidebar.vue";
  import ChatSidebar from "../ChatSidebar/ChatSidebar.vue";
  import EventBus from "../../lib/eventBus";
  import screenfull from "screenfull";
  import axios from 'axios'


  export default {
    data() {
      return {
        collapsed: false, // collapse sidebar
        drawer: true, // sidebar drawer default true
        chatSidebar: false, // chat component right sidebar
        sidebarImages: "", // sidebar background images
        enableSidebarBackground: false,
        enableDefaultSidebar: false,
        rtlLayout: false,
        searchFormOpen: false,
        items: [
          {
            title: "Total App Memory",
            icon: "storage"
          },
          {
            title: "Total Memory Used",
            icon: "memory"
          },
          {
            title: "12 Unread Mail",
            icon: "mail"
          },
          {
            title: "Feedback",
            icon: "feedback"
          }
        ]
      };
    },
    created() {
    },
    mounted() {

    },
    computed: {
      // computed property to get the state of collapsed sidebar
      sidebarCollapse() {
        EventBus.$on("collapseSidebar", payload => {
          this.collapsed = payload;
        });
        return this.collapsed;
      },
      // computed property to change the background image of the sidebar
      sidebarImage() {
        EventBus.$on("changeBackgroundImage", payload => {
          this.sidebarImages = payload;
        });
        return "background-image: url(" + this.sidebarImages + ");";
      },
      // computed property to display the sidebar image or not
      backgroundImageToggle() {
        EventBus.$on("backgroundImage", payload => {
          this.enableSidebarBackground = payload;
        });
        return this.enableSidebarBackground;
      },
      // if rtl Layout
      ifRtlLayout() {
        EventBus.$on("rtlLayoutEvent", payload => {
          this.rtlLayout = payload;
        });
        return this.rtlLayout;
      }
    },
    methods: {
      // toggle full screen method
      toggleFullScreen() {
        if (screenfull.enabled) {
          screenfull.toggle();
        }
      },
      logout() {
        this.$auth.logout({
          makeRequest: false,
          success() {
            localStorage.clear();
          },
          error() {
            localStorage.clear();
          },
          redirect: '/',
        });
      },
      searchFormHanler() {
        this.searchFormOpen = !this.searchFormOpen;
      }
    },
    components: {
      appSidebar: Sidebar,
      ChatSidebar
    }
  };
</script>
