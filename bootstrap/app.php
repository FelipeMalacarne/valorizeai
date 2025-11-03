<?php

declare(strict_types=1);

use App\Exceptions\Contracts\FlashableForInertia;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);
        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_TRAEFIK,
        );

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withEvents(discover: false)
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function ($response, Throwable $exception, Request $request) {
            if ($exception instanceof FlashableForInertia) {
                if ($request->expectsJson()) {
                    return response()->json($exception->json(), $exception->status());
                }

                return back()->with($exception->flash());
            }

            $isServerError = in_array($response->getStatusCode(), [500, 503], true);
            $isInertia = $request->headers->get('X-Inertia') === 'true';
            $isAuthorizationError = $response->getStatusCode() === 403;

            if ($isServerError && $isInertia) {
                $errorMessage = 'Um erro interno ocorreu, por favor tente novamente. Se o problema persistir, entre em contato com o suporte.';
                if (app()->isLocal()) {
                    $errorMessage .= sprintf("\n%s: %s", get_class($exception), $exception->getMessage());
                }

                return back()->with([
                    'error' => $errorMessage,
                ]);
            }

            if ($isAuthorizationError && $isInertia) {
                return back()->with([
                    'error' => 'Você não tem permissão para realizar esta ação.',
                ]);
            }

            if ($response->getStatusCode() === 419) {
                return back()->with([
                    'error' => 'A pagina expirou, por favor tente novamente.',
                ]);
            }

            return $response;
        });
    })->create();
