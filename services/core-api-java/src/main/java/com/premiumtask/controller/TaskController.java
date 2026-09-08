package com.premiumtask.controller;

import com.premiumtask.model.Task;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/tasks")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TaskController {

    // Demonstrative REST API endpoint for Spring Boot Core Service
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "core-api-java-springboot");
        response.put("status", "UP");
        response.put("framework", "Spring Boot 3.2");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createTask(@Valid @RequestBody Task taskRequest) {
        taskRequest.setId(System.currentTimeMillis() % 100000);
        taskRequest.setUuid(UUID.randomUUID().toString());
        taskRequest.setCreatedAt(LocalDateTime.now());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Task successfully persisted via Java Spring Boot Service");
        response.put("data", taskRequest);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTasks(
            @RequestParam(required = false) Task.TaskStatus status,
            @RequestParam(required = false) Task.TaskPriority priority) {
        
        List<Map<String, Object>> tasks = new ArrayList<>();
        Map<String, Object> task1 = new HashMap<>();
        task1.put("id", 101);
        task1.put("uuid", UUID.randomUUID().toString());
        task1.put("title", "High-Throughput Task Sharding Engine");
        task1.put("status", "IN_PROGRESS");
        task1.put("priority", "HIGH");
        task1.put("category", "Architecture");
        tasks.add(task1);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("total", tasks.size());
        response.put("data", tasks);

        return ResponseEntity.ok(response);
    }
}
