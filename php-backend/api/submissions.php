<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

// POST - Create new submission
if ($method === 'POST') {
    try {
        $data = getJsonInput();
        
        // Create submission
        $stmt = $pdo->prepare("
            INSERT INTO submissions (business_id, workflow_name, tools_used, status)
            VALUES (?, ?, ?, 'pending')
        ");
        
        $toolsJson = json_encode($data['tools_used'] ?? []);
        
        $stmt->execute([
            $data['business'],
            $data['workflow_name'],
            $toolsJson
        ]);
        
        $submissionId = $pdo->lastInsertId();
        
        // Get the created submission
        $stmt = $pdo->prepare("SELECT * FROM submissions WHERE id = ?");
        $stmt->execute([$submissionId]);
        $submission = $stmt->fetch(PDO::FETCH_ASSOC);
        $submission['tools_used'] = json_decode($submission['tools_used'], true);
        
        http_response_code(201);
        echo json_encode($submission);
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
