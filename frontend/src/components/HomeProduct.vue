<template>
  <div class="pt-3 row" :id="Title.title">
    <!-- left -->
    <div class="col-6">
      <div v-if="col % 2 != 0">
        <div
          class="text-light d-flex m-5 pl-3"
          :class="{
            'justify-content-end': col % 2 == 0,
            'justify-content-start': col % 2 != 0,
          }"
        >
          <h4 class="title display-3">
            {{ Title.title }}
          </h4>
        </div>

        <div class="row ml-5">
          <div class="col-5" v-for="item in products" :key="item">
            <router-link
              v-if="item.instrument_id == index.catalog_id"
              class="card nav-link card-bg p-2 m-2 pb-0"
              :to="{ name: 'Catalog', params: { title: item } }"
            >
              <img
                :src="'http://localhost:3000' + item.CatalogImg"
                alt=""
                style="height: 9rem"
              />
              <div class="card-body p-1 text-center">
                <p class="card-text text-black">
                  {{ item.name }}
                </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- right -->
    <div class="col-6">
      <div v-if="col % 2 == 0">
        <div
          class="text-light d-flex mt-5 mb-4 mr-5 pr-5"
          :class="{
            'justify-content-end': col % 2 == 0,
            'justify-content-start': col % 2 != 0,
          }"
        >
          <h4 class="titleCat display-3">
            {{ Title.title }}
          </h4>
        </div>
        <div class="row">
          <div class="col-5" v-for="item in products" :key="item">
            <router-link
              v-if="item.instrument_id == index.catalog_id"
              class="card nav-link card-bg p-2 m-2 pb-0"
              :to="{ name: 'Catalog', params: { title: item } }"
            >
              <img
                :src="'http://localhost:3000' + item.CatalogImg"
                alt=""
                style="height: 9rem"
              />
              <div class="card-body py-1 pb-0 pt-2 text-center">
                <p class="card-text text-black">
                  {{ item.name }}
                </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    Title: [],
    products: [],
    index: [],
    col: Number,
  },
};
</script>
<style scoped>
.card-bg {
  background-color: rgb(54, 54, 54);
  transition: all 0.3s;
}
.card-bg:hover {
  transform: scale(1.1);
}
a {
  color: white;
}
a:hover {
  text-decoration: none;
}
</style>