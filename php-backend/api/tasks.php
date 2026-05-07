<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

// POST - Add task to submission
if ($method === 'POST') {
    try {
        // Get submission_id from URL parameter
        $submissionId = $_GET['submission_id'] ?? null;
        
        if (!$submissionId) {
            http_response_code(400);
            echo json_encode(['error' => 'submission_id is required']);
            exit();
        }
        
        $data = getJsonInput();
        
        $stmt = $pdo->prepare("
            INSERT INTO tasks (submission_id, name, description, frequency, time_spent_hours, is_manual, error_rate)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $submissionId,
            $data['name'],
            $data['description'],
            $data['frequency'],
            $data['time_spent_hours'],
            $data['is_manual'] ? 1 : 0,
            $data['error_rate'] ?? null
        ]);
        
        $taskId = $pdo->lastInsertId();
        
        // Get the created task
        $stmt = $pdo->prepare("SELECT * FROM tasks WHERE id = ?");
        $stmt->execute([$taskId]);
        $task = $stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(201);
        echo json_encode($task);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
