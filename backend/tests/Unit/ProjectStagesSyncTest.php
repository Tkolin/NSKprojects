<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Project;
use App\Services\ProjectStagesSync;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProjectStagesSyncTest extends TestCase
{
    use RefreshDatabase;

    public function testInvokeMethodSyncsProjectStagesCorrectly()
    {
        // Setup initial data
        $project = Project::factory()->create([
            'price' => 1000.00,
            'prepayment' => 20,
        ]);

        $stages = [
            ['stage_id' => 1, 'project_id' => $project->id, 'percent' => 25, 'number' => 1, 'date_start' => '2024-07-01', 'duration' => 10, 'date_end' => '2024-07-10'],
            ['stage_id' => 2, 'project_id' => $project->id, 'percent' => 75, 'number' => 2, 'date_start' => '2024-07-11', 'duration' => 20, 'date_end' => '2024-07-31'],
        ];

        $args = ['items' => $stages];

        // Create an instance of the service
        $service = new \App\GraphQL\Mutations\ProjectStagesSync();

        // Call the __invoke method
        $result = $service->__invoke(null, $args);

        // Verify the results
        $this->assertCount(2, $result);
        $this->assertEquals(25, $result[0]['percent']);
        $this->assertEquals(200.0, $result[0]['price']);
        $this->assertEquals(160.0, $result[0]['price_to_paid']);
        $this->assertEquals(75, $result[1]['percent']);
        $this->assertEquals(600.0, $result[1]['price']);
        $this->assertEquals(480.0, $result[1]['price_to_paid']);
    }
}
