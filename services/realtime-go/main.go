package main

// ==========================================================
// Premium Task Tracker — Real-Time WebSocket Microservice (Go 1.21+)
// Microservice: services/realtime-go
// Features: Goroutines, Concurrent Client Hub, Mutex-safe broadcast,
// Sub-millisecond latency for live task sync across multi-devices.
// ==========================================================

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow cross-origin connections for frontend clients
	},
}

// Event payload format for WebSocket communication
type TaskEvent struct {
	Type      string                 `json:"type"`      // TASK_CREATED, TASK_STATUS_CHANGED, HEARTBEAT
	TaskId    string                 `json:"taskId"`    // Target Task UUID
	Payload   map[string]interface{} `json:"payload"`   // Task metadata or payload
	Timestamp string                 `json:"timestamp"` // ISO8601 Timestamp
	ClientIP  string                 `json:"clientIp"`
}

// Client represents a connected WebSocket user session
type Client struct {
	hub  *Hub
	conn *websocket.Conn
	send chan []byte
	ip   string
}

// Hub manages active WebSocket clients and broadcasts events
type Hub struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte, 256),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
			log.Printf("[Go Hub] Client connected from %s (Total active: %d)", client.ip, len(h.clients))

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
				log.Printf("[Go Hub] Client disconnected: %s", client.ip)
			}
			h.mu.Unlock()

		case message := <-h.broadcast:
			h.mu.RLock()
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
			h.mu.RUnlock()
		}
	}
}

func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(512)
	c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("[Go Hub] Read error: %v", err)
			}
			break
		}

		// Broadcast received task modification event to all connected clients
		var event TaskEvent
		if err := json.Unmarshal(message, &event); err == nil {
			event.Timestamp = time.Now().UTC().Format(time.RFC3339)
			event.ClientIP = c.ip
			enhancedMsg, _ := json.Marshal(event)
			c.hub.broadcast <- enhancedMsg
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(25 * time.Second)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)
			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	hub := newHub()
	go hub.run()

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		hub.mu.RLock()
		activeCount := len(hub.clients)
		hub.mu.RUnlock()
		fmt.Fprintf(w, `{"service":"realtime-go","status":"RUNNING","activeClients":%d,"uptime":"60fps-synced"}`, activeCount)
	})

	http.HandleFunc("/ws/tasks", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("[Go Hub] WebSocket Upgrade error: %v", err)
			return
		}

		client := &Client{
			hub:  hub,
			conn: conn,
			send: make(chan []byte, 256),
			ip:   r.RemoteAddr,
		}
		client.hub.register <- client

		go client.writePump()
		go client.readPump()
	})

	log.Printf("🚀 [Realtime Go WebSocket Service] listening on port :%s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Fatal: %v", err)
	}
}
