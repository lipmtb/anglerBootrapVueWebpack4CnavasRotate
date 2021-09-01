<template>
  <div id="user-login-mod" v-show="showMod">
    <div class="login-reg-main">
      <!-- 关闭登陆注册 -->
      <del class="glyphicon glyphicon-remove" @click="closeMod"></del>
      <div class="top-tab clearfix">
        <span
          class="to-login"
          :class="{ activeTab: curTab === 'login' }"
          @click="selectTab('login')"
          >登录</span
        >
        <span
          class="to-reg"
          :class="{ activeTab: curTab === 'regist' }"
          @click="selectTab('regist')"
          >注册</span
        >
      </div>

      <!-- 登录区域 -->
      <div class="inputbox login-main" v-show="curTab === 'login'">
        <div class="userinfo-name">
          <input type="text" v-model="loginName" placeholder="昵称" />
        </div>
        <div class="userinfo-psw">
          <input type="password" placeholder="密码" v-model="loginPsw" />
        </div>

        <div class="userinfo-login-footer">
          <button id="user-login-btn" @click="loginSend">登录</button>
        </div>

        <div
          style="color: #f00; font-size: 0.4em; text-align: center"
          v-show="loginErrStr"
        >
          <span>{{ loginErrStr }}</span>
        </div>
      </div>

      <!-- 注册区域 -->
      <div class="inputbox reg-main" v-show="curTab === 'regist'">
        <!-- 注册昵称 -->
        <div class="userinfo-name">
          <input
            type="text"
            v-model="regName"
            placeholder="新昵称"
            @input="inputNewName"
            @blur="userNameBlur"
            @focus="focusRegName"
          />
          <i class="tick-img" :style="{ display: nameVality }"></i>
          <ul class="error-lists">
            <li
              class="error-item"
              v-for="erroritem of regErrors.regName"
              :key="erroritem.errMsg"
              v-show="erroritem.displayShow"
              :style="{ maxHeight: erroritem.maxh }"
              @transitionend="endNameTran(erroritem)"
            >
              <img
                :src="imgObj[erroritem.errImg]"
                class="error-img"
                alt="错误图片"
              />
              <span class="error-msg">{{ erroritem.errMsg }}</span>
            </li>
          </ul>
        </div>
        <!-- 注册密码 -->
        <div class="userinfo-psw">
          <input
            type="password"
            placeholder="新密码"
            v-model="regPsw"
            @input="inputNewPsw"
            @blur="blurPsw"
            @focus="focusPsw"
          />
          <i class="tick-img" :style="{ display: pswVality }"></i>

          <transition-group name="pmtb" tag="ul" class="error-lists">
            <li
              class="error-item"
              v-for="erroritem of regErrors.regPsw"
              :key="erroritem.errMsg"
              v-show="erroritem.isShow"
            >
              <img
                :src="imgObj[erroritem.errImg]"
                class="err-img"
                alt="错误图片"
              />
              <span>
                {{ erroritem.errMsg }}
              </span>
            </li>
          </transition-group>
        </div>
        <!-- 手机号输入 -->
        <div class="userinfo-phone clearfix">
          <!-- 区域选取 -->
          <div class="nation-select">
            <div class="nation-select-toggle">
              <input
                type="text"
                class="nation-select-show"
                :value="nationId"
                @blur="blurNationSelect"
              />
              <i style="display: none">{{ randNationId }}</i>
              <!-- 小up down -->
              <div class="selector-icon">
                <img
                  src="https://qq-web.cdn-go.cn/zc.qq.com/2ac4162f/v3/img/up.png"
                  v-show="!isShowSelect"
                  @click="isShowSelect = !isShowSelect"
                />
                <img
                  src="https://qq-web.cdn-go.cn/zc.qq.com/2ac4162f/v3/img/down.png"
                  v-show="isShowSelect"
                  @click="isShowSelect = !isShowSelect"
                />
              </div>
            </div>

            <ul class="nation-lists" v-show="isShowSelect">
              <li
                class="nation-item"
                v-for="nationitem of nationLists"
                @click="selectnewNation(nationitem.id)"
                :key="nationitem.id"
              >
                {{ nationitem.title }}
              </li>
            </ul>
          </div>

          <!-- 手机号输入 -->
          <div class="phone-in">
            <input
              type="text"
              placeholder="输入手机号"
              @focus="showPhoneErr = true"
              @blur="showPhoneErr = false"
              v-model="userPhoneNum"
            />
          </div>

          <div
            class="error-show"
            style="float: left"
            v-show="!phoneVality && !showPhoneErr"
          >
            <span class="err-msg-phone" style="color: #f00"
              >手机号格式不正确</span
            >
          </div>

          <div class="error-show" style="float: left" v-show="showPhoneErr">
            <span class="err-msg-phone" style="color: #666"
              >通过手机可找回密码</span
            >
          </div>
        </div>

        <!-- 短信验证 -->
        <div class="userinfo-phone-confirm clearfix">
          <input
            type="text"
            class="in-shormsg"
            placeholder="验证码"
            max-length="6"
            v-model="confirmNum"
          />

          <CountTime @endCounter="endingCounter" v-if="showCounter" />
          <button
            v-else
            id="send-shortmsg-btn"
            :disabled="!phoneVality"
            :style="{
              backgroundColor: phoneVality
                ? '#008c8c'
                : 'rgba(219, 217, 217, 0.815)',
              cursor: phoneVality ? 'pointer' : 'not-allowed',
            }"
            @click="startCounter"
          >
            发送短信验证码
          </button>

          <div
            class="error-confirmcode"
            v-show="confirmErrorMsg"
            style="color: #f00; font-size: 0.4em; text-align: center"
          >
            <span>{{ confirmErrorMsg }}</span>
          </div>
        </div>

        <!-- 注册按钮 -->
        <div class="userinfo-reg-footer">
          <button id="user-reg-btn" @click="sendRegist">注册</button>
        </div>

        <div class="footer-legal clearfix">
          <input type="checkbox" name="check-legal" v-model="isAgree" />
          <span>我已阅读并同意相关服务条款和隐私政策</span>
          <div
            v-show="agreeErrMsg"
            style="color: #f00; font-size: 0.4em; text-align: center"
          >
            <span>{{ agreeErrMsg }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountTime from "components/common/CountTime";

let errorImg = require("assets/imgs/error.png");
let greenImg = require("assets/imgs/green.png");
let infoImg = require("assets/imgs/info.png");

import { registSendWithPhone } from "network/loginReg/regist.js";
import { login } from "network/loginReg/login.js";
import { mapMutations } from "vuex";
export default {
  name: "login-mod",
  data() {
    return {
      imgObj: {
        errorImg,
        greenImg,
        infoImg,
      },
      showMod: false,
      curTab: "login",
      loginName: "jjcc20",
      loginPsw: "",
      loginErrStr: "", //登录失败提示
      regName: "",
      regPsw: "",
      userPhoneNum: "", //用户手机号
      showPhoneErr: true,
      isAgree: false, //是否同意协议
      regErrors: {
        //注册错误信息
        regName: [
          {
            isShow: false,
            displayShow: false,
            maxh: 0,
            errMsg: "昵称不能为空",
            errImg: "infoImg",
          },
          {
            isShow: false,
            displayShow: false,
            maxh: 0,
            errMsg: "昵称不能包含空格",
            errImg: "greenImg",
          },
        ],
        regPsw: [
          {
            isShow: false,

            errMsg: "密码不能包含空格",
            errImg: "greenImg",
          },
          {
            isShow: false,

            errMsg: "密码长度8-16个字符",
            errImg: "infoImg",
          },
          {
            isShow: false,

            errMsg: "密码需要同时包含数字，字母",
            errImg: "infoImg",
          },
        ],
      },
      nationId: "+86",
      randNationId: 0,
      isShowSelect: false, //是否显示区域列表
      nationLists: [
        {
          id: "+86",
          title: "中国 +86",
        },
        {
          id: "+45",
          title: "丹麦 +45",
        },
        {
          id: "+49",
          title: "德国 +49",
        },
        {
          id: "+852",
          title: "中国香港特别行政区 +852",
        },
        {
          id: "+93",
          title: "阿富汗 +93",
        },
        {
          id: "+353",
          title: "爱尔兰 +353",
        },
      ],
      showCounter: false,
      phoneRandCode: 123456, //默认验证码
      confirmNum: "", //用户输入的验证码
      confirmErrorMsg: "", //验证码错误信息
      agreeErrMsg: "",
    };
  },
  mounted() {
    this.$vmbox.$on("openLoginMod", this.openMod);
  },
  components: {
    CountTime,
  },
  computed: {
    //输入昵称是否合法
    nameVality() {
      let allPattern = this.regErrors.regName.every((patitem) => {
        return patitem.errImg === "greenImg";
      });
      return allPattern ? "block" : "none";
    },
    //输入密码是否合法
    pswVality() {
      let allPattern = this.regErrors.regPsw.every((patitem) => {
        return patitem.errImg === "greenImg";
      });
      return allPattern ? "block" : "none";
    },
    //手机号是否合法
    phoneVality() {
      if (this.userPhoneNum.length === 0) {
        return false;
      }

      let spaceReg = /\u0020/;

      if (spaceReg.test(this.userPhoneNum)) {
        return false;
      }
      let numReg = /^[\d]{11}$/;
      return numReg.test(this.userPhoneNum);
    },
  },
  methods: {
    ...mapMutations("users", { loginAdd: "loginInfoAdd" }),
    //关闭自己
    closeMod() {
      this.showMod = false;
    },
    //被打开（全部事件总线）
    openMod() {
      this.showMod = true;
    },
    //区域选择blur,回到nationId
    blurNationSelect() {
      //  this.$set(this._data,"nationId","aaa");
      this.randNationId++;
    },
    //   切换登录注册
    selectTab(tabname) {
      this.curTab = tabname;
    },
    //选择phone区域
    selectnewNation(nationId) {
      this.nationId = nationId;
      this.isShowSelect = false;
    },

    //transtionName end
    endNameTran(item) {
      // console.log("endtransion", item.isShow);
      if (!item.isShow) {
        item.displayShow = false;
      }
    },
    //验证userName
    //昵称blur
    userNameBlur() {
      if (this.regName.length === 0) {
        this.regErrors.regName[0].errImg = "errorImg";
        this.regErrors.regName[0].isShow = true;
      } else {
        this.regErrors.regName[0].errImg = "greenImg";
        this.regErrors.regName[0].isShow = false;
        this.regErrors.regName[0].maxh = 0;
      }
      let spaceReg = /\u0020/;
      if (spaceReg.test(this.regName)) {
        this.regErrors.regName[1].errImg = "errorImg";
        this.regErrors.regName[1].isShow = true;
      } else {
        this.regErrors.regName[1].errImg = "greenImg";
        this.regErrors.regName[1].isShow = false;
        this.regErrors.regName[1].maxh = 0;
      }
    },
    //聚焦昵称
    focusRegName() {
      // this.maxNameHeight="200px";
      this.regErrors.regName.forEach((item) => {
        item.displayShow = true;
        item.isShow = true;
        setTimeout(() => {
          item.maxh = "22px";
        });
      });
    },
    //输入昵称
    inputNewName() {
      let spaceReg = /\u0020/;
      if (spaceReg.test(this.regName)) {
        this.regErrors.regName[1].errImg = "infoImg";
      } else {
        this.regErrors.regName[1].errImg = "greenImg";
      }

      if (this.regName.length === 0) {
        this.regErrors.regName[0].errImg = "infoImg";
      } else {
        this.regErrors.regName[0].errImg = "greenImg";
      }
    },

    //密码验证
    //密码聚焦
    focusPsw() {
      // this.maxPswHeight="200px";
      this.regErrors.regPsw.forEach((item) => {
        item.isShow = true;
      });
    },
    blurPsw() {
      let regSpace = /\u0020/;

      if (regSpace.test(this.regPsw)) {
        this.regErrors.regPsw[0].errImg = "errorImg";
        this.regErrors.regPsw[0].isShow = true;
      } else {
        this.regErrors.regPsw[0].isShow = false;
      }

      if (this.regPsw.length >= 8 && this.regPsw.length <= 16) {
        this.regErrors.regPsw[1].isShow = false;
      } else {
        this.regErrors.regPsw[1].isShow = true;
        this.regErrors.regPsw[1].errImg = "errorImg";
      }

      let letterReg = /[a-z|A-Z]+/;
      let numReg = /\d/;
      if (letterReg.test(this.regPsw) && numReg.test(this.regPsw)) {
        this.regErrors.regPsw[2].isShow = false;
      } else {
        this.regErrors.regPsw[2].errImg = "errorImg";
        this.regErrors.regPsw[2].isShow = true;
      }
    },
    inputNewPsw() {
      let regSpace = /\u0020/;
      if (regSpace.test(this.regPsw)) {
        this.regErrors.regPsw[0].errImg = "infoImg";
      } else {
        this.regErrors.regPsw[0].errImg = "greenImg";
      }

      if (this.regPsw.length >= 8 && this.regPsw.length <= 16) {
        this.regErrors.regPsw[1].errImg = "greenImg";
      } else {
        this.regErrors.regPsw[1].errImg = "infoImg";
      }

      let letterReg = /[a-z|A-Z]+/;
      let numReg = /\d/;
      if (letterReg.test(this.regPsw) && numReg.test(this.regPsw)) {
        this.regErrors.regPsw[2].errImg = "greenImg";
      } else {
        this.regErrors.regPsw[2].errImg = "infoImg";
      }
    },
    //发送验证码
    startCounter() {
      this.showCounter = true;
      //新生成phoneRandCode
      this.phoneRandCode = (Math.random() + "").substr(2, 6);
      console.log("验证码：", this.phoneRandCode);
      //将验证码发送到用户手机上
    },
    //倒计时结束
    endingCounter() {
      this.showCounter = false;
      //结束后再次生成新的验证码
      this.phoneRandCode = (Math.random() + "").substr(2, 6);
      console.log("验证码改变，请重新验证", this.phoneRandCode);
    },
    //注册
    /*
       regName: "",
      regPsw: "",
      userPhoneNum: "", //用户手机号
    */
    sendRegist() {
      if (this.confirmNum == this.phoneRandCode) {
        this.confirmErrorMsg = "";
        if (!this.isAgree) {
          this.agreeErrMsg = "请先勾选相关协议";
          return;
        }
        if (
          this.isAgree &&
          this.nameVality === "block" &&
          this.pswVality === "block" &&
          this.phoneVality
        ) {
          console.log("其他信息验证成功", typeof this.userPhoneNum);
          registSendWithPhone(
            this.regName,
            this.regPsw,
            this.userPhoneNum
          ).then((res) => {
            console.log("注册结果", res);
            if (res.errCode === 0) {
              console.log("注册成功", res.jjccToken);
              this.loginAdd({
                //vuex提交mutations
                userName: res.userInfo.userName,
                userId: res.userInfo.userId,
              });
              this.closeMod();
            } else {
              this.agreeErrMsg = "注册失败";
            }
          });
        }
      } else {
        console.log(
          "短信验证失败",
          this.regName,
          this.regPsw,
          this.userPhoneNum
        );
        this.confirmErrorMsg = "验证码错误";
      }
    },

    //登录
    loginSend() {
      console.log("登录信息", this.loginName, this.loginPsw);
      if (this.loginName.length === 0) {
        this.loginErrStr = "请输入昵称";
        return;
      }
      if (this.loginPsw.length === 0) {
        this.loginErrStr = "请输入密码";
        return;
      }

      login(this.loginName, this.loginPsw).then((res) => {
        console.log("登录结果", res);
        if (res.errCode === 0) {
          console.log("登录成功");
             this.loginErrStr = "";
          this.loginAdd({
            //vuex提交mutations
            userName: res.userInfo.userName,
            userId: res.userInfo.userId,
          });
          this.closeMod();
          location.reload();
        }else{
          this.loginErrStr = "登录失败";
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
// tab样式
div.top-tab {
  span[class|="to"] {
    float: left;
    color: #aaa;
    cursor: pointer;
    padding: 0.4em 0.6em;
    margin-left: 100px;
  }
  span[class|="to"].activeTab {
    color: #f00;
  }
}

// 公共样式
.inputbox {
  padding: 0.4em;
  padding-left: 60px;
  div[class|="userinfo"] {
    margin: 0.4em 0;
  }
}
input {
  display: block;
  width: 100%;
  border: 1px solid #eee;
  outline: none;
  padding: 0.2em;
  border-radius: 4px;
  line-height: 1.8em;
}
input::placeholder {
  font-size: 0.4em;
  color: #ddd;
}
// 遮罩
#user-login-mod {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(61, 61, 61, 0.616);
}
// 登录注册主要区域
.login-reg-main {
  position: absolute;
  left: 0;
  right: 0;
  top: 100px;
  margin: auto;
  width: 400px;
  min-height: 300px;
  background-color: aliceblue;
  border: 1px solid #eee;
  del.glyphicon-remove {
    position: absolute;
    right: 1px;
    top: -2px;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      color: #f00;
    }
  }
}

// 登录注册公共
div[class|="userinfo"] {
  width: 80%;
}

//登录
.login-main {
  div.userinfo-login-footer {
    button#user-login-btn {
      width: 100%;
      padding: 0.4em 2em;
      border: 0;
      background-color: rgba(45, 134, 175, 0.815);
      border-radius: 4px;
      color: #fff;
    }
  }
}

// 注册
.error-lists {
  li.error-item {
    overflow: hidden;
    transition: max-height 1s;
  }
  li.pmtb-enter-to,
  li.pmtb-leave {
    max-height: 21px;
  }
  li.pmtb-enter,
  li.pmtb-leave-to {
    max-height: 0px;
  }
}
//注册用户名和密码
div.userinfo-name,
div.userinfo-psw {
  position: relative;
  i.tick-img {
    position: absolute;
    right: 4px;
    top: 7px;
    width: 15px;
    height: 15px;
    background: url("~assets/imgs/tick.png") no-repeat center/cover;
  }
}
//手机号输入
div.userinfo-phone {
  // 手机号选择左
  div.nation-select {
    float: left;
    width: 20%;
    position: relative;
    div.nation-select-toggle {
      input.nation-select-show {
        width: 100%;
      }
      div.selector-icon {
        position: absolute;
        right: 2px;
        top: 4px;
      }
    }
    ul.nation-lists {
      position: absolute;
      left: 0;
      top: 100%;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 4px;
      height: 100px;
      width: 500%;
      padding-left: 0.2em;
      overflow-y: scroll;
      li.nation-item {
        cursor: pointer;
        &:hover {
          background-color: #eee;
          color: #f00;
        }
      }
    }
  }
  // 手机号输入右
  div.phone-in {
    float: left;
    width: 80%;
  }
}

// 短信验证
div.userinfo-phone-confirm {
  input.in-shormsg,
  button#send-shortmsg-btn {
    float: left;
  }
  input.in-shormsg {
    width: 20%;
  }
  button#send-shortmsg-btn {
    width: 80%;
    padding: 0.4em 2em;
    border: 0;
    background-color: rgba(219, 217, 217, 0.815);
    border-radius: 4px;
  }
}

// 注册按钮
div.userinfo-reg-footer {
  button#user-reg-btn {
    background-color: #008c8c;
    width: 100%;
    padding: 0.4em 2em;
    border: 0;
    border-radius: 4px;
    color: #fff;
  }
}

div.footer-legal {
  input[type="checkbox"] {
    float: left;
    width: 10px;
    margin-right: 0.2em;
  }
  span {
    float: left;
  }
}
</style>