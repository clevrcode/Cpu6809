<template>
    <div class="header">
        <div class="header_title">
            CPU 6809 Debugger
        </div>
        <div class="header_bar">
        </div>
    </div>
    <nav class="header-nav">
        <li class="header-nav_item">
            <NuxtLink to="/">Console</NuxtLink>                
        </li>
        <li class="header-nav_item">
            <NuxtLink to="/debugger">Source</NuxtLink>
        </li>
    </nav>
</template>

<script setup>

</script>

<style scoped>

.header {
    margin: 0;
    padding: 0;
}

.header_title {
    font-family: "Orbitron", sans-serif;
    /* font-optical-sizing: auto; */
    font-size: 2.5rem;
    font-weight: 400;
    font-style: normal;
    background-color: #fb660c;
    color: white;
    border-bottom: solid 2px white;
    width: 100%;
    padding: 0 10px;
}
.header_bar {
    background-color: #f99a08;
    height: 20px;
    padding: 0;
    margin: 0;
}

.header-nav {
    background-color: black;;
    font-weight: 300;
    font-style: normal;
}

.header-nav_item {
    display: inline-block;
    padding: 1.0rem 0.5rem 1.0rem 0.5rem;
}

.header-nav_item a {
  text-decoration: none;
  color: white;
  border: none;
  padding: 5px 0;
  font-size: 20px;
  background-position: 0 100%; /*OR bottom left*/
  background-size: 0% 1px;
  background-repeat: no-repeat;
  transition:
    background-size 0.4s,
    background-position 0s 0.4s; /*change after the size immediately*/
}

.header-nav_item a:active,
.header-nav_item a:hover {
    color: red;
    /* border-bottom: #b5dcad 1px solid; */
    background-position: 100% 100%; /*OR bottom right*/
    background-size: 100% 1px;
}
a.router-link-active {
    color: yellow;
    background-position: 100% 100%; /*OR bottom right*/
    background-size: 100% 1px;    
}

</style>