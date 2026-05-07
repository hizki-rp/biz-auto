<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

// POST - Add pain point to submission
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
            INSERT INTO pain_points (submission_id, title, description, severity, cost_impact)
            VALUES (?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $submissionId,
            $data['title'],
            $data['description'],
            $data['severity'],
            $data['cost_impact'] ?? null
        ]);
        
        $painPointId = $pdo->lastInsertId();
        
        // Get the created pain point
        $stmt = $pdo->prepare("SELECT * FROM pain_points WHERE id = ?");
        $stmt->execute([$painPointId]);
        $painPoint = $stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(201);
        echo json_encode($painPoint);
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
