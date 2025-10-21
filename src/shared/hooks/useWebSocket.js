import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook for WebSocket connection
 * @param {string} url - WebSocket URL
 * @param {object} options - Configuration options
 * @returns {object} WebSocket utilities
 */
export const useWebSocket = (url, options = {}) => {
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnect = true,
    reconnectInterval = 3000,
    reconnectAttempts = 5,
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const wsRef = useRef(null)
  const reconnectCountRef = useRef(0)
  const reconnectTimeoutRef = useRef(null)

  const connect = () => {
    try {
      const ws = new WebSocket(url)

      ws.onopen = (event) => {
        setIsConnected(true)
        reconnectCountRef.current = 0
        onOpen?.(event)
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        setLastMessage(data)
        onMessage?.(data)
      }

      ws.onclose = (event) => {
        setIsConnected(false)
        onClose?.(event)

        // Attempt reconnection
        if (
          reconnect &&
          reconnectCountRef.current < reconnectAttempts
        ) {
          reconnectCountRef.current++
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }

      ws.onerror = (error) => {
        onError?.(error)
      }

      wsRef.current = ws
    } catch (error) {
      console.error('WebSocket connection error:', error)
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }

  const sendMessage = (data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [url])

  return {
    isConnected,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect: connect,
  }
}
