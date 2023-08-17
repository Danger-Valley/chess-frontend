export default defineNuxtPlugin(() => {
  return {
    provide: {
      togglePopup(id) {
        document.querySelector(`#${id}`).classList.toggle('popup__wrapper--active');
        document.body.classList.toggle('no-overflow')
      }
    }
  }
})