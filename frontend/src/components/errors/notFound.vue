<template>
    <section class="page_404">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <div class="col-sm-10 col-sm-offset-1 text-center">
              <div class="four_zero_four_bg">
                <h1 class="text-center">404</h1>
              </div>
              <div class="contant_box_404">
                <h3 class="h2">
                  Parece que você está perdido
                </h3>
                <p>A página que você está procurando não está disponível!</p>
                <router-link to="/" class="link_404">Ir para Home</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: "PageNotFound"
  };
  </script>
  
  <style scoped>
  /*======================
      404 page
  =======================*/
  
  .page_404 {
    margin-top: 7rem;
    padding: 40px 0;
    background: #fff;
    font-family: 'Arvo', serif;
    
  }
  
  .page_404 img {
    width: 100%;
  }
  
  .four_zero_four_bg {
    background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
    height: 400px;
    background-position: center;
  }
  
  .four_zero_four_bg h1 {
    font-size: 80px;
  }
  
  .four_zero_four_bg h3 {
    font-size: 80px;
  }
  
  .link_404 {
    color: #fff !important;
    padding: 10px 20px;
    border-radius: 15px;
    background: var(--cor-principal);
    margin: 20px 0;
    display: inline-block;
  }
  
  .contant_box_404 {
    margin-top: -50px;
  }
  </style>
  