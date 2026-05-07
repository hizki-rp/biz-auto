<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

// GET - Get analytics data
if ($method === 'GET') {
    try {
        // Total businesses
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM businesses");
        $totalBusinesses = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Total submissions
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM submissions");
        $totalSubmissions = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Total time wasted (calculate weekly hours)
        $stmt = $pdo->query("
            SELECT 
                frequency,
                SUM(time_spent_hours) as total_hours
            FROM tasks
            GROUP BY frequency
        ");
        
        $timeByFrequency = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $totalTimeWasted = 0;
        
        foreach ($timeByFrequency as $row) {
            $multiplier = 1;
            switch ($row['frequency']) {
                case 'daily':
                    $multiplier = 5; // 5 days a week
                    break;
                case 'weekly':
                    $multiplier = 1;
                    break;
                case 'monthly':
                    $multiplier = 0.25; // ~1 week per month
                    break;
                case 'quarterly':
                    $multiplier = 0.08; // ~1/12 of a week
                    break;
            }
            $totalTimeWasted += $row['total_hours'] * $multiplier;
        }
        
        echo json_encode([
            'total_businesses' => (int)$totalBusinesses,
            'total_submissions' => (int)$totalSubmissions,
            'total_time_wasted_hours' => round($totalTimeWasted, 2)
        ]);
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
