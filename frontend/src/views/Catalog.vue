<template>
  <div class="text-light">
    <div
      class="bg-black d-flex justify-content-end m-0 pt-5 pr-3"
      style="padding-right: 10rem"
    >
      <h1 class="titleCat display-1">
        {{ $route.params.title.name }}
      </h1>
    </div>
    <div class="container">
      <div class="row justify-content-center">
        <div
          class="col-12 pl-5"
          style="background: rgb(60, 60, 60); padding-bottom: 11vh"
        >
          <div v-if="role == 'Admin'">
            <button
              class="btn btn-primary mt-3"
              @click="addP = !addP"
              v-if="!addP && !editP"
            >
              Add Product
            </button>
            <button
              class="btn btn-secondary mt-3"
              @click="
                addP = !addP;
                model = '';
                brand = '';
              "
              v-if="addP"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-warning mt-3 ml-3"
              @click="editP = !editP"
              v-if="!addP && !editP"
            >
              Edit
            </button>
            <button
              type="button"
              class="btn btn-secondary my-3"
              @click="
                selectP = '';
                editP = !editP;
              "
              v-if="editP"
            >
              Cancel
            </button>
            <div class="input-group mb-3" v-if="editP">
              <input
                type="file"
                class="form-control"
                id="customFile"
                accept="image/*"
                @change="EditFiles"
                :disabled="!selectP"
              />
              <input
                type="text"
                class="form-control"
                placeholder="Add Model"
                v-model="selectP.model"
                :disabled="!selectP"
              />
              <input
                type="text"
                class="form-control"
                placeholder="Add Brand"
                v-model="selectP.brand"
                :disabled="!selectP"
              />
              <select
                class="custom-select"
                id="inputGroupSelect02"
                v-model="selectP"
              >
                <option v-for="item in arrProduct" :key="item" :value="item">
                  {{ item.model }}
                </option>
              </select>
              <div class="input-group-append">
                <label class="input-group-text" for="inputGroupSelect02"
                  >Product</label
                >
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-warning"
                    type="button"
                    @click="EditProduct()"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-3" v-if="addP">
              <div class="input-group">
                <input
                  type="file"
                  accept="image/*"
                  class="form-control"
                  @change="addFiles"
                />
                <input
                  type="text"
                  class="form-control"
                  placeholder="Add Model"
                  :class="{ 'is-invalid': $v.model.$error }"
                  v-model="$v.model.$model"
                />
                <input
                  type="text"
                  class="form-control"
                  placeholder="Add Brand"
                  :class="{ 'is-invalid': $v.brand.$error }"
                  v-model="$v.brand.$model"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-primary"
                    type="button"
                    @click="submitProduct()"
                  >
                    Add
                  </button>
                </div>
              </div>
              <template v-if="$v.model.$error">
                <small class="text-danger" v-if="!$v.model.required"
                  >This field is required<br
                /></small>
                <small class="text-danger" v-if="!$v.model.maxLength"
                  >Model Must less than 20 lettes<br
                /></small>
              </template>
              <template v-if="$v.brand.$error">
                <small class="text-danger" v-if="!$v.brand.required"
                  >This field is required<br
                /></small>
                <small class="text-danger" v-if="!$v.brand.maxLength"
                  >Brand Must less than 20 lettes<br
                /></small>
              </template>
            </div>
          </div>
          <div class="row text-dark ml-5">
            <card
              v-for="(i, index) in arrProduct"
              :key="i"
              :text="i"
              :position="index"
              :Products="arrProduct"
              :user="user"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "@/plugins/axios";

const card = () => import("@/components/ProductCard");
import { required, maxLength } from "vuelidate/lib/validators";
export default {
  components: { card },
  props: {
    user: [],
  },
  data() {
    return {
      selectP: "",
      editP: false,
      addP: false,
      arrProduct: [],
      model: "",
      brand: "",
      image: "",
      ChangeImg: "",
      Emodel: "",
      Ebrand: "",
      role: null,
    };
  },
  validations: {
    model: {
      required,
      maxLength: maxLength(20),
    },
    brand: {
      required,
      maxLength: maxLength(20),
    },
  },
  methods: {
    EditFiles(event) {
      this.ChangeImg = event.target.files;
    },
    addFiles(event) {
      this.image = event.target.files;
    },
    EditProduct() {
      // เช็คว่าในฟอร์มไม่มี error
      if (this.selectP) {
        let Editdata = new FormData();
        Editdata.append("productid", this.selectP.product_id);
        Editdata.append("model", this.selectP.model);
        Editdata.append("brand", this.selectP.brand);
        Editdata.append("imgid", this.selectP.img_id);
        if (this.ChangeImg) {
          this.ChangeImg.forEach((image) => {
            Editdata.append("myImage", image);
          });
        }
        axios
          .put("/product", Editdata)
          .then((res) => (this.selectP.url = res.data))
          .catch((e) => console.log(e.response.data));
        this.ChangeImg = "";
        this.editP = !this.editP;
        setTimeout(function () {
          this.selectP = "";
        }, 1000);
      } else {
        alert("Select Product");
      }
    },
    submitProduct() {
      this.$v.$touch();
      // เช็คว่าในฟอร์มไม่มี error
      if (!this.$v.$invalid) {
        if (this.image) {
          let formData = new FormData();
          formData.append("catalogid", this.$route.params.title.catalog_id);
          formData.append("model", this.model);
          formData.append("brand", this.brand);
          this.image.forEach((image) => {
            formData.append("myImage", image);
          });
          axios
            .post("/catalog", formData)
            .then((res) => this.arrProduct.push(res.data[0]))
            .catch((e) => console.log(e.response.data));
          this.model = "";
          this.brand = "";
          this.image = "";
          this.addP = !this.addP;
        } else {
          alert("Select Image");
        }
      }
    },
  },
  mounted() {
    axios
      .get(`/catalog/${this.$route.params.title.catalog_id}`)
      .then((response) => (this.arrProduct = response.data))
      .catch((err) => {
        console.log(err);
      });
    this.role = this.user.user_role;
  },
};
</script>
<style scoped>
</style>