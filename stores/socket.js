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
      setTimeout(() => socket.value.connect(), 500)
    })

    socket.value.on('connect_error', () => {
      console.warn("CONNECT ERROR")
      setTimeout(() => socket.value.connect(), 500)
    })

    socket.value.on("reconnection_attempt", () => {
      console.warn("RECONNECTION ATTEMPT")
    })

    socket.value.on("reconnect", () => {
      console.warn("RECONNECTED")
      if(!process.client) return;
      if(localStorage.getItem('accessToken')) {
        let accessToken = JSON.stringify({accessToken: localStorage.getItem('accessToken')})
        console.log(`sending auth upon reconnect: ${accessToken}`)
        emit('auth', accessToken)

        if(route.params.id) {
          let route = useRoute();
          console.log(`sending emit upon reconnect: ${JSON.stringify({ gameId: route.params.id })}`)
          emit('room', JSON.stringify({ gameId: route.params.id }))
        }
      }
    })

    socket.value.on('info_message', (resp) => {
      //console.log(resp)
    })
  }

  function disconnect(){
    socket.value.disconnect()
  }

  function emit(name, body){
    console.log(name, body)
    socket.value.emit(name, body)
  }

  function listen(name, callback){
    socket.value.on(name, callback)
  }

  return {socketGetter, init, emit, listen}
})