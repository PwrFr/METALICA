<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-nav pb-0 fixed-top">
      <router-link
        v-if="user"
        :to="{ name: 'Profile', params: { user: user } }"
        class="nav-link pb-3 text-light"
        >{{ user.user_name }}</router-link
      >
      <router-link
        v-if="!user"
        :to="{ name: 'Register' }"
        class="nav-link pb-3 text-light"
        >Register</router-link
      >
      <div class="navbar-collapse justify-content-around">
        <ul class="navbar-nav">
          <li v-if="$route.name == 'Home'" class="nav-item">
            <a class="nav-link pb-3" href="#Guitar">Guitar</a>
          </li>
          <li v-if="$route.name == 'Home'" class="nav-item">
            <a class="nav-link pb-3" href="#Keyboard">Keyboard</a>
          </li>
          <li class="nav-item">
            <router-link to="/" class="navbar-brand nav-link pb-3 mx-5">
              Metalica
            </router-link>
          </li>
          <li v-if="$route.name == 'Home'" class="nav-item">
            <a class="nav-link pb-3" href="#Amplifier">Amplifier</a>
          </li>
          <li v-if="$route.name == 'Home'" class="nav-item">
            <a class="nav-link pb-3" href="#Beater">Beater</a>
          </li>
        </ul>
      </div>

      <router-link
        v-if="!user"
        :to="{ name: 'Login' }"
        class="nav-link pb-3 text-light"
        >Login</router-link
      >

      <button
        v-if="user"
        class="btn nav-link pb-3 text-light"
        @click="logOut()"
      >
        LOGOUT
      </button>
    </nav>
    <div class="bg-nav">
      <router-view
        :key="$route.fullPath"
        :productitem="instrument"
        :test="instrument"
        @auth-change="onAuthChange"
        :user="user"
      />
    </div>

    <a
      @click="scrollTop()"
      v-show="visible"
      class="btn btn-dark bottom-right px-2"
    >
      <p class="m-1">^</p>
    </a>
  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  name: "App",
  computed: {},

  data() {
    return {
      modal: false,
      instrument: [],
      user: null,
      visible: false,
      img: [],
    };
  },
  methods: {
    scrollTop: function () {
      window.scrollTo(0, 0);
    },
    scrollListener: function () {
      this.visible = window.scrollY > 150;
    },
    beforeDestroy: function () {
      window.removeEventListener("scroll", this.scrollListener);
    },
    logOut() {
      let confirmResult = confirm("Do you want to log out?");
      if (confirmResult) {
        localStorage.removeItem("token");
        this.user = null;
        this.$router.push({ path: "/" });
      }
    },
    onAuthChange() {
      const token = localStorage.getItem("token");
      if (token) {
        this.getUser();
      }
    },
    getUser() {
      const token = localStorage.getItem("token");
      axios
        .get("/user/me", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          this.user = res.data;
        });
    },
  },

  mounted() {
    window.addEventListener("scroll", this.scrollListener);

    this.onAuthChange();

    axios
      .get("/")
      .then((response) => (this.instrument = response.data))
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,200;0,400;1,300&display=swap");
html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}
#app {
  font-family: "Titillium Web", sans-serif;
  background-color: rgb(44, 44, 44);
}
.bg-black {
  background: black;
}
.bg-nav {
  background: rgba(0, 0, 0, 0.3);
}
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #b6b6b6;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(39, 39, 39);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(32, 32, 32);
}

.nav-link {
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0.15em;

  display: inline-block;
  padding: 15px 20px;
  position: relative;
}
.nav-link:after {
  background: none repeat scroll 0 0 transparent;
  bottom: 0;
  content: "";
  display: block;
  height: 2px;
  left: 50%;
  position: absolute;
  background: #ee801e;
  transition: width 0.3s ease 0s, left 0.3s ease 0s;
  width: 0;
}
.nav-link:hover:after {
  width: 100%;
  left: 0;
}

.bottom-right {
  position: fixed;
  bottom: 2rem;
  right: 3rem;
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
}
.title {
  transition: all 0.2s;
}
.title:hover {
  transform: translateX(20%);
}
.titleCat {
  transition: all 0.2s;
}
.titleCat:hover {
  transform: translateX(-20%);
}
.card-bg {
  transition: all 0.3s;
}
.card-bg:hover {
  transform: scale(1.05);
}
</style>
