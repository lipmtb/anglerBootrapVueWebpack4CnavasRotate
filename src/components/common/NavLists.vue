<template>
  <div class="nav-lists">
    <template v-for="linkdata of lists">
      <div
        class="link-item multi-item"
        :key="linkdata.title"
        v-if="linkdata.path === '/profile'"
      >
        <router-link class="main-navitem" :to="linkdata.path">{{
          linkdata.title
        }}</router-link>
        <i
          class="bottom-line"
          :class="{ isCurrentLink: $route.matched[0].path === linkdata.path }"
        ></i>

        <ul class="sub-route-lists">
          <li v-for="subroute of linkdata.childs" :key="subroute.path">
            <router-link class="sub-navitem" :to="subroute.path">{{
              subroute.title
            }}</router-link>
            <i
              class="sub-bottom-line"
              :class="{
                isSubCurrent: $route.path === subroute.path,
              }"
            ></i>
          </li>
        </ul>
      </div>

      <div class="link-item" :key="linkdata.title" v-else>
        <router-link class="main-navitem" :to="linkdata.path">{{
          linkdata.title
        }}</router-link>
        <i
          class="bottom-line"
          :class="{ isCurrentLink: $route.matched[0].path === linkdata.path }"
        ></i>
      </div>
    </template>
  </div>
</template>

<script>
// 路由列表
export default {
  name: "nav-lists",
  props: {
    lists: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
  },
  created() {
    console.log(this.$route);
  },
};
</script>

<style scoped lang="less">
.nav-lists {
  min-height: 60px;
  display: flex;
  justify-content: space-around;
  width: 400px;
  margin: 10px auto;
  padding: 10px 0;

z-index: 1;
  .main-navitem {
    display: block;
    font-size: 1.4em;

    color: #545c63;
    &:hover {
      text-decoration: none;
      color: #008c8c;
      font-weight: bold;
    }
  }

  i.bottom-line {
    display: none;
    width: 2em;
    border-top: 2px solid #f00;
    margin: 4px auto;
  }
  i.isCurrentLink {
    display: block;
  }

  .multi-item {
    position: relative;

    ul.sub-route-lists {
      position: absolute;
      display: none;
      width: 66px;
      left: 40px;
      z-index: 2;
      @media (max-width: 768px) {
        left: -64px;
      }
      top: -20px;
      // background-color: aliceblue;

      a.sub-navitem {
        display: block;
        padding: 0.2em 0;
        text-align: center;
        &:hover{
          color:chocolate;
        }
        &:hover + i.sub-bottom-line{
            width: 4em;
            opacity: 1;
            border-color:chocolate;
        }
      }

      i.sub-bottom-line {
        display: block;
        width: 0em;
        opacity: 0.2;
        border-top: 2px solid rgb(235, 248, 52);
        transition: all 1s;
        margin: 0 auto;
      }
      i.isSubCurrent {
        width: 4em;
        opacity: 1;
      }
    }

    &:hover{
      ul.sub-route-lists{
        display: block;
      }
    }
  }
}
</style>