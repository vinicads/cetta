<template>
    <div class="menu">
      <ul>
        <li v-for="item in items" :key="item.id" :class="idAtual == item.id ? 'active' : ''" @click="selectItem(item.id)">
          {{ item.name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    data() {
        return {
            idAtual: 1,
        };
    },
    methods: {
      selectItem(id) {
        this.idAtual = id;
        this.$emit('select-item', id);
      }
    }
  };
  </script>
  
  <style scoped>
  .menu {
    padding: 10px;
    background-color: #f4f4f4;
    border-right: 1px solid #ddd;
  }
  .menu ul {
    list-style-type: none;
    padding: 0;
  }
  .menu li {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
  }
  .menu li:hover, .menu li.active {
    background-color: #e0e0e0;
  }

  @media (max-width: 768px) {
    .menu li.active {
    background-color: transparent;
  }
}
  </style>
  