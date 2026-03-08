<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\ExpertController as ApiExpertController;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpertDetailsPageController extends Controller
{
    public function show(Request $request, int $id): Response
    {
        $api = app(ApiExpertController::class);
        $response = $api->show($request, $id);
        $status = $response->getStatusCode();
        $data = $response->getData(true);

        return Inertia::render('ExpertDetails/ExpertDetails', [
            'id' => $id,
            'expert' => $status === 200 ? ($data['expert'] ?? null) : null,
            'assignedMissions' => $status === 200 ? ($data['assignedMissions'] ?? []) : [],
        ]);
    }
}
