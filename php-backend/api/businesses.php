<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

// GET - List all businesses with their submissions
if ($method === 'GET') {
    try {
        // Check if requesting a specific business
        $id = $_GET['id'] ?? null;
        
        if ($id) {
            // Get single business with all related data
            $stmt = $pdo->prepare("SELECT * FROM businesses WHERE id = ?");
            $stmt->execute([$id]);
            $business = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$business) {
                http_response_code(404);
                echo json_encode(['error' => 'Business not found']);
                exit();
            }
            
            // Get submissions for this business
            $stmt = $pdo->prepare("SELECT * FROM submissions WHERE business_id = ?");
            $stmt->execute([$id]);
            $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Get tasks and pain points for each submission
            foreach ($submissions as &$submission) {
                $submission['tools_used'] = json_decode($submission['tools_used'], true) ?? [];
                
                // Get tasks
                $stmt = $pdo->prepare("SELECT * FROM tasks WHERE submission_id = ?");
                $stmt->execute([$submission['id']]);
                $submission['tasks'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Get pain points
                $stmt = $pdo->prepare("SELECT * FROM pain_points WHERE submission_id = ?");
                $stmt->execute([$submission['id']]);
                $submission['pain_points'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            
            $business['submissions'] = $submissions;
            echo json_encode($business);
        } else {
            // Get all businesses
            $stmt = $pdo->query("SELECT * FROM businesses ORDER BY created_at DESC");
            $businesses = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['results' => $businesses]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// POST - Create new business
elseif ($method === 'POST') {
    try {
        $data = getJsonInput();
        
        $stmt = $pdo->prepare("
            INSERT INTO businesses (name, industry, size, location, description, contact_email, contact_phone)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $data['name'],
            $data['industry'],
            $data['size'],
            $data['location'],
            $data['description'] ?? '',
            $data['contact_email'] ?? '',
            $data['contact_phone'] ?? ''
        ]);
        
        $businessId = $pdo->lastInsertId();
        
        // Get the created business
        $stmt = $pdo->prepare("SELECT * FROM businesses WHERE id = ?");
        $stmt->execute([$businessId]);
        $business = $stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(201);
        echo json_encode($business);
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
