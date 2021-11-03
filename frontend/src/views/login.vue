<template>
  <div style="height: 100vh">
    <div class="h-100 row align-items-center">
      <div class="col d-flex justify-content-center text-center">
        <div class="card shadow w-50">
          <div class="card-header">
            <h3 class="card-title m-0">LOGIN</h3>
          </div>

          <div class="card-body">
            <small class="text-danger">{{ error }}</small>

            <form>
              <div class="form-group row">
                <label for="staticEmail" class="col-3 col-form-label"
                  >Username</label
                >
                <div class="col-9">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Username"
                      :class="{
                        'is-invalid': $v.username.$error,
                      }"
                      v-model="$v.username.$model"
                    />
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-3 col-form-label"
                  >Password</label
                >
                <div class="col-9">
                  <input
                    type="password"
                    class="form-control"
                    id="inputPassword"
                    placeholder="Password"
                    :class="{
                      'is-invalid': $v.password.$error,
                    }"
                    v-model="$v.password.$model"
                  />
                </div>
              </div>
            </form>
            <button class="btn btn-primary" @click="submit()">Login</button>
            <br />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import axios from "@/plugins/axios";

export default {
  validations: {
    username: {
      required,
    },
    password: {
      required,
    },
    error: {},
  },
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    submit() {
      const data = {
        username: this.username,
        password: this.password,
      };

      axios
        .post("/login", data)
        .then((res) => {
          const token = res.data.token;
          localStorage.setItem("token", token);
          this.$emit("auth-change");
          this.$router.push({ path: "/" });
        })
        .catch((error) => {
          this.error = error.response.data;
          console.log(error.response.data);
        });
    },
  },
};
</script>