<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Queries\Dashboard\DashboardOverviewQuery;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

final class DashboardController extends Controller
{
    public function __invoke(Request $request, DashboardOverviewQuery $overview): Response
    {
        $user = Auth::user();

        if (! $user) {
            abort(403);
        }

        $referenceMonth = $this->resolveReferenceMonth($request->query('month'));
        $data = $overview->handle($user, $referenceMonth);

        $monthOptions = collect(range(0, 5))
            ->map(fn (int $offset) => CarbonImmutable::now()->startOfMonth()->subMonths($offset))
            ->sortDesc()
            ->values()
            ->map(fn (CarbonImmutable $month) => [
                'value' => $month->format('Y-m'),
                'label' => $month->isoFormat('MMM YYYY'),
            ]);

        return Inertia::render('dashboard', array_merge($data, [
            'selected_month' => $referenceMonth->format('Y-m'),
            'month_options'  => $monthOptions,
        ]));
    }

    private function resolveReferenceMonth(?string $month): CarbonImmutable
    {
        if ($month && preg_match('/^\d{4}-\d{2}$/', $month)) {
            try {
                return CarbonImmutable::createFromFormat('Y-m', $month)->startOfMonth();
            } catch (Throwable) {
                // fall through to default
            }
        }

        return CarbonImmutable::now()->startOfMonth();
    }
}
