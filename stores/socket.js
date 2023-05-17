import { defineStore } from 'pinia'
import { io } from 'socket.io-client';

export const useSocketStore = defineStore('socket', () => {
  const socket = ref()

  const socketGetter = computed(() => socket.value)

  function init(url='https://socket-dev.thechess.io'){
    if(socket.value) return;

    socket.value = io(url)

    /*
    socket.value.on('disconnect', () => {
      console.warn("DISCONNECT")
    })
    */

    socket.value.on('info_message', (resp) => {
      console.log(resp)
    })
  }

  function disconnect(){
    socket.value.disconnect()
  }

  function emit(name, body){
    console.log(socket.value)
    socket.value.emit(name, body)
  }

  function listen(name, callback){
    socket.value.on(name, callback)
  }

  return {socketGetter, init, emit, listen}
})