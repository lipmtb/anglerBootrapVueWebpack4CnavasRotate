<template>
  <nav class="navbar jjcc-navbar">
    <div class="jjcc-container container">
      <!-- headernav -->
      <div class="navbar-header">
        <button
          type="button"
          class="navbar-toggle collapsed"
          data-toggle="collapse"
          data-target="#bs-example-navbar-collapse-1"
          aria-expanded="false"
          @click="toggleCollapseHid"
        >
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">垂钓</a>
      </div>

      <!-- main nav -->
      <div
        class="collapse navbar-collapse"
        id="bs-example-navbar-collapse-jjcc"
        ref="collapsebanner"
      >
        <ul class="nav navbar-nav" v-if="$route.matched[0]">
          <li class="active">
            <a
              href="#"
              data-router-path="/talk"
              @click="onMainNav"
              :class="{ mainActive: $route.matched[0].path === '/talk' }"
              >钓友圈<span class="sr-only">(current)</span></a
            >
          </li>
          <li>
            <a
              href="#"
              data-router-path="/tip"
              :class="{ mainActive: $route.matched[0].path === '/tip' }"
              @click="onMainNav"
              >技巧</a
            >
          </li>
          <li
            class="jjcc-dropdown"
            @mouseenter="onEnterToggle"
            @mouseleave="onLeaveToggle"
            :class="{ open: isDropdownOpen }"
          >
            <a
              href="#"
              class="dropdown-toggle"
              data-router-path="/profile"
              @click="onMainNav"
              :class="{ mainActive: $route.matched[0].path === '/profile' }"
              >我的<span class="glyphicon glyphicon-chevron-up"></span>
            </a>
            <ul
              class="dropdown-menu"
              @transitionend="endtranDown"
              :style="{
                display: isShow ? 'block' : 'none',
                maxHeight: menuHeight,
              }"
            >
              <li>
                <a
                  href="javascript:void(0)"
                  @click="toMyProfile('/profile/mycollect')"
                  >我的收藏</a
                >
              </li>
              <li role="separator" class="divider"></li>
              <li>
                <a
                  href="javascript:void(0)"
                  @click="toMyProfile('/profile/mymsg')"
                  >我的消息</a
                >
              </li>
              <li role="separator" class="divider"></li>
              <li>
                <a
                  href="javascript:void(0)"
                  @click="toMyProfile('/profile/myhist')"
                  >浏览历史</a
                >
              </li>
            </ul>
          </li>
        </ul>

        <ul class="nav navbar-nav navbar-right">
          <li v-if="userInfo.userId"><a href="javascript:void(0)">欢迎：{{userInfo.userName}}</a></li>
          <li v-else><a href="javascript:void(0)" id="login-reg-btn" @click="showLoginMod">登录/注册</a></li>
        </ul>
      </div>
      <!-- /.navbar-collapse -->
    </div>
    <!-- /.container-fluid -->
  </nav>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  name: "NavTop",
  data() {
    return {
      isDropdownOpen: false,
      isShow: false,
      menuHeight: 0,
      collapseMaxHeight: 0,
    };
  },
  computed:{
    ...mapGetters("users",["userInfo"])
  },
  methods: {
    //显示登录注册框
    showLoginMod(){ 
      this.$vmbox.$emit("openLoginMod");

    },
    toMyProfile(path) {
      // console.log(this.$route.path == path);
      if (this.$route.path !== path) {
        this.$router.push(path);
        this.isDropdownOpen = false;
        this.isShow = false;
        this.menuHeight = 0;
        document.defaultView.scrollTo({
          top: 260,
          behavior: "smooth",
        });
      }
    },
    onMainNav(e) {
      e.preventDefault();

      if (e.currentTarget.dataset.routerPath !== this.$route.path) {
        this.$router.push(e.currentTarget.dataset.routerPath);
      }
    },
    onEnterToggle() {
      this.isDropdownOpen = true;
      this.isShow = true;
      let that = this;

      setTimeout(function timeoutbbbbbbbbbbbb() {
        that.menuHeight = "200px";
      });
    },
    onLeaveToggle() {
      // console.log("leaving");
      this.isDropdownOpen = false;
      this.menuHeight = "0";
    },
    endtranDown() {
      // console.log("ending", this.isDropdownOpen);
      if (!this.isDropdownOpen) {
        this.isShow = false;
      }
    },
    //maxWidth=768px 切换collapase
    toggleCollapseHid() {
      if (this.collapseMaxHeight === 0) {
        this.collapseMaxHeight = 400;
        this.$refs.collapsebanner.style.maxHeight = "400px";
      } else {
        this.collapseMaxHeight = 0;
        this.$refs.collapsebanner.style.maxHeight = 0;
      }
    },
  },
};
</script>

<style scoped>
/* 当前路由 */
.nav > li > a.mainActive,
.nav > li > a.mainActive:focus {
  background-color: teal;
  color: #fff;
}

.nav > li > a:focus {
  background-color: transparent;
}

ul.dropdown-menu {
  transition: max-height 1s linear -0.2s;
  overflow: hidden;
}
.navbar-brand {
  padding: 20px 15px;
  height: auto;
}
.navbar-nav > li > a {
  padding: 20px 15px;
  font-size: 18px;
}
/* .nav > li > a:focus {
  background-color: transparent;
} */
.nav > li:hover > a {
  background-color: rgb(96, 96, 252);
  color: #fff;
}

.nav > li > a:hover {
  background-color: rgb(96, 96, 252);
  color: #fff;
}
.navbar-right.nav >li> a:hover{
   background-color:transparent;
}

.nav > li > a#login-reg-btn:hover {
  background-color: transparent;
  color: rgb(248, 248, 250);
}
dropdown-menu > li > a:focus,
.dropdown-menu > li > a:hover {
  background-color: rgb(231, 231, 250);
}
.dropdown-menu {
  padding: 0;
}
.dropdown-menu .divider {
  margin: 0;
}
.dropdown-menu > li > a {
  padding: 9px 20px;
}
.glyphicon {
  line-height: 0.8;
  font-size: 0.6em;
  top: 0px;
  left: 2px;
}
li.jjcc-dropdown .glyphicon-chevron-up {
  transition: all 0.8s -0.2s;
}
li.jjcc-dropdown.open .glyphicon-chevron-up {
  transform: rotate(180deg);
}
.jjcc-navbar {
  border-radius: 0;
  margin-bottom: 0;
}

.navbar-toggle .icon-bar {
  background-color: #fff;
}

@media (max-width: 768px) {
  .jjcc-navbar {
    background-color: rgb(44, 33, 33);
  }
  .dropdown-menu > li > a {
    color: #fff;
  }

  .dropdown-menu > li > a:hover {
    color: rgb(252, 6, 6);
  }

  #bs-example-navbar-collapse-jjcc {
    display: block;
    max-height: 0;
    transition: max-height 2s;
    overflow: hidden;
  }
}

@media (min-width: 1200px) {
  .jjcc-container {
    padding: 0 40px;
  }

  .jjcc-navbar {
    background-color: rgb(171, 240, 125);
  }
}

@media (min-width: 768px) and (max-width: 1200px) {
  .jjcc-navbar {
    background-color: rgb(223, 240, 125);
  }
}
</style>