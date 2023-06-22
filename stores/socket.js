import { defineStore } from 'pinia'
import { io } from 'socket.io-client';

export const useSocketStore = defineStore('socket', () => {
  const socket = ref()

  const socketGetter = computed(() => socket.value)

  function init(url='https://socket-dev.thechess.io'){
    if(socket.value) return;

    socket.value = io(url)

    socket.value.on('disconnect', () => {
      console.warn("DISCONNECT")
      socket.value.connect()
    })

    socket.value.on("reconnection_attempt", () => {
      console.warn("RECONNECTION ATTEMPT")
    })

    socket.value.on("reconnect", () => {
      console.warn("RECONNECTED")
      if(process.client && localStorage.getItem('accessToken')) {
        emit("auth", JSON.stringify({accessToken: localStorage.getItem('accessToken')}))
      }
      let route = useRoute();
      if(process.client && route.params.id) emit('room', JSON.stringify({ gameId: route.params.id }))
    })

    socket.value.on('info_message', (resp) => {
      //console.log(resp)
    })
  }

  function disconnect(){
    socket.value.disconnect()
  }

  function emit(name, body){
    //console.log(name, body)
    socket.value.emit(name, body)
  }

  function listen(name, callback){
    socket.value.on(name, callback)
  }

  return {socketGetter, init, emit, listen}
})