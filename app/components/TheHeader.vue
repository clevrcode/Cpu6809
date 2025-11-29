<template>
    <div class="header">
        <div class="header_title">
            CPU 6809 Debugger
        </div>
        <nav class="header-nav">
            <li class="header-nav_item">
                <NuxtLink to="/">Console</NuxtLink>                
            </li>
            <li class="header-nav_item">
                <NuxtLink to="/debugger">Source</NuxtLink>
            </li>
        </nav>
    </div>
    <div class="header-bar">
    </div>
</template>

<script setup>

</script>

<style scoped>

.header {
    display: flex;
    flex-direction: row;
    background-color: #fb660c;
    margin: 0;
    padding: 0;
}

.header_title {
    font-family: "Orbitron", sans-serif;
    /* font-optical-sizing: auto; */
    font-size: 2.5rem;
    font-weight: 400;
    font-style: normal;
    color: white;
    border-bottom: solid 2px white;
    width: 100%;
    padding: 0 10px;
}

.header-bar {
    background-color: #f99a08;
    height: 20px;
    width: 100%;
    padding: 0;
    margin: 0;
}

.header-nav {
    display: flex;
    flex-direction: row;
    /* background-color: black; */
    font-weight: 300;
    font-style: normal;
    border-bottom: solid 2px white;
}

.header-nav_item {
    display: inline-block;
    padding: 1.0rem;
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
    color: black;
}
a.router-link-active {
    color: yellow;
    background-position: 100% 100%; /*OR bottom right*/
    background-size: 100% 1px;    
}

</style>