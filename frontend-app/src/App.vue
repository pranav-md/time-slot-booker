<template>
  <nav class="navbar">
    <RouterLink to="/events/book" class="nav-link">Book Event</RouterLink>
    <RouterLink to="/events/search" class="nav-link">Search Events</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #007acc;
  padding: 15px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
}

.nav-link {
  margin: 0 20px;
  color: #fff;
  font-size: 1.1em;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s ease, border-bottom 0.3s ease;
  border-bottom: 2px solid transparent;
  padding-bottom: 4px;
}

.nav-link:hover {
  color: #ffdd57;
  border-bottom: 2px solid #ffdd57;
}
</style>
